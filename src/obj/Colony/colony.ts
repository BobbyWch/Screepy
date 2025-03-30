import {WorkGroup} from "@/obj/WorkGroup/workgroup";
import {Hatchery} from "@/obj/Colony/parts/hatchery";
import {TowerAI} from "@/obj/Colony/parts/tower";
import {OLD_MEMORY} from "@/framework/frame";

export class Colony implements RuntimeObject{
	room:Room
	hatchery:Hatchery
	towerAI:TowerAI

	update():void{
		this.room=Game.rooms[this._name]
	}

	workGroups:WorkGroup<any>[]

	run(): void {
		this.stateWork()


		let o
		for (o of this.workGroups) if(o)o.run()
		this.hatchery.run()
		
	}
	stateWork():void{
		switch (this.memory.state){
			case ColonyState.BOOT0:
				this.addWorkGroup(WorkGroupType.HARVEST)
				break
		}
	}
	setState(state:ColonyState):void{
		this.memory.state=state
	}
	addWorkGroup(type:WorkGroupType){
		this.workGroups[type]=WorkGroup.createByType(this,type)
	}
	_mm:ColonyMemory
	get memory():ColonyMemory{
		if (OLD_MEMORY&&this._mm) return this._mm
		else return (this._mm=Memory.colony[this._name])
	}
	private static colonies:{[rn:string]:Colony}={}
	static get(room:Room):Colony{
		return this.colonies[room.name]||(new Colony(room))
	}

	public constructor(room:Room|string) {
		if (typeof room=="string") room=Game.rooms[room]
		if (!room) return
		this.room=room
		this._name=room.name
		this.workGroups=[]
		if(!Memory.colony[room.name]) Memory.colony[room.name]={
			workGroup:[],
			state:ColonyState.BOOT
		} as ColonyMemory

		this.hatchery=new Hatchery(this)
		this.towerAI=new TowerAI(this)
		let key
		for (key in this.memory.workGroup){
			this.workGroups[key]=WorkGroup.createByType(this,key)
		}

		Colony.colonies[room.name]=this
	}
	_name: string;//房间名



}