import {WorkGroup} from "@/obj/WorkGroup/workgroup";
import {Hatchery} from "@/obj/Colony/parts/hatchery";
import {TowerAI} from "@/obj/Colony/parts/tower";
import {OLD_MEMORY, XFrame} from "@/framework/frame";
import {MineSite} from "@/obj/Colony/parts/MineSite";
import {storeProxyH} from "@/modules/util";
import {ColonyBase} from "@/obj/Colony/parts/colony_base";
import {Colors} from "@/modules/Logger";

export class Colony implements RuntimeObject,CanEqual{
	room:Room
	hatchery:Hatchery
	towerAI:TowerAI
	mineSites:MineSite[]
	base: ColonyBase

	nuker:StructureNuker;
	factory:StructureFactory;
	powerSpawn:StructurePowerSpawn;
	centerLink:StructureLink;
	upLink:StructureLink;
	NTower:StructureTower;
	observer:StructureObserver;

	extFilled:boolean//是否全部填满

	update():void{
		this.room=Game.rooms[this._name]
		this.extFilled=this.room.energyAvailable==this.room.energyCapacityAvailable
	}

	workGroups:WorkGroup<any>[]//无序！

	run(): void {
		if (!this.room) return//存在一种极端情况，占有房间但无视野，未测试

		this.stateWork()

		let o
		for (o of this.workGroups) if(o)o.run()
		this.hatchery.run()
		if (this.memory.state==ColonyState.BOOT0) this.memory.state=ColonyState.BOOT

		this.debugVisual()
	}
	//调试时修补内存
	debugHotFix(){

	}
	debugVisual(){
		if (this.extId&&this.extId.length){
			const v=this.room.visual
			let id,pos
			for (id of this.extId){
				pos=Game.structures[id].pos
				v.circle(pos,{stroke:Colors.red})
			}
		}
	}
	stateWork():void{
		switch (this.memory.state){
			case ColonyState.BOOT0:
				this.base.runPlan()
				//刚respawn
				this.addWorkGroup(WorkGroupType.HARVEST)
				this.addWorkGroup(WorkGroupType.FILL)
				break
			case ColonyState.BOOT:
				if (!this.getWorkGroup(WorkGroupType.UPGRADE)&&this.hatchery.memory.task.length==0)
					this.addWorkGroup(WorkGroupType.UPGRADE)
		}
	}
	setState(state:ColonyState):void{
		this.memory.state=state
	}

	addWorkGroup(type:WorkGroupType){
		this.workGroups.push(WorkGroup.createByType(this,type))
	}
	getWorkGroup(type:WorkGroupType){
		return this.workGroups.find(w=>w.type==type)
	}
	_mm:ColonyMemory
	get memory():ColonyMemory{
		if (OLD_MEMORY&&this._mm) return this._mm
		else return (this._mm=Memory.colony[this._name])
	}
	static colonies:{[rn:string]:Colony}={}
	static get(roomName:string):Colony{
		return this.colonies[roomName]
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
			ids:{},
			MSite:{}
		} as ColonyMemory
		this.debugHotFix()

		this.mineSites=this.sources().map(s=>new MineSite(this,s.id))
		this.base=new ColonyBase(this)
		this.hatchery=new Hatchery(this)
		this.towerAI=new TowerAI(this)
		let key
		for (key in this.memory.workGroup){
			this.workGroups.push(WorkGroup.createByType(this,key))
		}

		Colony.colonies[room.name]=this
	}

	equal(obj: any): boolean {
		return this._name==obj["_name"];
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

	/**
	 * 统计storage,terminal,factory资源
	 */
	get store():{[res:string]:number} {
		if (!this.room._ast) {
			const store = {}, list = []
			if (this.room.storage) list.push(this.room.storage.store)
			if (this.room.terminal) list.push(this.room.terminal.store)
			if (this.factory) list.push(this.factory.store)
			let child, res
			for (child of list) {
				for (res in child) {
					store[res] = child[res] + (store[res]||0)
				}
			}
			this.room._ast = new Proxy(store,storeProxyH)
		}
		return this.room._ast
	}
	private extId:Id<HatchEgg>[]
	extToFillId(){
		if (!this.extId||this.extId.length==0){
			if (this.room.controller.level==8){
				this.extId=this.room.find(FIND_MY_STRUCTURES).filter(s=> (s.structureType=="spawn"||s.structureType=="extension")
					&&s.store.getFreeCapacity(RESOURCE_ENERGY)).map(s=>s.id) as Id<HatchEgg>[]
			}else {
				this.extId=this.room.find(FIND_MY_STRUCTURES).filter(s=> (s.structureType=="spawn"||s.structureType=="extension")
					&&s.store.getFreeCapacity(RESOURCE_ENERGY)&&s.isActive()).map(s=>s.id) as Id<HatchEgg>[]
			}
		}
		return this.extId
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
//@ts-ignore
global.col=Colony.colonies