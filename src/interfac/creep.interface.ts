interface CreepMemory{
	src:Id<Source>;
	frozen:number;
	re:boolean;
	prePos:string;
	stand:boolean;
	belong: string;
	role: string;
	creepType:"heal"|"attack";//squad使用

	working: boolean|number;
	labWorking: number;
	ready: boolean;
	target: Id<Structure>;
	dontPullMe:boolean;
	_repair:Id<Structure>;
	endTime:number;
	state:"con"|"link"|"site";
	taskId: Id<Structure>;
	needBoost:MineralBoostConstant[];
	boosted:boolean;
	say:Greet;
	tag:CreepTag;
	ways:string[];
	flagName:string;
	mission:CreepMissionModel;
	portalId:Id<StructurePortal>;
	site:Id<ConstructionSite>;
	shard:"shard3"|"shard2"|"shard1"|"shard0";
}
interface CreepMissionModel{
	id:string;//RoomMemory中MissionModel的id
	bound:boolean;
	data:any;
}
interface CreepTag{
	patten:string;
	current:string;
}
interface Greet{
	index:number;
	child:number;
}