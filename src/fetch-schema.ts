import fetch from 'node-fetch';
import nconf from 'nconf';

const introspectionQuery = `
    query Introspection {
        __schema {
            types {
                name
                kind
                description
                enumValues {
                    name
                }
                fields {
                    name
                    description
                    type {
                        name
                        kind
                        description
                        ofType {
                            name
                            kind
                            description
                            ofType {
                                name
                                kind
                                description
                                ofType {
                                    name
                                    kind
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

const fetchSchema = async () => {
    const body = await (
        await fetch(nconf.get('url'), {
            headers: {
                'Content-Type': 'application/json',
                ...(nconf.get('headers') ?? {})
            },
            body: JSON.stringify({
                query: introspectionQuery,
                operationName: 'Introspection'
            }),
            method: 'POST'
        })
    ).json();

    return body.data.__schema.types;
};

export default fetchSchema;
