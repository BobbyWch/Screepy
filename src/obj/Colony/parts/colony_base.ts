import {Colony} from "@/obj/Colony/colony";
import {OLD_MEMORY} from "@/framework/frame";
import {SuperMove} from "@/lib/betterMove";
import {uu} from "@/modules/util";
import {BuildGroup} from "@/obj/WorkGroup/workgroup";

interface Plan63Proto{
	HelperVisual:{
		showRoomStructures(rn:string,structMap:StructMap)
	}
	ManagerPlanner:{
		computeManor(rn:string,poses:RoomPosition|{pos:RoomPosition}[],storagePos?:RoomPosition):Result63Plan
	}

}
interface Result63Plan{
	roomName: string
	centerX:number
	centerY:number
	structMap:StructMap
}
interface StructMap{
	[type:string]:[number,number][]
}
//@ts-ignore
export const planner63:Plan63Proto=require("autoPlanner63")
export class ColonyBase {
	colony:Colony
	constructor(colony:Colony) {
		this.colony = colony

		if (!colony.memory.base) {
			colony.memory.base = {
				completeLevel:0
			} as ColBaseMemory

		}
	}
	setCenter(x,y){
		this.colony.memory.centerP=`${x}/${y}`
	}
	runPlan(type?:string){
		let data:Result63Plan,bluePrint=[]
		const terrain=this.colony.room.getTerrain();
		if (!type) type="63"
		switch (type){
			case "63":
				const room=this.colony.room
				data=planner63.ManagerPlanner.computeManor(room.name,[room.controller,
					room.find(FIND_MINERALS)[0],room.find(FIND_SOURCES)[0],room.find(FIND_SOURCES)[1]])
				if (!data){
					console.log(room.name+"无法自动布局，请手动放置工地")
					return
				}
				// const bluePrint=[]
				for (let level = 1,type,lim,i,e; level <= 8; level++) {
					for (type in CONTROLLER_STRUCTURES) {
						lim = CONTROLLER_STRUCTURES[type]
						switch (type) {
							case 'road':
								if (level == 4) {
									for (i = 0; i < data.structMap[type].length; i++) {
										e = data.structMap[type][i]
										bluePrint.push(`${e[0]}/${e[1]}/${type}/${level}`)
									}
								}
								break;
							case 'link':
								if (level == 7) {
									data.structMap[type].forEach(o=>{
										bluePrint.push(`${o[0]}/${o[1]}/${type}/${level}`)
									})
								}
								break;
							case 'container':
								if (level==1){
									data.structMap[type].forEach(o=>{
										if (new RoomPosition(o[0],o[1],room.name).findInRange(FIND_SOURCES,1).length&&room.controller.pos.getRangeTo(o[0],o[1])>1){
											bluePrint.push(`${o[0]}/${o[1]}/${type}/${level}`)
										}
									})
								}else if (level==4){
									data.structMap[type].forEach(o=>{
										if (room.controller.pos.getRangeTo(o[0],o[1])<4){
											bluePrint.push(`${o[0]}/${o[1]}/${type}/${level}`)
										}
									})
								}else if (level==6){
									data.structMap[type].forEach(o=>{
										if (room.find(FIND_MINERALS)[0].pos.getRangeTo(o[0],o[1])<2){
											bluePrint.push(`${o[0]}/${o[1]}/${type}/${level}`)
										}
									})
								}
								break;
							default:
								for (let i = lim[level - 1]; i < Math.min(data.structMap[type].length, lim[level]); i++) {
									let e = data.structMap[type][i]
									if (type != 'rampart') {
										bluePrint.push(`${e[0]}/${e[1]}/${type}/${level}`)
									}
								}
								break;
						}
					}
				}
				data.structMap["rampart"].forEach(o=>bluePrint.push(`${o[0]}/${o[1]}/rampart/7`))
				// const terrain=this.getTerrain()
				room.controller.pos.forRange(1,(x,y)=>{
					if (terrain.get(x,y)!=TERRAIN_MASK_WALL){
						bluePrint.push(`${x}/${y}/rampart/7`)
					}
				})
				this.memory.bluePrint=bluePrint.join("#")
				this.setCenter(data.centerX.toFixed(0),data.centerY.toFixed(0))
				break;
			case "bunker":
				/*
				data=_.clone(staticPlan.bunker,true)
				let struct,a,poses
				for(struct in data){
					poses=data[struct]
					for(a of poses){
						a[0]+=x*kx
						a[1]+=y*ky
					}
				}
				data={structMap:data}
				// const bluePrint=[];

				for (let level = 1,type,lim,i,e; level <= 8; level++) {
					for (type in CONTROLLER_STRUCTURES) {
						lim = CONTROLLER_STRUCTURES[type];
						switch (type) {
							case 'road':
								if (level == 4) {
									for (i = 0; i < data.structMap[type].length; i++) {
										e = data.structMap[type][i];
										bluePrint.push(`${e[0]}/${e[1]}/${type}/${level}`);
									}
								}
								break;
							case 'link':
								if (level == 7) {
									data.structMap[type].forEach(o=>{
										bluePrint.push(`${o[0]}/${o[1]}/${type}/${level}`);
									});
								}
								break;
							case 'container':
								if (level==1){
									data.structMap[type].forEach(o=>{
										if (new RoomPosition(o[0],o[1],this.name).findInRange(FIND_SOURCES,1).length&&this.controller.pos.getRangeTo(o[0],o[1])>1){
											bluePrint.push(`${o[0]}/${o[1]}/${type}/${level}`);
										}
									});
								}else if (level==4){
									data.structMap[type].forEach(o=>{
										if (this.controller.pos.getRangeTo(o[0],o[1])<4){
											bluePrint.push(`${o[0]}/${o[1]}/${type}/${level}`);
										}
									});
								}else if (level==6){
									data.structMap[type].forEach(o=>{
										if (this.find(FIND_MINERALS)[0].pos.getRangeTo(o[0],o[1])<2){
											bluePrint.push(`${o[0]}/${o[1]}/${type}/${level}`);
										}
									});
								}
								break;
							default:
								for (let i = lim[level - 1]; i < min(data.structMap[type].length, lim[level]); i++) {
									let e = data.structMap[type][i];
									if (type != 'rampart') {
										bluePrint.push(`${e[0]}/${e[1]}/${type}/${level}`);
									}
								}
								break;
						}
					}
				}
				data.structMap["rampart"].forEach(o=>bluePrint.push(`${o[0]}/${o[1]}/rampart/7`));

				this.controller.pos.forNear(1,(x,y)=>{
					if (terrain.get(x,y)!=TERRAIN_MASK_WALL){
						bluePrint.push(`${x}/${y}/rampart/7`);
					}
				});
				this.memory.bluePrint=bluePrint.join("#");
				this.memory.centerP=`${x}/${y}`;
				break;
				 */
		}
	}

