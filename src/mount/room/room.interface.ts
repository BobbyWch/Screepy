interface Room{
	nuker:StructureNuker;
	factory:StructureFactory;
	powerSpawn:StructurePowerSpawn;
	centerLink:StructureLink;
	upLink:StructureLink;
	NTower:StructureTower;
	centerPos:RoomPosition;
	observer:StructureObserver;
	HostileGroup: Id<Creep>[];

	_scs:Source[]


	callAfterBuilt():Structure;
	flushSite():null|ConstructionSite;
	guard():void;
	processPower():void;
	givePcTask():void;
	initMemory():void;
	runMission():void;
	work():void;
	getRepair():StructureWall|StructureRampart;
	lazyRun():void;
	runLab():void;
	planLab():void;
	initLab():void;
	prepareBoost(creep:Creep):boolean;
	boost(creep:Creep):void;
	sortLab():void;

	getSource():Source;
	findRes(type:ResourceConstant,num:number):Structure;

	spawnMem(mem:CreepMemory,priority:number):void;
	spawnRole(role:string):void
	spawnBody(body:BodyPartConstant[],mem:CreepMemory,priority:number):void;
	spawn(spawnTask:SpawnTask):void;
	hasRoleTask(role:string):boolean;

	centerTask(from:Structure,to:Structure,res:ResourceConstant,num:number):void
	deleteCenter(id:string):void
	addMission(type:string,data:object):void
	deleteMission(mission:MissionModel):void
	missionNum(type:string):number

	// heal(ac:AnyCreep):void;
	getStore():Store<ResourceConstant, true>;
	pc():PowerCreep;

	Tower_Fill():void;
	Tower_Action(action:"attack"|"heal"|"repair",target:AnyCreep):void

	sources():Source[]
}
interface RoomProperty{
	slowPower:number;
	factory:number;
	power:number;
	upgrade:number;
	extStore:number;
	opExt:number;
	regen:number;
	noLab:number;
	NoNukeFill:number;
	noGcl:number;
	noRoad:number;
	opSpawn:number;
	noNukeD:number;
	giveup:number;
}
interface RoomMemory{
	mineral:MineralConstant;
	carryTasks: { [owner: string]: CarryTask };
	centerTasks:{[id:Id<AnyStoreStructure>]:CenterTask};
	_build:BuildInfo;
	_repair:RepairInfo;
	enemy:Id<AnyCreep>;
	prop:RoomProperty
	labs:LabMemory;
	upgInfo:UpgradeInfo;
	boost:{ [mineralName: string]: BoostInfo};
	mission:MissionModel[];
	deletedMsn:{id:string,startTime:number,type:string}[];
	wantUpg:boolean;
	ids:IdCache;
	bluePrint:string;
	centerP:string;
	harvestData:HarvestData;
	buying:Array<ResourceConstant>;
	war:WarData;
	defense:Defence;

	rec:RecoveryData;
	// obtask:ObTask[];
	state_outMine:"danger"|"clear"|undefined;
	nukeData:{
		damage:{[pos:string]:number}
		rampart:{[pos:string]:number}
		landIn:number
	}
	noSpawn:boolean;
}
interface RecoveryData {
	data: { [type: string]: string[] };
	num:number;
}
interface WarData{
	ignore:{[id:string]:number}
	startTime:number
	minWalls:{[id:string]:number}
	enemyBind:{[myCreepName:string]:string[]}
	lastNoEnemy:number;
	enemyDistribution:{ [Name: string]: Id<Creep|PowerCreep>};
}
interface Defence{
	nearestInvader:Id<Creep>
}
interface BoostInfo {
	users: string[];
	lab: Id<StructureLab>;
	amount: number;
	boosting: string;
}

interface RepairInfo{
	id:Id<StructureWall|StructureRampart>;
	hitsExp:number;
	endTime:number;
}
interface IdCache{
	ps:Id<StructurePowerSpawn>;
	nu:Id<StructureNuker>;
	fa:Id<StructureFactory>;
	cl:Id<StructureLink>;
	ul:Id<StructureLink>;
	nt:Id<StructureTower>;
	ob:Id<StructureObserver>;
	pc:string;
	ss:Id<Source>[]
}
interface UpgradeInfo{
	level:number;
	con?:Id<StructureContainer>;
	link?:Id<StructureLink>;
	lastPutSite:number;
	cd:number;
}
interface CarryTask{
	type: number;
	target: Id<Structure>;
	res: ResourceConstant;
	num: number;
	runner: string;
}
interface CenterTask{
	target: Id<Structure>;
	res: ResourceConstant;
	num: number;
	runner: string;
}


interface MissionModel{
	id:string;
	type:string;
	parent:string;
	data:any;
	startTime:number;
	pause:number;
	CreepB:{[role:string]:CreepBind};
	init:number;
	fromShard:string;
}
interface CreepBind {
	num: number;
	creep: string[];
}
interface LabMemory{
	main1: Id<StructureLab>;
	main2: Id<StructureLab>;
	others: Id<StructureLab>[];
	state: "prepare"|"react"|"collect";
	src1: ResourceConstant;
	src2: ResourceConstant;
	cooldown:number;
	planCd:number;
	// goal: { [res: string]: number };
	progress:MineralBoostConstant;
	currentGoal:MineralBoostConstant;
	currentId:string;
	tasks:LabTask[];
}
interface LabTask{
	res:MineralBoostConstant;
	num:number;
	type:"boost"|"factory"|"plan";
	id:string;
}
interface HarvestData{
	[id:string]: SourceMemory;
}
interface BuildInfo{
	id:Id<Structure>;
	x:number;
	y:number;
	type:BuildableStructureConstant;
}
interface Source{
	memory:SourceMemory;
}
interface SourceMemory{
	con:Id<StructureContainer>;
	link:Id<StructureLink>;
}