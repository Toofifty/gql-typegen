// pre-generated types for sample/fragTest.graphql
// do not edit directly!
// regenerate using the command `typegen --input sample/fragTest.graphql`

/**
 * Temporary enums - to be replaced with proper enums.
 */
type TEMP_ENUM = string;

export type GetTalentPoolWithFragmentsType = {
	viewer: Query_Viewer | null;
};

type Query_Viewer = {
	/**
	 * Get all the talent pools at the company level
	 */
	talentPools: Query_TalentPools | null;
};

type Query_TalentPools = {
	list: (Query_TalentPool | null)[];
};

type Query_TalentPool = {
	id: string;
	name: string;
	description: string;
	slug: string;
	sites: Query_Sites | null;
	workforceType: TEMP_ENUM;
	workers: Query_Workers | null;
	__typename: 'TalentPool';
};

type Query_Sites = {
	count: number;
	list: (Query_Site | null)[];
};

type Query_Site = {
	id: string;
};

type Query_Workers = {
	count: number;
	list: (Query_Sidekick | null)[];
};

type Query_Sidekick = {
	id: string;
	oldProfileLink: string;
	firstName: string;
	lastName: string;
	avatar: string;
	completedJobCount: number;
	rating: number;
	isSmartHireRequested: boolean;
	isSmartHireAvailable: boolean;
	talentPools: Query_TalentPools | null;
	address: Query_Address | null;
	isBlacklisted: boolean;
};

type Query_Address = {
	displayAddress: string;
	line1: string;
	city: string;
	postcode: string;
	state: string;
	country: string;
	latitude: number;
	longitude: number;
};

