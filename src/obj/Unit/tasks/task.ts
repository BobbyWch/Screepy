import {OLD_MEMORY} from "@/framework/frame";
import {uu} from "@/modules/util";
import {TaskUnit} from "@/obj/Unit/unit";
import {MineSite} from "@/obj/Colony/parts/MineSite";
import {UpgradeGroup} from "@/obj/WorkGroup/workgroup";

export class Task<memType extends TaskMemory>{
    unit:TaskUnit
    type:TaskType
    constructor(type:TaskType, unit:TaskUnit) {
        this.unit=unit
        this.type=type
        if (!this.unit.memory.taskData[this.type]) this.unit.memory.taskData[this.type]={} as TaskMemory

    }

    _mm:memType
    get memory():memType{
        if (OLD_MEMORY&&this._mm) return this._mm
        else return (this._mm=this.unit.memory.taskData[this.type] as memType)
    }

    run(){
        // return CC.taskOK
    }

    // sleep(time:number){
    //     this.memory.sleep=time
    // }
    // isSleep():boolean{
    //     return --this.memory.
    // }
}
export let Tasks
class HarvestTask extends Task<HarvestTaskMem>{
    site:MineSite
    constructor(unit:TaskUnit) {
        super(TaskType.HARVEST,unit);
        if (this.memory.init){
            this.site=this.unit.home().mineSites.find(s=>s.id==this.memory.siteId)
        }
    }
    init(site:MineSite){
        this.site=site
        this.memory.siteId=site.id
        this.memory.mineNum=this.unit.bodyInfo()[WORK]*2
        this.updStore(site.source,site.source.pos.findInRange(FIND_STRUCTURES,2))
        this.memory.init=true
        return this
    }

    run() {
        super.run();
        // if (this.unit.notSpawned()) return
        const creep=this.unit.creep
        if (creep.pos.isNearTo(this.site.source)){

            this.unit.creep.memory.dontPullMe=true
            // switch (this.memory.state){
            //
            // }
            if (this.memory.state==CC.harvestStateDrop||this.memory.state==CC.harvestStateSite){
                creep.harvest(this.site.source)
            }
        }else {
            delete this.unit.creep.memory.dontPullMe
            this.unit.creep.moveTo(this.site.source)
        }

        return CC.taskOK
    }

