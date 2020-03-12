import { readFileSync } from 'fs';
import nconf from 'nconf';
import parseQuery from './parse-query';
import fetchSchema from './fetch-schema';
import findTypes from './find-type';
import buildFile from './build-file';

nconf.argv().file({ file: 'gtype.json' });

nconf.required(['input']);

(async () => {
    try {
        const introspection = await fetchSchema();
        const query = parseQuery(readFileSync(nconf.get('input')).toString());
        const typedAST = findTypes(introspection, query.ast);
        buildFile(nconf.get('input') + '.d.ts', query.meta, typedAST);
    } catch (e) {
        console.error(e);
    }
})();
