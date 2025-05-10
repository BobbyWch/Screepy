import {OLD_MEMORY, XFrame} from "@/framework/frame";
import {uu} from "@/modules/util";
import {TaskUnit} from "@/obj/Unit/unit";
import {MineSite} from "@/obj/Colony/parts/MineSite";

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
XFrame.addMount(()=>{
    class HarvestTask extends Task<HarvestTaskMem>{
        constructor(unit:TaskUnit) {
            super(TaskType.HARVEST,unit);
        }
        init(srcId:Id<Source>){
            this.memory.src=srcId
            this.memory.mineNum=(this.unit.memory.body.data as ZippedBodyInfo).find(b=>b[0]==WORK)[1]*2
            const source=Game.getObjectById(srcId)
            this.updStore(source,source.pos.findInRange(FIND_STRUCTURES,2))
            this.memory.init=true
            return this
        }

        run() {
            super.run();
            if (this.unit.notSpawned()) return
            const source=Game.getObjectById(this.memory.src),creep=this.unit.creep
            if (creep.pos.isNearTo(source)){
                if (creep.store.getFreeCapacity()>this.memory.mineNum) creep.harvest(source)
            }else {
                this.unit.creep.moveTo(Game.getObjectById(this.memory.src))
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
            if (this.unit.creep.pos.getRangeTo(this.pos)>this.memory.range){
                this.unit.creep.moveTo(this.pos)
            }else return CC.taskFinish
        }
    }
    class HatchFillTask extends Task<any>{

        constructor(unit:TaskUnit) {
            super(TaskType.HATCH_FILL,unit);


        }
        run(){
            super.run()
            if (this.unit.creep.store[RESOURCE_ENERGY]==0){
                this.unit.insertTask(Tasks.fetch(this.unit,RESOURCE_ENERGY))
                return CC.taskHang
            }
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
                    this.unit.insertTask(Tasks.collect(this.unit,this.unit.home().mineSites[0]))
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
                this.site=this.unit.home().mineSites.find(s=>s.id==this.memory.srcId)
            }
        }
        run() {
            super.run();
            if (this.unit.creep.pos.getRangeTo(this.site.source.pos)>2){
                this.unit.insertTask(Tasks.goto(this.unit,this.site.source.pos,2))
                return CC.taskHang
            }else {

            }
        }

        init(site:MineSite){
            this.site=site
            this.memory.srcId=site.id
            this.memory.init=true
            return this
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
        harvest(unit:TaskUnit,srcId:Id<Source>):Task<HarvestTaskMem>{
            return new HarvestTask(unit).init(srcId)
        },
        goto(unit:TaskUnit,pos:RoomPosition,range?:number):Task<GotoTaskMem>{
            return new GotoTask(unit).init(pos, range)
        },
        fetch(unit:TaskUnit,res:ResourceConstant,num?:number):Task<FetchTaskMem>{
            return new FetchTask(unit).init(res,num)
        },
        collect(unit:TaskUnit,site:MineSite):Task<CollectTaskMem>{
            return new CollectTask(unit).init(site)
        }
    }

    Tasks.allTasks[TaskType.HARVEST]=HarvestTask
    Tasks.allTasks[TaskType.GOTO]=GotoTask
    Tasks.allTasks[TaskType.FETCH]=FetchTask
    Tasks.allTasks[TaskType.COLLECT]=CollectTask
},true)
