import {Colony} from "@/obj/Colony/colony";
import {TaskUnit, Unit} from "@/obj/Unit/unit";
import {uu} from "@/modules/util";
import {OLD_MEMORY} from "@/framework/frame";

export class Hatchery{
	colony:Colony
	constructor(colony:Colony) {
		this.colony = colony

		if (!colony.memory.hatch) {
			colony.memory.hatch = {
				task: [],
				spawns:colony.room.find(FIND_MY_SPAWNS).filter(s=>s.isActive()).map(s=>s.name),
				sleepTill:0,
				autoBoost:{}
			} as HatcheryMemory

		}
	}
	run(){
		if (this.memory.sleepTill>global.Gtime) return
		if (this.memory.task.length){
			const freeSpawn=[]
			const spawnIds=this.memory.spawns
			let spawn:StructureSpawn,key
			for (key of spawnIds){
				spawn=Game.spawns[key]
				if (spawn){
					if (!spawn.spawning) freeSpawn.push(spawn)
				}else {
					uu.arrayRemove(key,spawnIds)
					return;
				}
			}
			if (freeSpawn.length){
				const tasks=this.memory.task
				let newCreep:SpawnTask,body,cost
				while (freeSpawn.length&&tasks.length) {
					newCreep = tasks[0];
					if (newCreep.mem.role && (newCreep.mem.role in roleBody)) {
						if (!newCreep.body){
							newCreep.body=this.getRoleBody(newCreep.mem.role)
							newCreep.isZippedBody=true
						}
						cost=Hatchery.getCost(newCreep.body)
						if (this.colony.room.energyAvailable >= cost) {
							body=newCreep.isZippedBody?Hatchery.unzipBody(newCreep.body as ZippedBodyInfo):newCreep.body
							if (this.memory.autoBoost[newCreep.mem.role]){
								newCreep.mem.needBoost=_.clone(this.memory.autoBoost[newCreep.mem.role])
							}
							newCreep.mem.belong=this.colony._name
							if(freeSpawn[0].spawnCreep(body, newCreep.name, {memory: newCreep.mem})==OK){
								tasks.shift()
								this.colony.room.energyAvailable-=cost
								freeSpawn.shift()
							}
						}else break
					} else {
						cost=Hatchery.getCost(newCreep.body)
						if (this.colony.room.energyAvailable >= cost) {
							body=newCreep.isZippedBody?Hatchery.unzipBody(newCreep.body as ZippedBodyInfo):newCreep.body
							newCreep.mem.belong=this.colony._name
							if(freeSpawn[0].spawnCreep(body as BodyPartConstant[], newCreep.name, {memory: newCreep.mem})==OK){
								tasks.shift()
								this.colony.room.energyAvailable-=cost
								freeSpawn.shift()
							}
						} else break
					}
				}

			}else {
				this.memory.sleepTill=global.Gtime +_.min(this.memory.spawns.map(s=>Game.spawns[s]),
						s=>s.spawning.remainingTime).spawning.remainingTime
			}

		}
	}
	createRole(bodyRole:string):TaskUnit{
		const unit=new TaskUnit(uu.getCreepName(),this.colony._name)
		unit.memory.body={
			data:this.getRoleBody(bodyRole),
			type:BodyGenType.ZIP
		}
		this.spawnUnit(unit)
		return unit
	}
	createBody(body:BodyPartConstant[]):TaskUnit{
		const unit=new TaskUnit(uu.getCreepName(),this.colony._name)
		unit.memory.body={
			data:body,
			type:BodyGenType.RAW
		}
		this.spawnUnit(unit)
		return unit
	}
	spawn(info:SpawnInfo):void{
		if (!info._mem) info._mem={} as CreepMemory
		if (info._mem.role) info._role=info._mem.role
		else if (info._role) info._mem.role=info._role
		if (!info.priority){
			if (info._role){
				info.priority=this.rolePriority(info._role)
			}else info.priority=5
		}
		const spawnTask={
			name:info.name,
			priority:info.priority,
			mem:info._mem
		} as SpawnTask
		if (info._body) spawnTask.body=info._body

		const t=this.memory.task
		for (let i=0;i<t.length;i++){
			if (info.priority>t[i].priority){
				t.splice(i,0,spawnTask)
			}
		}
		t.push(spawnTask)
	}
	spawnUnit(unit:Unit){
		const bodygen=unit.memory.body
		const spawnTask={
			name:unit._name,
			priority:5,
			mem:{},
			body:bodygen.data,
			isZippedBody:bodygen.type==BodyGenType.ZIP
		} as SpawnTask

		const t=this.memory.task
		for (let i=0;i<t.length;i++){
			if (spawnTask.priority>t[i].priority){
				t.splice(i,0,spawnTask)
			}
		}
		t.push(spawnTask)
		unit.memory.spawning=true
	}

