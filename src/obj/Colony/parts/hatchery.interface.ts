interface SpawnInfo{
	_role?:string;
	_body?:BodyPartConstant[];
	_mem?:CreepMemory;
	priority?:number;
	name?:string;
}
interface SpawnTask{
	name?:string
	isZippedBody?:boolean
	body:BodyPartConstant[]|ZippedBodyInfo
	priority?:number
	mem?:CreepMemory
}
interface HatcheryMemory{
	task:SpawnTask[];
	spawns:Id<StructureSpawn>[]
	sleepTill:number
	autoBoost:{[role:string]:MineralBoostConstant[]};
}
interface ColBaseMemory{
	bluePrint:string
	putSiteCd:number
	completeLevel:number

	recNum:number
	recData:{[type:string]:string[]}
}

type ZippedBodyInfo=[BodyPartConstant,number][]
const enum BodyGenType{
	ZIP,RAW
}
interface BodyGen{
	type:BodyGenType
	data:ZippedBodyInfo|BodyPartConstant[]
}