import {XFrame} from "@/framework/frame";
import "./cache_room"

XFrame.addMount(()=>{

    Room.prototype.initMemory=function (){
        let mem = this.memory

        // notNull(mem, "centerTasks", {})
        // notNull(mem, "ids", {})
        // notNull(mem, "prop", {})
        // notNull(mem, "boost", {})
        // notNull(mem,"harvestData",{})
        // notNull(mem,"defense",{})
        // notNull(mem,"autoBoost",{})
        //
        // notNull(mem,"transfer",[])
        // notNull(mem,"buying",[])
        // notNull(mem, "tasks", [])
        // notNull(mem, "mission", [])
        // notNull(mem,"obtask",[])
        // if (!mem.mineral) mem.mineral = this.find(FIND_MINERALS)[0].mineralType
        // if (this.terminal) {
        //     mem = this.terminal.memory
        //     notNull(mem, "deals", [])
        //     notNull(mem, "sends", [])
        //     notNull(mem,"watches",[])
        // }
        // if (this.factory){
        //     mem=this.factory.memory
        //     notNull(mem,"tasks",[])
        // }
        // if (!Memory.creepConfigs[this.name]) {
        //     Memory.creepConfigs[this.name] = {}
        //     this.find(FIND_STRUCTURES).forEach(o=>{
        //         if (!o.my){
        //             if (o.structureType==STRUCTURE_CONTAINER||o.structureType==STRUCTURE_SPAWN||o.structureType==STRUCTURE_NUKER||(!o.store&&o.structureType!=STRUCTURE_WALL)){
        //                 o.destroy()
        //             }else {
        //                 const used=_.sum(o.store)
        //                 if (used==o.store[RESOURCE_ENERGY]&&used<1500){
        //                     o.destroy()
        //                 }
        //             }
        //         }
        //     })
        //     this.find(FIND_HOSTILE_CONSTRUCTION_SITES).forEach(o=>o.remove())
        //     this.find(FIND_SOURCES).forEach(o => this.spawnMem({role: config.harvester, target: o.id}))
        //     CreepApi.set(config.builder, 2, this.name)
        //     if (!this.storage||!this.storage.my) this.addMission("SpeedUp")
        // }
        // if (!towerData[this.name]){
        //     const d={}
        //     d.towers=[]
        //     d.waitRepairs=[]
        //     d.cooldown=1
        //     this.find(FIND_MY_STRUCTURES).forEach(o=>o.structureType==STRUCTURE_TOWER&&d.towers.push(o.id))
        //     towerData[this.name]=d
        // }
    }
})