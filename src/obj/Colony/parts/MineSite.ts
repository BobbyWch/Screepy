import {Colony} from "@/obj/Colony/colony";
import {OLD_MEMORY} from "@/framework/frame";
import {Unit} from "@/obj/Unit/unit";
import {Logger} from "@/modules/Logger";


export class MineSite{
    colony:Colony
    id:Id<Source>
    constructor(colony:Colony,id:Id<Source>) {
        this.colony=colony
        this.id=id
        if (!this.memory){
            this.colony.memory.MSite[this.id]={
                id,
                state:MineSiteState.drop,
                used:0,
                workNum:0
            }
            this.updState()
        }
    }
    updState(){
        const sPos=this.source.pos
        const structs=sPos.findInRange(FIND_STRUCTURES,2).filter(s=>
            (s.structureType==STRUCTURE_CONTAINER&&sPos.inRangeTo(s,1))
            ||(s.structureType==STRUCTURE_LINK&&sPos.inRangeTo(s,2)))
        let expStore:StructureLink|StructureContainer=structs.find(s=>s.structureType==STRUCTURE_LINK) as StructureLink
        if (expStore){
            this.memory.link=expStore.id
            if (this.memory.con) {
                Game.getObjectById(this.memory.con).destroy()
                delete this.memory.con
            }
        }else {
            expStore=structs.find(s=>s.structureType==STRUCTURE_CONTAINER) as StructureContainer
            if (expStore){
                this.memory.con=expStore.id
            }else this.memory.state=MineSiteState.drop
        }
    }
    energyLeft():number{
        if (this.memory.state==MineSiteState.drop){
            return _.sum(this.source.pos.findInRange(FIND_DROPPED_RESOURCES,1),r=>r.amount)-this.memory.used
        }else {
            const tar=this.memory.state==MineSiteState.link?this.link:this.container
            if (tar) return tar.store.energy-this.memory.used
            else return 0
        }
    }
    regGetter(unit:Unit){
        if (unit.memory.reg.mineSite){
            //TODO for test
            Logger.err("try binding binded unit")
            return
        }
        unit.memory.reg.mineSite={
            id:this.id,
            num:unit.creep.store.getCapacity()
        }
        this.memory.used+=unit.memory.reg.mineSite.num
    }
    unRegGetter(unit:Unit){
        if (!unit.memory.reg.mineSite){
            //TODO for test
            Logger.err("try unbinding unbinded unit")
            return
        }
        this.memory.used-=unit.memory.reg.mineSite.num
        delete unit.memory.reg.mineSite
    }
    regWork(unit:Unit){
        if (unit.memory.reg.mineSite){
            //TODO for test
            Logger.err("try binding binded work")
            return
        }
        unit.memory.reg.mineSite={
            id:this.id,
            num:-1
        }
        this.memory.workNum+=unit.bodyInfo()[WORK]
    }
    unRegWork(unit:Unit){
        if (!unit.memory.reg.mineSite){
            //TODO for test
            Logger.err("try unbinding unbinded work")
            return
        }
        this.memory.workNum-=unit.bodyInfo()[WORK]
        delete unit.memory.reg.mineSite
    }
    clear(){
        this._src=null
    }
    _src:Source
    get source():Source{
        if (!this._src) this._src=Game.getObjectById(this.id)
        return this._src
    }

    _mm:MineSiteMemory
    get memory():MineSiteMemory{
        if (OLD_MEMORY&&this._mm) return this._mm
        else return (this._mm=this.colony.memory.MSite[this.id])
    }
    get link():StructureLink{
        return (Game.structures[this.memory.link] as StructureLink)||(this.memory.link=undefined)
    }
    get container():StructureContainer{
        return Game.getObjectById(this.memory.con)||(this.memory.con=undefined)
    }

}