    updStore(source:Source,ss:Structure[]){
        let store=
            uu.findPriority(ss,[STRUCTURE_LINK,STRUCTURE_CONTAINER],"structureType") as StructureLink|StructureContainer
        if (store){
            this.memory.state=store.structureType==STRUCTURE_LINK?CC.harvestStateLink:CC.harvestStateContainer
            this.memory.store=store.id
        }else {
            const site=uu.findPriority(source.pos.findInRange(FIND_CONSTRUCTION_SITES,2)
                ,[STRUCTURE_LINK,STRUCTURE_CONTAINER],"structureType") as ConstructionSite<STRUCTURE_LINK|STRUCTURE_CONTAINER>
            if (site){
                this.memory.store=site.id
                this.memory.state=CC.harvestStateSite
            }else this.memory.state=CC.harvestStateDrop
        }
    }
}
class GotoTask extends Task<GotoTaskMem>{
    pos:RoomPosition
    constructor(unit:TaskUnit) {
        super(TaskType.GOTO,unit);
        if (this.memory.init){
            this.pos=uu.unzipPos(this.memory.zipPos) as RoomPosition
        }
    }
    init(pos:RoomPosition,range?:number){
        this.pos=pos
        this.memory.range=range||1
        this.memory.zipPos=uu.zipPos(pos)
        this.memory.init=true
        return this
    }
    run(){
        if (this.unit.pos.getRangeTo(this.pos)>this.memory.range){
            this.unit.creep.moveTo(this.pos)
        }else return CC.taskFinish
    }
}
class HatchFillTask extends Task<HatchFillMem>{
    constructor(unit:TaskUnit) {
        super(TaskType.HATCH_FILL,unit);
    }
    run(){
        super.run()
        const creep=this.unit.creep
        if (creep.syncRes(RESOURCE_ENERGY)<=0){
            this.unit.insertTask(Tasks.fetch(this.unit,RESOURCE_ENERGY))
            return CC.taskHang
        }
        const target=this.getTarget()
        if (!target){
            //TODO end
            return
        }
        if (creep.pos.isNearTo(target)){
            if(creep.transfer(target,RESOURCE_ENERGY)==OK){
                target._filled=true
                return CC.taskReDo
            }
        }else {
            this.unit.insertTask(Tasks.goto(this.unit,target.pos))
            return CC.taskHang
        }
    }
    getTarget():HatchEgg{
        if (this.memory.targetId) return Game.structures[this.memory.targetId] as HatchEgg
        if (this.unit.home().extFilled) return null
        const toFills=this.unit.home().extToFillId().map(id=>Game.structures[id]).filter(s=>!s._filled)
        const tar=this.unit.pos.findClosestByRange(toFills) as HatchEgg
        uu.arrayRemove(tar.id,this.unit.home().extToFillId())
        this.memory.targetId=tar.id
        return tar
    }


}
class FetchTask extends Task<FetchTaskMem>{
    targetPos:RoomPosition
    constructor(unit:TaskUnit) {
        super(TaskType.FETCH,unit);

    }
    run(){
        super.run()
        if (this.memory.res==RESOURCE_ENERGY){
            if (this.memory.fetchWay==FetchWayType.SOURCE){
                this.unit.insertTask(Tasks.collect(this.unit,_.max(this.unit.home().mineSites,s=>s.energyLeft())))
                return CC.taskFinish
            }
        }
    }
    init(res:ResourceConstant,num?:number){
        this.memory.res=res
        this.memory.num=num
        if (res==RESOURCE_ENERGY){
            switch (this.unit.home().memory.state){
                case ColonyState.BOOT:
                    this.memory.fetchWay=FetchWayType.SOURCE
                    break
            }
        }
        return this
    }
    updPos(){

    }
}
class CollectTask extends Task<CollectTaskMem>{
    site:MineSite
    constructor(unit:TaskUnit) {
        super(TaskType.COLLECT,unit);
        if (this.memory.init){
            this.site=this.unit.home().mineSites.find(s=>s.id==this.unit.memory.reg.mineSite.id)
        }
    }
    run() {
        super.run();
        if (this.unit.pos.getRangeTo(this.site.source.pos)>2){
            this.unit.insertTask(Tasks.goto(this.unit,(this.site.container||this.site.source).pos,2))
            return CC.taskHang
        }else {
            if (this.site.memory.state==MineSiteState.drop){
                const drops=this.site.source.pos.findInRange(FIND_DROPPED_RESOURCES,2).filter(r=>r.resourceType=="energy")
                const nearDrop=this.unit.pos.findClosestByRange(drops)
                if (nearDrop){
                    if (this.unit.pos.isNearTo(nearDrop)){
                        if(this.unit.creep.pickup(nearDrop)==OK){
                            if (this.unit.creep.syncRes(RESOURCE_ENERGY)>0.8*this.unit.creep.store.getCapacity()){
                                this.site.unRegGetter(this.unit)
                                return CC.taskFinish
                            }
                        }

                    }else this.unit.creep.moveTo(nearDrop)
                }

            }else {
                const cont=this.site.container
                if (cont){
                    if (this.unit.pos.isNearTo(cont)){
                        if (this.unit.creep.withdraw(cont,RESOURCE_ENERGY)==OK){
                            this.site.unRegGetter(this.unit)
                            return CC.taskFinish
                        }
                    }else this.unit.creep.moveTo(cont)
                }
            }
        }
    }

    init(site:MineSite){
        this.site=site
        this.memory.init=true
        site.regGetter(this.unit)
        return this
    }
}
class UpgradeTask extends Task<UpgTaskMem>{
    minEng:number
    constructor(unit:TaskUnit) {
        super(TaskType.UPGRADE,unit);
        this.minEng=2*unit.bodyInfo()[WORK]
    }
    run() {
        super.run()
        const creep=this.unit.creep
        if (!creep.store.energy&&!creep.storeLock){
            if (this.unit.engBorrow3(creep.room.controller.pos)!=OK){
                if (this.memory.noCycle){
                    return CC.taskFinish
                }else {
                    this.unit.insertTask(Tasks.fetch(this.unit,RESOURCE_ENERGY))
                    return CC.taskHang
                }

            }
        }

        if (creep.pos.getRangeTo(creep.room.controller)<4){
            creep.upgradeController(creep.room.controller)
            if (creep.store.energy<this.minEng) this.unit.engBorrow3(creep.room.controller.pos)
        }else {
            if (creep.pos.getRangeTo(this.unit.home().room.controller)>4){
                this.unit.insertTask(Tasks.goto(this.unit,creep.room.controller.pos,4))
                return CC.taskHang
            }else {
                this.unit.pushIn3(creep.room.controller.pos)
            }

        }
    }

