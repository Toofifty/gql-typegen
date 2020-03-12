import nconf from 'nconf';
import { ASTNode } from './parse-query';
import pascal from './pascal';

type GraphQLScalarType = {
    name: string;
    kind: 'SCALAR';
    description: string | null;
};

type GraphQLObjectType = {
    name: string;
    kind: 'OBJECT' | 'LIST' | 'NON_NULL';
    fields: GraphQLField[];
    ofType: GraphQLFieldType | null;
    description: string | null;
};

type GraphQLEnumType = {
    name: string;
    kind: 'ENUM';
    enumValues: { name: string }[];
    description: string | null;
};

// top level type, e.g. ViewerType
type GraphQLType = GraphQLScalarType | GraphQLObjectType | GraphQLEnumType;

// field type
type GraphQLFieldType = {
    name: string | null;
    kind: 'OBJECT' | 'SCALAR' | 'LIST' | 'NON_NULL' | 'ENUM';
    ofType: GraphQLFieldType | null;
    description: string | null;
};

// field definition
type GraphQLField = {
    name: string | null;
    type: GraphQLFieldType;
    description: string | null;
};

export type TypedASTNode = {
    name: string;
    children?: Record<string, TypedASTNode>;
    typename: string;
    type: string;
    typedef?: string;
    description?: string | null;
};

const generateType = (type: GraphQLFieldType) => {
    if (type.name) {
        return getType(pascal(type.name), type.kind);
    }

    const stack: string[] = [];
    let finalType: string | undefined;
    stack.push(type.kind);
    let curr: GraphQLFieldType | null = type;
    while ((curr = curr.ofType)) {
        stack.push(curr.kind);
        if (curr.name) {
            finalType = curr.name;
            break;
        }
    }

    return stack.reverse().reduce((strType, type) => {
        if (type === 'LIST') {
            if (strType?.includes('|')) {
                return `(${strType})[]`;
            }
            return `${strType}[]`;
        }
        if (type === 'NON_NULL') {
            return strType;
        }
        return getType(strType!, type);
    }, finalType && pascal(finalType))!;
};

const getType = (strType: string, type: string) => {
    if (strType === 'ID') {
        return 'string';
    }
    if (type === 'SCALAR') {
        if (strType === 'Int' || strType === 'Float') {
            return 'number';
        }
        if (strType === 'DateTime') return 'string';
        return strType?.toLowerCase();
    }
    if (type === 'ENUM') {
        return `${nconf.get('enumPrefix') ?? ''}${strType}${nconf.get(
            'enumSuffix'
        ) ?? ''} | null`;
    }
    return `${nconf.get('typePrefix') ?? ''}${strType}${nconf.get(
        'typeSuffix'
    ) ?? ''} | null`;
};

const generateTypedef = (type: GraphQLType, fields: string[]) => {
    if (type.kind === 'SCALAR') {
        return undefined;
    }

    if (type.kind === 'ENUM') {
        return `type ${nconf.get('enumPrefix') ?? ''}${type.name}${nconf.get(
            'enumSuffix'
        ) ?? ''} = ${type.enumValues
            .map(value => `'${value.name}'`)
            .join(' | ')};`;
    }

    if (fields.length === 0) {
        throw new Error(`No fields requested for object type ${type.name}`);
    }

    const findField = (field: string) =>
        type.fields.find(({ name }) => name === field);

    return `type ${nconf.get('typePrefix') ?? ''}${pascal(
        type.name
    )}${nconf.get('typeSuffix') ?? ''} = {\n\t${fields
        .filter(field => field !== '__typename')
        .map(field => {
            const fieldDef = findField(field);
            if (!fieldDef || !fieldDef.type) {
                throw new Error(
                    `Could not find field ${field} in ${type.name}`
                );
            }
            const gtype = generateType(fieldDef.type);
            const desc =
                fieldDef.description ??
                (fieldDef.type.kind === 'OBJECT'
                    ? fieldDef.type.description
                    : undefined);
            if (desc) {
                return `/**\n\t * ${desc}\n\t */\n\t${field}: ${gtype}`;
            }
            return `${
                nconf.get('readonlyTypes') ? 'readonly ' : ''
            }${field}: ${gtype}`;
        })
        .join(';\n\t')};${
        nconf.get('addTypename') || fields.includes('__typename')
            ? `\n\t${
                  nconf.get('readonlyTypes') ? 'readonly ' : ''
              }__typename: '${type.name}';`
            : ''
    }\n};`;
};

export const findType = (
    introspection: GraphQLType[],
    node: ASTNode,
    stack: string[]
) => {
    if (node.name === '__typename') {
        const { absType, fieldType } = resolveType(
            introspection,
            stack.slice(0, stack.length - 1)
        );
        return {
            type: absType.name,
            typename: absType.name
        };
    }
    const { absType, fieldType } = resolveType(introspection, stack);
    const type = generateType(fieldType);
    const typedef = generateTypedef(absType, Object.keys(node.children ?? {}));
    return {
        type,
        typedef,
        typename: absType.name,
        description: fieldType.description ?? absType.description
    };
};

export const resolveType = (introspection: GraphQLType[], stack: string[]) => {
    return stack.reduce(
        ({ absType }, fieldName) => {
            const newField = absType.fields.find(
                ({ name }) => name === fieldName
            );
            if (!newField || !newField.type) {
                throw new Error(`Failed to resolve field ${fieldName}`);
            }
            const typeName = resolveAbsoluteType(newField.type);
            const newAbsType = introspection.find(
                ({ name }) => name === typeName
            );
            if (!newAbsType) {
                throw new Error(`Failed to resolve type ${typeName}`);
            }
            return { absType: newAbsType, fieldType: newField.type };
        },
        {
            absType: introspection.find(
                ({ name }) => name === 'RootSchemaQuery'
            )!,
            fieldType: undefined!
        } as { absType: GraphQLObjectType; fieldType: GraphQLFieldType }
    );
};

const resolveAbsoluteType = (type: GraphQLFieldType) => {
    if (type.name) return type.name;
    if (!type.ofType) {
        throw new Error(
            `Could not resolve absolute type in ${JSON.stringify(type)}`
        );
    }
    return resolveAbsoluteType(type.ofType);
};

const findTypes = (
    introspection: GraphQLType[],
    ast: Record<string, ASTNode>,
    stack: string[] = []
) => {
    const typedAst = ast as Record<string, TypedASTNode>;
    Object.keys(ast).forEach(key => {
        console.log('Resolving type for', key);
        const node = typedAst[key];
        const { type, typedef, typename } = findType(introspection, node, [
            ...stack,
            key
        ]);
        node.type = type;
        node.typedef = typedef;
        node.typename = typename;
        if (node.children) {
            node.children = findTypes(introspection, node.children, [
                ...stack,
                key
            ]);
        }
    });
    return typedAst;
};

export default findTypes;
