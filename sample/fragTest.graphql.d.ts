// pre-generated types for sample/fragTest.graphql
// do not edit directly!
// regenerate using the command `typegen --input sample/fragTest.graphql`

/**
 * Temporary enums - to be replaced with proper enums.
 */
type TEMP_ENUM = string;

export type GetTalentPoolWithFragmentsResult = {
	viewer: _ViewerGQL | null;
};

type _ViewerGQL = {
	/**
	 * Get all the talent pools at the company level
	 */
	talentPools: _TalentPoolsGQL | null;
};

type _TalentPoolsGQL = {
	list: (_TalentPoolGQL | null)[];
};

type _TalentPoolGQL = {
	id: string;
	name: string;
	description: string;
	slug: string;
	sites: _SitesGQL | null;
	workforceType: _WorkforceEnum | null;
	workers: _WorkersGQL | null;
	__typename: 'TalentPool';
};

type _SitesGQL = {
	count: number;
	list: (_SiteGQL | null)[];
};

type _SiteGQL = {
	id: string;
};

type _WorkforceEnum = 'SIDEKICK' | 'EMPLOYEE' | 'SIDEKICK_PRIVATE';

type _WorkersGQL = {
	count: number;
	list: (_SidekickGQL | null)[];
};

type _SidekickGQL = {
	id: string;
	oldProfileLink: string;
	firstName: string;
	lastName: string;
	avatar: string;
	completedJobCount: number;
	rating: number;
	isSmartHireRequested: boolean;
	isSmartHireAvailable: boolean;
	talentPools: _TalentPoolsGQL | null;
	address: _AddressGQL | null;
	isBlacklisted: boolean;
};

type _AddressGQL = {
	displayAddress: string;
	line1: string;
	city: string;
	postcode: string;
	state: string;
	country: string;
	latitude: number;
	longitude: number;
};

