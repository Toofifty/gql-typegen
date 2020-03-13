#!/usr/bin/env node

import chalk from 'chalk';
import { readFileSync } from 'fs';
import nconf from 'nconf';
import parseQuery from './parse-query';
import fetchSchema from './fetch-schema';
import findTypes from './find-type';
import buildFile from './build-file';

nconf.argv().file({ file: 'gql-typegen.json' });

nconf.required(['input']);

if (!nconf.get('input').match(/\.(graph|g)ql/)) {
    console.error(chalk.red('Input file must be a graphql or gql file'));
    process.exit(1);
}

(async () => {
    try {
        console.log(chalk.green('Fetching schema...'));
        const introspection = await fetchSchema();
        console.log(chalk.green('Schema fetched'));
        console.log(chalk.green('Parsing query...'));
        const query = parseQuery(readFileSync(nconf.get('input')).toString());
        console.log(
            `${query.meta.operation} ${query.meta.type}` +
                chalk.green(' successfully parsed')
        );
        console.log(chalk.green('Resolving types...'));
        const typedAST = findTypes(introspection, query.ast);
        const filePath =
            nconf.get('input').replace(/\.(graphql|gql)/i, '') +
            (nconf.get('fileSuffix') ?? '.d.ts');
        console.log(chalk.green('Generating file ') + filePath);
        buildFile(filePath, query.meta, typedAST);
    } catch (e) {
        console.error(e);
    }
})();
