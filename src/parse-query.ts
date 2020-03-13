import nconf from 'nconf';
import path from 'path';
import { readFileSync } from 'fs';

export type Meta = {
    type?: 'query' | 'mutation';
    operation?: string;
};

export type ASTNode = {
    name: string;
    children?: Record<string, ASTNode>;
};

const getFragmentContent = (relpath: string) => {
    const fpath = relpath.startsWith('.')
        ? path.join(path.dirname(nconf.get('input')), relpath)
        : path.join(nconf.get('basePath'), relpath);
    const file = readFileSync(fpath).toString();
    const fragNameMatch = file.match(/fragment\s+(\w+)\s+on/);
    if (!fragNameMatch) {
        throw new Error(`Failed to find fragment in file ${fpath}`);
    }

    return {
        [fragNameMatch[1]]: file
            .split('\n')
            .filter(l => !l.startsWith('fragment') && !l.startsWith('}'))
            .join('\n')
    };
};

const applyFragments = (query: string) => {
    if (!query.includes('...')) return query;

    const imports = (
        query.match(/#import ".+"/g)?.map(imp => {
            const importPathMatch = imp.match(/import\s+"(.+)"/);
            if (!importPathMatch) {
                throw new Error(`Failed to match import path in ${imp}`);
            }
            return getFragmentContent(importPathMatch[1]);
        }) ?? []
    ).reduce((acc, frag) => ({ ...acc, ...frag }), {});

    Object.keys(imports).forEach(fragment => {
        query = query.replace(`...${fragment}`, imports[fragment]);
    });

    return query;
};

const parseQuery = (query: string) => {
    query = applyFragments(query);

    if (query.includes('...')) {
        const fragment = query.match(/\.\.\.(\w+)/);
        if (fragment?.[1]) {
            throw new Error(
                `Found unresolved fragment "${fragment[1]}" in query.`
            );
        }
        throw new Error('Found unresolved fragment in query');
    }

    const cleanQuery = query
        .split('\n')
        .filter(l => !l.startsWith('#'))
        .join('\n');

    const tokens = cleanQuery.split(/\s+/);

    const meta: Meta = {};
    const ast: Record<string, ASTNode> = {};
    const stack: string[] = [];

    let isOperationName = false;
    let previousNode: string | undefined = undefined;
    let insideParams = false;

    tokens.forEach(token => {
        if (!token) return;

        if (insideParams) {
            if (token.includes(')')) {
                insideParams = false;
            }
            return;
        }

        if (token.includes('(')) {
            // parse first part of token
            token = token.split('(')[0];
            insideParams = true;
        }

        // meta
        if (stack.length === 0) {
            if (isOperationName) {
                meta.operation = token;
                isOperationName = false;
                return;
            }

            if (token === 'query' || token === 'mutation') {
                isOperationName = true;
                meta.type = token;
                return;
            }
        }

        if (token === '{') {
            if (previousNode) {
                stack.push(previousNode);
            }
            return;
        }

        if (token === '}') {
            stack.pop();
            return;
        }

        previousNode = token;
        if (stack.length === 0) return;

        if (!ast[stack[0]]) {
            ast[stack[0]] = { name: stack[0], children: {} };
        }

        let curr: ASTNode = ast[stack[0]];

        stack.slice(1).forEach(node => {
            if (!curr.children) curr.children = {};
            if (!curr.children[node]) curr.children[node] = { name: node };
            curr = curr.children[node];
        });

        if (!curr.children) curr.children = {};
        curr.children[token] = { name: token };
    });

    return { meta, ast };
};

export default parseQuery;