    init(){

    }
}
class BuildTask extends Task<BuildTaskMem>{
    minEng:number
    constructor(unit:TaskUnit) {
        super(TaskType.BUILD,unit);
        this.minEng=10*unit.bodyInfo()[WORK]
    }
    run() {
        super.run()
        const site=this.unit.home().base.getBuild()
        if (!site){
            return CC.taskFinish
        }
        const creep=this.unit.creep
        if (!creep.store.energy&&!creep.storeLock){
            if (this.unit.engBorrow3(site.pos)!=OK){
                if (this.memory.noCycle){
                    return CC.taskFinish
                }else {
                    this.unit.insertTask(Tasks.fetch(this.unit,RESOURCE_ENERGY))
                    return CC.taskHang
                }
            }
        }

        if (creep.pos.getRangeTo(site)<4){
            creep.build(site)
            if (creep.store.energy<this.minEng) this.unit.engBorrow3(site.pos)
        }else {
            if (creep.pos.getRangeTo(site)>4){
                this.unit.insertTask(Tasks.goto(this.unit,site.pos,4))
                return CC.taskHang
            }else {
                this.unit.pushIn3(site.pos)
            }
        }

    }

    init(){

    }
}
class RepairTask extends Task<RepairTaskMem>{
    constructor(unit:TaskUnit) {
        super(TaskType.REPAIR,unit);

    }
    run() {
        super.run();

    }

    init(){

    }
}
Tasks={
    allTasks:{},
    /**
     * 从重启后恢复task
     */
    recover(type:TaskType,unit:TaskUnit):Task<any>{
        return new this.allTasks[type](unit)
    },
    harvest(unit:TaskUnit,site:MineSite):Task<HarvestTaskMem>{
        return new HarvestTask(unit).init(site)
    },
    goto(unit:TaskUnit,pos:RoomPosition,range?:number):Task<GotoTaskMem>{
        return new GotoTask(unit).init(pos, range)
    },
    fetch(unit:TaskUnit,res:ResourceConstant,num?:number):Task<FetchTaskMem>{
        return new FetchTask(unit).init(res,num)
    },
    collect(unit:TaskUnit,site:MineSite):Task<CollectTaskMem>{
        return new CollectTask(unit).init(site)
    },
    hatchFill(unit:TaskUnit):Task<HatchFillMem>{
        return new HatchFillTask(unit)
    },
    upgrade(unit:TaskUnit):Task<UpgTaskMem>{
        return new UpgradeTask(unit)
    },
    build(unit:TaskUnit):Task<UpgTaskMem>{
        return new BuildTask(unit)
    },
    repair(unit:TaskUnit):Task<UpgTaskMem>{
        return new RepairTask(unit)
    },
}

Tasks.allTasks[TaskType.HARVEST]=HarvestTask
Tasks.allTasks[TaskType.GOTO]=GotoTask
Tasks.allTasks[TaskType.FETCH]=FetchTask
Tasks.allTasks[TaskType.COLLECT]=CollectTask
Tasks.allTasks[TaskType.HATCH_FILL]=HatchFillTask
Tasks.allTasks[TaskType.UPGRADE]=UpgradeTask
Tasks.allTasks[TaskType.BUILD]=BuildTask
Tasks.allTasks[TaskType.REPAIR]=RepairTask

export function taskName(type:TaskType){
    switch (type){
        case TaskType.FETCH:
            return "fetch"
        case TaskType.GOTO:
            return "goto"
        case TaskType.COLLECT:
            return "collect"
        case TaskType.HARVEST:
            return "harvest"
        case TaskType.HATCH_FILL:
            return "hatch_fill"
        case TaskType.UPGRADE:
            return "upgrade"
        case TaskType.BUILD:
            return "build"
        case TaskType.REPAIR:
            return "repair"
        default:
            return type
    }
}