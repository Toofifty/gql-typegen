# gql-typegen

Generate Typescript definitions for a GraphQL query.

[x] Generates types for queries
[ ] Generates types for mutations
[ ] Generates input types
[x] Evaluates fragments
[ ] Evaluates aliases

## Setup

Create a `gql-typegen.json` file in your project, and point it at your (preferably local) GraphQL endpoint.

You can change some settings on type output here.

```json
{
    "url": "http://localhost:8080/graphql",
    "headers": {
        "Authorization": "Bearer <token>"
    },
    "basePath": ".",
    "addTypename": true,
    "readonlyTypes": true,
    "typePrefix": "GQL",
    "enumPrefix": "Enum",
    "typeSuffix": "",
    "enumSuffix": "",
    "finalTypePrefix": "",
    "finalTypeSuffix": "Type",
    "fileSuffix": "Type.d.ts",
    "indent": "  "
}
```

## Run

Install `gql-typegen` globally or run via `npx`. Use the `--input` flag to specify which file to process.

You can overwrite any configuration value here too.

```bash
gql-typegen --input src/grapqhl/currentUser.graphql
gql-typegen --input src/grapqhl/currentUser.graphql --typePrefix GraphQLCurrentUser
```

This will create your Typescript definition file in the same directory, which will export one type based on the name of the query or mutation.

## Example

### Input

(please excuse the contrived example)

`src/graphql/currentUser.graphql`

```gql
#import "./fragments/addressFragment.graphql"

query CurrentUser {
    me {
        id
        firstName
        lastName
        role
        ...AddressFragment
    }
}
```

`src/graphql/fragments/addressFragment.graphql`

```gql
fragment AddressFragment on User {
    line1
    line2
    city
    state
    postcode
}
```

### Output

```bash
gql-typegen --input src/graphql/currentUser.graphql
```

`src/graphql/currentUserType.d.ts`

```ts
// pre-generated types for src/graphql/currentUser.graphql
// do not edit directly!
// regenerate using the command `typegen --input src/graphql/currentUser.graphql`

export type CurrentUserType = {
    me: GQLUser | null;
};

type EnumUserRole = 'ADMIN' | 'USER' | 'GUEST';

type GQLUser = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    role: EnumUserRole;
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postcode: string | null;
};
```