	getRoleBody(role:string):ZippedBodyInfo{
		let bodies=roleBody[role]
		const room=this.colony.room
		if (role==Roles.upgrader){
			if(room.controller.level==8){
				return standUpgrader[0]
			}
			if (room.memory.upgInfo){
				if ((room.memory.upgInfo.con||room.memory.upgInfo.link)&&(room.storage||room.terminal)){
					bodies=standUpgrader
				}
			}
		}else if (role==Roles.harvester){
			// if (room.memory.prop.regen) return roleBody[Roles.harvester][0]
		}else if (role==Roles.miner&&room.controller.level>6){
			if (room.storage.store[room.memory.mineral]<60000) return roleBody[Roles.miner][0]
		}else if (role==Roles.carrier&&room.memory.prop.opSpawn){
			return [[CARRY,20],[MOVE,10]]
		}
		for (let i=bodies.length-1;i>=0;i--){
			if (Hatchery.getCost(bodies[i])<=room.energyCapacityAvailable){
				return bodies[i]
			}
		}
	}
	rolePriority(role:string):number{
		switch (role){
			case Roles.spawner:
				return 9
			case Roles.wallRepair:
			case Roles.defend_melee:
				return 8
			case Roles.harvester:
				return 7
			case Roles.upgrader:
				return 3
			case Roles.reserve:
			case Roles.outMiner:
			case Roles.outCar:
				return 1
			case Roles.cleaner:
				return 2
			default:
				return 5
		}
	}

	_mm:HatcheryMemory
	get memory():HatcheryMemory{
		if (OLD_MEMORY&&this._mm) return this._mm
		else return (this._mm=this.colony.memory.hatch)
	}

	static unzipBody(zippedBody:ZippedBodyInfo):BodyPartConstant[]{
		const arr:BodyPartConstant[]=[]
		let pair,i
		for (pair of zippedBody){
			for (i=0;i<pair[1];i++){
				arr.push(pair[0])
			}
		}
		return arr
	}
	static getCost(parts:BodyPartConstant[]|ZippedBodyInfo):number {
		if (!parts) return 0
		let s = 0;
		if (typeof parts[0]=="string"){
			for (let ind = 0; ind < (parts as BodyPartConstant[]).length; ind++) {
				s += BODYPART_COST[(parts as BodyPartConstant[])[ind]];
			}
		}else {
			for (let ind = 0; ind < parts.length; ind++) {
				s += BODYPART_COST[(parts as ZippedBodyInfo)[ind][0]]*(parts as ZippedBodyInfo)[ind][1];
			}
		}
		return s;
	}
}
export const Roles={
	upgrader:"r$u",
	builder:"r$b",
	repairer:"r$r",
	harvester:"r$m",
	carrier:"r$c",
	spawner:"r$s",
	manager:"r$cl",
	outMiner:"r$ot",
	claimer:"r$cm",
	transfer:"r$rt",
	starter:"r$sa",
	worker:"r$w",
	attacker:"r$at",
	miner:"r$h",
	downer:"r$d",
	aio:"aio",
	cleaner:"gc",
	reserve:"r$rv",
	outCar:"r$oc",
	defend_melee:"d$m",
	defend_out:"d$o",
	helpBuilder:"r$hb",
	out_repair:"r$or",
	wallRepair:"w$r",
	initDefend:"d$i",
	planx:"px"
}
const standUpgrader:ZippedBodyInfo[]=[[[WORK,15],[MOVE,8],[CARRY,3]],[[WORK,8],[MOVE,2],[CARRY,2]],[[WORK,12],[MOVE,3],[CARRY,2]],[[WORK,16],[MOVE,4],[CARRY,2]],[[WORK,28],[MOVE,14],[CARRY,4]]];

