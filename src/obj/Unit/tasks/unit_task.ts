import {OLD_MEMORY, XFrame} from "@/framework/frame";
import {TaskUnit, Unit} from "@/obj/Unit/unit";

export abstract class UnitTask<memType extends TaskMemory>{
    static allUnitTask={}
    static createTask(type:UnitTaskType, unit:TaskUnit):UnitTask<any>{
        return new this.allUnitTask[type](unit)
    }

    unit:TaskUnit
    type:UnitTaskType
    constructor(type:UnitTaskType, unit:TaskUnit) {
        this.unit=unit
        this.type=type
        if (!this.unit.memory.taskData[this.type]) this.unit.memory.taskData[this.type]={}

    }

    _mm:memType
    get memory():memType{
        if (OLD_MEMORY&&this._mm) return this._mm
        else return (this._mm=this.unit.memory.taskData[this.type] as memType)
    }

    run():number{
        return 0
    }
}

XFrame.addMount(()=>{
    class HarvestTask extends UnitTask<HarvestTask>{
        constructor(unit:TaskUnit) {
            super(UnitTaskType.HARVEST,unit);
        }

        run() {
            super.run();
            this.unit.creep.moveTo(Game.getObjectById(this.memory.src))
            return 0
        }
    }
})
