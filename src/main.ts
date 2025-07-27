import {XFrame} from "@/framework/frame";

import "@/framework/index"
import "@/mount/index"
import {Runtime} from "@/framework/runtime";
import "@/lib/betterMove";
import {Colors, Logger} from "@/modules/Logger";
import {Visual} from "@/modules/visual/visual";
import {Colony} from "@/obj/Colony/colony";
import {planner63} from "@/obj/Colony/parts/colony_base";

global.Heap={
	creep:{},
	enemyC:{},
	room:{}
}
Logger.log("Screepy launched -- time:"+Game.time,Colors.green)
let haltTick
export let loop = XFrame.wrapError(()=> {
	if (haltTick) Game.cpu.halt()
	if (Memory.a&&Object.keys(Game.creeps).length==0) {
		delete Memory.a
		haltTick=true
		return;
	}
	if (Memory.a) return

	XFrame.load()
	Runtime.update()
	Runtime.run()

	Visual.run()
	if (Game.flags.visual) api.showPlan(Game.flags.visual.pos.roomName)
	if (global.Gtime%11==0) Runtime.cleanMem()
	if (global.Gtime%7003==0) Runtime.cleanHeap()

	if (Game.cpu.bucket == 10000&&Game.cpu.generatePixel) Game.cpu.generatePixel()
},()=>"Main")
// @ts-ignore
Object.defineProperty(global,"resp",{
	get:function (){
		let key
		for (key in Memory){
			delete Memory[key]
		}
		Memory.a=true
	},
	set:()=>{}
})
const api={
	showPlan(roomName){
		const room=Game.rooms[roomName]
		if (room){
			let plan
			const base=Colony.get(roomName).base
			if(room.controller.my&&base.memory.bluePrint&&base.memory.bluePrint!="manual"){
				const unzip=[];
				base.memory.bluePrint.split("#").forEach(o=>{
					unzip.push(o.split("/"));
				});
				let i;
				plan={}
				for (i=0;i<unzip.length;i++){
					if(!plan[unzip[i][2]]) plan[unzip[i][2]]=[]
					plan[unzip[i][2]].push([Number(unzip[i][0]),Number(unzip[i][1])])
				}
			}else{
				plan=planner63.ManagerPlanner.computeManor(roomName,[room.controller,room.find(FIND_MINERALS)[0],room.find(FIND_SOURCES)[0],room.find(FIND_SOURCES)[1]]).structMap;
			}
			if (plan) planner63.HelperVisual.showRoomStructures(roomName,plan)
			else console.log("没有布局规划")
		}else if (Game.flags.pc&&Game.flags.pm&&Game.flags.pa&&Game.flags.pb){
			const plan=planner63.ManagerPlanner.computeManor(roomName,[Game.flags.pc,Game.flags.pm,Game.flags.pa,Game.flags.pb]).structMap
			if (plan) planner63.HelperVisual.showRoomStructures(roomName,plan)
			else console.log("没有布局规划")
		}else {
			console.log("没有旗子")
		}
	}
}
