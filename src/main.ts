import {XFrame} from "@/framework/frame";

import "@/framework/index"
import "@/mount/index"
import {Runtime} from "@/framework/runtime";
import "@/lib/betterMove";
import {Colors, Logger} from "@/modules/Logger";

global.Heap={
	creep:{},
	enemyC:{}
}
Logger.log("Screepy launched -- time:"+Game.time,Colors.green)
if (Memory.a&&Object.keys(Game.creeps).length==0) delete Memory.a
export let loop = XFrame.wrapError(()=> {
	if (Memory.a) return
	XFrame.load()
	Runtime.update()
	Runtime.run()
	if (global.Gtime%7003==0) XFrame.cleanHeap()

	if (Game.cpu.bucket == 10000&&Game.cpu.generatePixel) Game.cpu.generatePixel()
},()=>"Main")
// @ts-ignore
global.resp=()=>{
	let key
	for (key in Memory){
		delete Memory[key]
	}
	Memory.a=true
}