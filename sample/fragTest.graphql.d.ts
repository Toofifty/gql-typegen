// pre-generated types for sample/fragTest.graphql
// do not edit directly!
// regenerate using the command `typegen --input sample/fragTest.graphql`

/**
 * Temporary enums - to be replaced with proper enums.
 */
type TEMP_ENUM = string;

export type GetTalentPoolWithFragmentsType = {
	viewer: _ViewerGQL | null;
};

type _ViewerGQL = {
	/**
	 * Get all the talent pools at the company level
	 */
	talentPools: _TalentPoolsGQL | null;
};

type _TalentPoolsGQL = {
	readonly list: (_TalentPoolGQL | null)[];
};

type _TalentPoolGQL = {
	readonly id: string;
	readonly name: string;
	readonly description: string;
	readonly slug: string;
	readonly sites: _SitesGQL | null;
	readonly workforceType: _WorkforceEnum | null;
	readonly workers: _WorkersGQL | null;
	readonly __typename: 'TalentPool';
};

type _SitesGQL = {
	readonly count: number;
	readonly list: (_SiteGQL | null)[];
};

type _SiteGQL = {
	readonly id: string;
};

type _WorkforceEnum = 'SIDEKICK' | 'EMPLOYEE' | 'SIDEKICK_PRIVATE';

type _WorkersGQL = {
	readonly count: number;
	readonly list: (_SidekickGQL | null)[];
};

type _SidekickGQL = {
	readonly id: string;
	readonly oldProfileLink: string;
	readonly firstName: string;
	readonly lastName: string;
	readonly avatar: string;
	readonly completedJobCount: number;
	readonly rating: number;
	readonly isSmartHireRequested: boolean;
	readonly isSmartHireAvailable: boolean;
	readonly talentPools: _TalentPoolsGQL | null;
	readonly address: _AddressGQL | null;
	readonly isBlacklisted: boolean;
};

type _AddressGQL = {
	readonly displayAddress: string;
	readonly line1: string;
	readonly city: string;
	readonly postcode: string;
	readonly state: string;
	readonly country: string;
	readonly latitude: number;
	readonly longitude: number;
};

