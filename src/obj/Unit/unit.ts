import {Hatchery} from "@/obj/Colony/parts/hatchery";
import {uu} from "@/modules/util";

export class Unit implements RuntimeObject{
	update():void{
		if (this.memory){

		}else {
			this.creep=Game.creeps[this._name]
		}

	}

	run(): void {
		if (this.memory.inQueue){

		}
	}

	get memory():UnitMemory{
		return Memory.units[this._name]
	}

	private static units:{[rn:string]:Unit}={}
	static get(creep:Creep):Unit{
		return this.units[creep.name]||(this.units[creep.name]=Unit.createByCreep(creep))
	}
	static createByCreep(creep:Creep):Unit{
		const u=new Unit()
		u.creep=creep
		u._name=creep.name
		if(!Memory.units[creep.name]) Memory.units[creep.name]={} as UnitMemory
		u.memory.inQueue=true
		return u
	}
	static spawnNew(hatchery:Hatchery,info:SpawnInfo):Unit{
		const u=new Unit()
		if (!info.name) info.name=uu.getCreepName()
		u._name=info.name
		// u.spawning=true
		if(!Memory.units[info.name]) Memory.units[info.name]={
			inQueue:true
		}
		return u
	}
	// static createByWG(workgroup:WorkGroup):Unit{
	// 	return null
	// }

	protected creep:Creep
	private constructor() {
	}
	_name: string;
}