import {Colony} from "@/obj/Colony/colony";
import {OLD_MEMORY} from "@/framework/frame";

export class MineSite{
    colony:Colony
    id:Id<Source>
    constructor(colony:Colony,id:Id<Source>) {
        this.colony=colony
        this.id=id
        if (!this.memory){
            this.colony.memory.MSite[this.id]={
                id
            }
        }
    }
    get source():Source{
        return Game.getObjectById(this.id)
    }

    _mm:MineSiteMemory
    get memory():MineSiteMemory{
        if (OLD_MEMORY&&this._mm) return this._mm
        else return (this._mm=this.colony.memory.MSite[this.id])
    }
}

