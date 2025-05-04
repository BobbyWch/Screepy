import {WorkGroup} from "@/obj/WorkGroup/workgroup";
import {Hatchery} from "@/obj/Colony/parts/hatchery";
import {TowerAI} from "@/obj/Colony/parts/tower";
import {OLD_MEMORY, XFrame} from "@/framework/frame";

export class Colony implements RuntimeObject{
	room:Room
	hatchery:Hatchery
	towerAI:TowerAI

	nuker:StructureNuker;
	factory:StructureFactory;
	powerSpawn:StructurePowerSpawn;
	centerLink:StructureLink;
	upLink:StructureLink;
	NTower:StructureTower;
	observer:StructureObserver;

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
				//刚respawn
				this.addWorkGroup(WorkGroupType.HARVEST)
				this.memory.state=ColonyState.BOOT
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
			workGroup:{},
			state:ColonyState.BOOT,
			ids:{}
		} as ColonyMemory

		//hardcode
		if(this.memory.workGroup["length"]) this.memory.workGroup={}

		this.hatchery=new Hatchery(this)
		this.towerAI=new TowerAI(this)
		let key
		for (key in this.memory.workGroup){
			this.workGroups[key]=WorkGroup.createByType(this,key)
		}

		Colony.colonies[room.name]=this
	}
	_name: string;//房间名


	/**
	 * 缓存对象
	 */
	sources ():Source[] {
		if (!this.room._scs){
			if (this.memory.ids.ss) this.room._scs=this.memory.ids.ss.map(s=>Game.getObjectById(s))
			else {
				this.room._scs=this.room.find(FIND_SOURCES)
				this.memory.ids.ss=this.room._scs.map(s=>s.id)
			}
		}

		return this.room._scs
	}
	get centerPos():RoomPosition{
		if (!this.room._cp){
			const ss=this.memory.centerP.split("/")
			this.room._cp=new RoomPosition(Number(ss[0]),Number(ss[1]),this._name)
		}
		return this.room._cp
	}
}
XFrame.addMount(()=>{
	const empty = () => {}
	const defStructure=(name,memKey)=>{
		Object.defineProperty(Colony.prototype, name, {
			get: function() {
				if (!this.room[memKey]){
					if (this.memory.ids[memKey]) {
						this.room[memKey] = Game.structures[this.memory.ids[memKey]]
						if (!this.room[memKey]){
							delete this.memory.ids[memKey]
							return null
						}
					} else return null
				}
				return this.room[memKey]
			},
			set: empty
		});
	}

	defStructure("nuker","nu")
	defStructure("centerLink","cl")
	defStructure("factory","fa")
	defStructure("powerSpawn","ps")
	defStructure("upLink","ul")
	defStructure("NTower","nt")
	defStructure("observer","ob")

},true)