const roleBody:{[role:string]:ZippedBodyInfo[]}={}
roleBody[Roles.spawner] = [[[CARRY,3],[MOVE,3]],[[CARRY,6],[MOVE,3]],[[CARRY,8],[MOVE,4]],[[CARRY,12],[MOVE,6]],[[CARRY,14],[MOVE,7]],[[CARRY,20],[MOVE,10]]]
roleBody[Roles.downer]=[[[CLAIM,15],[MOVE,15]]]
roleBody[Roles.carrier] = [[[CARRY,10],[MOVE,5]],[[CARRY,16],[MOVE,8]]]
roleBody[Roles.harvester] = [[[WORK,16],[MOVE,4],[CARRY,4]],[[WORK,2],[MOVE,1],[CARRY,1]],[[WORK,3],[MOVE,1],[CARRY,1]],[[WORK,4],[MOVE,2],[CARRY,1]]
	,[[WORK,6],[MOVE,3],[CARRY,1]],[[WORK,8],[MOVE,2],[CARRY,2]]]
roleBody[Roles.repairer] = [[[CARRY,5],[MOVE,5],[WORK,5]],[[CARRY,15],[MOVE,15],[WORK,15]]]
roleBody[Roles.upgrader] = [[[WORK,1],[MOVE,1],[CARRY,1]],[[WORK,2],[MOVE,2],[CARRY,2]], [[WORK,3],[MOVE,3],[CARRY,3]]]
roleBody[Roles.manager] = [[[CARRY,20],[MOVE,4]],[[CARRY,30],[MOVE,5]]]
roleBody[Roles.builder] = [[[WORK,1],[MOVE,2],[CARRY,1]],[[WORK,2],[MOVE,2],[CARRY,2]],[[WORK,4],[MOVE,4],[CARRY,4]],[[WORK,6],[MOVE,9],[CARRY,12]]
	,[[CARRY,16],[MOVE,12],[WORK,8]]]
roleBody[Roles.claimer]=[[[CLAIM,1],[MOVE,1]]]
roleBody[Roles.transfer]=[[[TOUGH,6],[MOVE,21],[HEAL,13],[CARRY,2]]]
roleBody[Roles.starter]=[[[WORK,8],[CARRY,8],[MOVE,8]],[[WORK,10],[CARRY,15],[MOVE,25]]]
roleBody[Roles.miner]=[[[WORK,40],[MOVE,10]],[[WORK,16],[MOVE,4]]]
roleBody[Roles.attacker]=[[[RANGED_ATTACK,20],[MOVE,25],[HEAL,5]]]
roleBody[Roles.outMiner]=[[[WORK,8],[CARRY,1],[MOVE,4]]]
roleBody[Roles.cleaner]=[[[CARRY,10],[MOVE,10]]]
roleBody[Roles.reserve]=[[[CLAIM,2],[MOVE,2]],[[CLAIM,3],[MOVE,3]],[[CLAIM,4],[MOVE,4]]]
roleBody[Roles.outCar]=[[[CARRY,30],[MOVE,15]],[[WORK,2],[CARRY,30],[MOVE,16]]]
roleBody[Roles.helpBuilder]=[[[WORK,8],[CARRY,24],[MOVE,16]]]
roleBody[Roles.defend_out]=[[[RANGED_ATTACK,8],[ATTACK,8],[MOVE,19],[HEAL,3]]]
roleBody[Roles.defend_melee]=[[[TOUGH,4],[ATTACK,36],[MOVE,10]]]
roleBody[Roles.out_repair]=[[[WORK,2],[CARRY,6],[MOVE,4]]]
roleBody[Roles.wallRepair]=[[[WORK,18],[CARRY,14],[MOVE,16]]]
roleBody[Roles.initDefend]=[[[TOUGH,4],[RANGED_ATTACK,28],[HEAL,4],[MOVE,10],[HEAL,4]]]
roleBody[Roles.planx]=[[[CARRY,18],[WORK,1],[MOVE,21],[HEAL,2]]]
