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
	/**
	 * The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
	 */
	description: string;
	slug: string;
	sites: Query_Sites | null;
	workforceType: TEMP_ENUM;
	workers: Query_Workers | null;
};

type Query_Sites = {
	/**
	 * The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^53 - 1) and 2^53 - 1 since represented in JSON as double-precision floating point numbers specifiedby [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).
	 */
	count: number;
	list: (Query_Site | null)[];
};

type Query_Site = {
	/**
	 * The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
	 */
	id: string;
};

type Query_Workers = {
	/**
	 * The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^53 - 1) and 2^53 - 1 since represented in JSON as double-precision floating point numbers specifiedby [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).
	 */
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
	/**
	 * The `Boolean` scalar type represents `true` or `false`.
	 */
	isSmartHireRequested: boolean;
	/**
	 * The `Boolean` scalar type represents `true` or `false`.
	 */
	isSmartHireAvailable: boolean;
	talentPools: Query_TalentPools | null;
	address: Query_Address | null;
	/**
	 * The `Boolean` scalar type represents `true` or `false`.
	 */
	isBlacklisted: boolean;
};

type Query_Address = {
	/**
	 * The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
	 */
	displayAddress: string;
	/**
	 * The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
	 */
	line1: string;
	/**
	 * The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
	 */
	city: string;
	/**
	 * The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
	 */
	postcode: string;
	/**
	 * The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
	 */
	state: string;
	/**
	 * The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
	 */
	country: string;
	/**
	 * The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).
	 */
	latitude: number;
	/**
	 * The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).
	 */
	longitude: number;
};

