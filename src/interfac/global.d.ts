declare namespace NodeJS{
	interface Global{
		Gtime:number;
		market:object;
		Heap:HeapData;
		RoomArray:any
	}
}
interface HeapData{
	creep:{[p:string]:CreepBuffer}
	enemyC:{[p:string]:CreepBuffer}
	room:{[rn:string]:RoomBuffer}
}

declare var global: NodeJS.Global & typeof globalThis;
declare var _: _.LoDashStatic
interface Memory{
	colony:{[rn:string]:ColonyMemory};
	units:{[name:string]:UnitMemory};
}
const enum CC{
	/** 常量编译区 */
	MAX_SITE=15,
	/** 常量编译区 end */


	/**
	 * @see {HarvestTaskMem}
	 */
	harvestStateLink=1,
	harvestStateContainer=2,
	harvestStateSite=3,
	harvestStateDrop=4,


	taskOK=0,
	taskFinish=1,
	taskHang=2,//挂起，重新执行队列中的第一个task
	taskReDo=3
}

interface CanEqual{
	equal(obj:any):boolean
}
interface Structure{
	_filled:boolean
}