	/**
	 * return 1 成功放置
	 *        0 未放置
	 */
	putSite(){
		if (this.memory.putSiteCd){
			if (this.memory.putSiteCd>global.Gtime) return;
			else delete this.memory.putSiteCd
		}

		const cpu=Game.cpu.getUsed()
		if (Game.cpu.bucket < 800) {
			this.memory.putSiteCd=global.Gtime+30
			return;
		}
		const room=this.colony.room
		if (room.find(FIND_HOSTILE_SPAWNS).length) return;
		const plan = this.memory.bluePrint
		const unzip=[],selected=[]
		if(plan=="manual"){
			this.memory.completeLevel = room.controller.level;
			return 0
		}
		plan.split("#").forEach(o=>{
			unzip.push(o.split("/"))
		})
		unzip.forEach(o=>{
			if (Number(o[3])<=room.controller.level){
				o[0]=Number(o[0])
				o[1]=Number(o[1])
				selected.push(o)
			}
		})
		let ok=0,siteNum=room.find(FIND_MY_CONSTRUCTION_SITES).length,waitDestroy=false,hasReady=true
		let o,result=-99,shdChkManual=false
		for (o of selected){
			if (siteNum>=CC.MAX_SITE) {
				siteNum=99999
				hasReady=false
				break;
			}
			//hardcode
			// if (this.name=="W54N29"&&!(o[2]==STRUCTURE_RAMPART||o[2]==STRUCTURE_WALL)) continue

			if (room.lookForAt(LOOK_STRUCTURES,o[0],o[1]).find((e:OwnedStructure)=>(e.my||!e.owner)&&e.structureType==o[2])||room.lookForAt(LOOK_CONSTRUCTION_SITES,o[0],o[1]).length) continue
			//if (this.memory.prop.noRoad&&o[2]==STRUCTURE_ROAD) continue
			if (room.controller.level>6&&o[2]==STRUCTURE_CONTAINER) continue
			// if (o[2]==STRUCTURE_SPAWN&&)
			hasReady=false
			result=-99
			if (o[2]==STRUCTURE_SPAWN){
				result=room.createConstructionSite(o[0], o[1], o[2], `Sp${Object.keys(Game.spawns).length}${uu.nextRand(10)}`)
			}else {
				result=room.createConstructionSite(o[0], o[1], o[2])
			}
			if(result==OK){
				ok=1
				siteNum++
			}else if (result==ERR_RCL_NOT_ENOUGH){
				const hos= room.find(FIND_HOSTILE_STRUCTURES).filter(h=>h.structureType==o[2])
				if (hos.length){
					waitDestroy=true
					hos.forEach(h=>h.destroy())
				}else shdChkManual=true//手动放置了规划外的建筑导致无法自动放置
			}else if (result==ERR_FULL){
				siteNum=99999
				break;
			}else if (result==ERR_INVALID_TARGET){
				const s=room.lookForAt(LOOK_STRUCTURES,o[0],o[1]).find(o=>(OBSTACLE_OBJECT_TYPES as StructureConstant[]).includes(o.structureType))
				if (s) s.destroy()
				else {
					const site=room.lookForAt(LOOK_CONSTRUCTION_SITES,o[0],o[1]).find(s=>!s.my)
					if (site) site.remove()
				}
				waitDestroy=true
			}
		}

		if (siteNum==99999){
			this.memory.putSiteCd=global.Gtime+2000
		}
		if (shdChkManual){
			if (siteNum==0){
				hasReady=true
			}else this.memory.putSiteCd=global.Gtime+113
		}

		if (ok&&!hasReady) {
			// CreepApi.set(config.builder, this.controller.level < 5 ? 3 : 1, this.name)
			SuperMove.deletePathInRoom(room.name)
			SuperMove.deleteCostMatrix(room.name)
		}
		if (hasReady){//说明这一t已经没有放置site
			// this.updateNTower()
			this.memory.completeLevel = room.controller.level
			this.saveRec()
			SuperMove.deletePathInRoom(room.name)
			SuperMove.deleteCostMatrix(room.name)
			if (room.controller.level==8){
				delete this.memory.bluePrint
			}
		}
		console.log("Put site cpu cost:"+(Game.cpu.getUsed()-cpu))
		return ok
	}
	scan(){
		//@ts-ignore
		const num=this.colony.room.find(FIND_STRUCTURES).filter(s=>s.my||!s.owner).length-1

		if (num==this.memory.recNum){
			if (global.Gtime%1007==0) this.doRec()
		}else if (num>this.memory.recNum) this.saveRec()
		else{
			this.doRec()
			// if (this.memory.nukeData&&!this.find(FIND_NUKES).find(n=>n.timeToLand<3000)){
			// 	this.doRecovery()
			// }
		}
	}
	saveRec(){
		const recData={}
		//@ts-ignore
		const structures=this.colony.room.find(FIND_STRUCTURES).filter(s=>s.my||!s.owner)
		let struct
		for (struct of structures){
			if (struct.structureType==STRUCTURE_CONTROLLER) continue
			if (!recData[struct.structureType]) recData[struct.structureType]=[]
			recData[struct.structureType].push(uu.zipPos(struct.pos,true))
		}
		this.memory.recData=recData
		this.memory.recNum=structures.length-1
		console.log("rec init")
	}
	doRec(){
		const recData=this.memory.recData,room=this.colony.room
		let pos,type,data,posStr,result
		for (type in recData){
			data=recData[type]
			for (posStr of data){
				pos=uu.unzipPos(posStr)
				result=room.createConstructionSite(pos.x,pos.y,type)
				if(result==ERR_FULL) return
				else if(result==OK) Game.notify(`${room.name}建筑缺损：${type}  [${pos.x},${pos.y}]`);
			}
		}
	}
	startBuild(){
		if (!this.memory.build){
			this.memory.build={}
			this.colony.addWorkGroup(WorkGroupType.BUILD);
			(this.colony.getWorkGroup(WorkGroupType.BUILD) as BuildGroup).activate()
		}
	}
	endBuild(){
		if (this.memory.build){
			this.colony.delWorkGroup(WorkGroupType.BUILD)
			delete this.memory.build
		}
	}
	startRepair(){
		if (!this.memory.repair){

		}
	}
	endRepair(){
		if (this.memory.repair){

		}
	}
	site:ConstructionSite
	getBuild():ConstructionSite{
		if (!this.site){
			if (this.memory.build){
				const info=this.memory.build.current
				if (info){
					this.site=Game.getObjectById(info.id)
					if (!this.site){
						this.buildCb()
						delete this.memory.build.current
						return this.getBuild()
					}
				}else {
					const sites=this.colony.room.find(FIND_MY_CONSTRUCTION_SITES)
					if (sites.length){
						this.site=sites[0]
						this.memory.build.current={
							id:this.site.id,
							x:this.site.pos.x,
							y:this.site.pos.y,
							type:this.site.structureType
						}
					}else {
						this.endBuild()
						return null
					}
				}
			}else return null
		}
		return this.site
	}
	buildCb(){
		const info=this.memory.build.current
		const structure=this.colony.room.lookForAt(LOOK_STRUCTURES,info.x,info.y).find(s=>s.structureType==info.type)
		if (!structure){
			//??site被破坏
			return
		}
		switch (structure.structureType){

		}
	}
	run(){
		if (this.memory.bluePrint) {
			if (this.putSite()){
				this.startBuild()
			}
		}
		if (global.Gtime%53==0){
			this.scan()
		}
	}
	clear(){
		this.site=null
	}
	_mm:ColBaseMemory
	get memory():ColBaseMemory{
		if (OLD_MEMORY&&this._mm) return this._mm
		else return (this._mm=this.colony.memory.base)
	}
}