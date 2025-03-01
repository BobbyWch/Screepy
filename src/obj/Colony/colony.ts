import {WorkGroup} from "@/obj/WorkGroup/workgroup";

export class Colony implements RuntimeObject{
	protected room:Room

	update():void{
		this.room=Game.rooms[this._name]
	}

	workGroups:WorkGroup[]

	run(): void {
		this.stateWork()

		
	}
	stateWork():void{
		switch (this.memory.state){
			case ColonyState.BOOT:

				break
		}
	}
	setState(state:ColonyState):void{
		this.memory.state=state
	}


	get memory():ColonyMemory{
		return Memory.colony[this._name]
	}
	private static colonies:{[rn:string]:Colony}={}
	static get(room:Room):Colony{
		return this.colonies[room.name]||(this.colonies[room.name]=new Colony(room))
	}
	static reloadAll():Colony[]{
		const result:Colony[]=[]
		let rn:string,c:Colony
		for (rn in Memory.colony){
			c=new Colony(null)
			Colony.colonies[rn]=c
			c._name=rn
			c.workGroups=[]
			result.push(c)
		}
		return result
	}
	private constructor(room:Room|null) {
		if (!room) return
		this.room=room
		this._name=room.name
		this.workGroups=[]
		if(!Memory.colony[room.name]) Memory.colony[room.name]={} as ColonyMemory
	}
	_name: string;//房间名

}