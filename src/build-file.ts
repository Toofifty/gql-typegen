import nconf from 'nconf';
import { writeFileSync } from 'fs';
import { Meta } from './parse-query';
import { TypedASTNode } from './find-type';
import chalk from 'chalk';

const buildFile = (
    fpath: string,
    meta: Meta,
    ast: Record<string, TypedASTNode>
) => {
    let file = `// pre-generated types for ${nconf.get('input')}
// do not edit directly!
// regenerate using the command \`typegen --input ${nconf.get('input')}\`

`;
    let addedDefs: string[] = [];

    // top level query type
    file += `export type ${nconf.get('finalTypePrefix') ?? ''}${
        meta.operation
    }${nconf.get('finalTypeSuffix') ?? ''} = {
${Object.keys(ast).map(
    key => `${nconf.get('indent') ?? '\t'}${key}: ${ast[key].type};\n`
)}};

`;

    const appendTypedefs = (node: TypedASTNode) => {
        if (node.typedef) {
            if (!addedDefs.includes(node.typename)) {
                console.log(chalk.yellow(`    Add ${node.typename} type`));
                const desc = node.description
                    ? '/**\n * ' + node.description + '\n */\n'
                    : '';
                file += `${desc}${node.typedef}\n\n`;
                addedDefs.push(node.typename);
            }
            if (node.children) {
                Object.keys(node.children).forEach(c =>
                    appendTypedefs(node.children![c])
                );
            }
        }
    };
    Object.keys(ast).forEach(c => appendTypedefs(ast[c]));

    writeFileSync(fpath, file);

    console.log(`🚀  Done! Output saved at ${chalk.blue(fpath)}`);
};

export default buildFile;
