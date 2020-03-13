// pre-generated types for sample/fragTest.graphql
// do not edit directly!
// regenerate using the command `typegen --input sample/fragTest.graphql`

export type GetTalentPoolWithFragmentsResult = {
................viewer: GQL_Viewer | null;
};

type GQL_Viewer = {
................/**
................ * Get all the talent pools at the company level
................ */
................talentPools: GQL_TalentPools | null;
................readonly __typename: 'Viewer';
};

type GQL_TalentPools = {
................readonly list: (GQL_TalentPool | null)[];
................readonly __typename: 'TalentPools';
};

type GQL_TalentPool = {
................readonly id: string;
................readonly name: string;
................readonly description: string;
................readonly slug: string;
................readonly sites: GQL_Sites | null;
................readonly workforceType: GQL_Enum_Workforce | null;
................readonly workers: GQL_Workers | null;
................readonly __typename: 'TalentPool';
};

type GQL_Sites = {
................readonly count: number;
................readonly list: (GQL_Site | null)[];
................readonly __typename: 'Sites';
};

type GQL_Site = {
................readonly id: string;
................readonly __typename: 'Site';
};

type GQL_Enum_Workforce = 'SIDEKICK' | 'EMPLOYEE' | 'SIDEKICK_PRIVATE';

type GQL_Workers = {
................readonly count: number;
................readonly list: (GQL_Sidekick | null)[];
................readonly __typename: 'Workers';
};

type GQL_Sidekick = {
................readonly id: string;
................readonly oldProfileLink: string;
................readonly firstName: string;
................readonly lastName: string;
................readonly avatar: string;
................readonly completedJobCount: number;
................readonly rating: number;
................readonly isSmartHireRequested: boolean;
................readonly isSmartHireAvailable: boolean;
................readonly talentPools: GQL_TalentPools | null;
................readonly address: GQL_Address | null;
................readonly isBlacklisted: boolean;
................readonly __typename: 'Sidekick';
};

type GQL_Address = {
................readonly displayAddress: string;
................readonly line1: string;
................readonly city: string;
................readonly postcode: string;
................readonly state: string;
................readonly country: string;
................readonly latitude: number;
................readonly longitude: number;
................readonly __typename: 'Address';
};

