import {XFrame} from "@/framework/frame";

XFrame.addMount(()=>{
    const empty = () => {}
    const defStructure=(name,memKey)=>{
        Object.defineProperty(Room.prototype, name, {
            get: function() {
                if (!this[memKey]){
                    if (this.memory.ids[memKey]) {
                        this[memKey] = Game.structures[this.memory.ids[memKey]]
                        if (!this[memKey]){
                            delete this.memory.ids[memKey]
                            return null
                        }
                    } else return null
                }
                return this[memKey]
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
    /**
     * 只应在自己控制的房间使用
     */
    Room.prototype.sources=function () {
        if (!this._scs){
            if (this.memory.ids.ss){
                this._scs=this.memory.ids.ss.map(s=>Game.getObjectById(s))
            }else {
                this._scs=this.find(FIND_SOURCES)
                this.memory.ids.ss=this._scs.map(s=>s.id)
            }
        }
        return this._scs
    }
})