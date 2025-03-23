interface MyPath {
	flee?: boolean;
	start?: RoomPosition;
	end?: RoomPosition;
	directionArray?: any[];
	ignoreStructures?: boolean;
	ignoreSwamps?: boolean;
	ignoreRoads?: boolean;
	posArray: RoomPosition[];
}

interface MoveToOpts {
	ignoreSwamps?: boolean;
	maxCost?: number;
	isOutmine?: boolean;
	flee?: boolean;
}