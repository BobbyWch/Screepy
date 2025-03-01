export class Unit implements RuntimeObject{
	update():void{
		this.creep=Game.creeps[this._name]
	}

	run(): void {

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
		if(!Memory.units[creep.name]) Memory.units[creep.name]={}
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