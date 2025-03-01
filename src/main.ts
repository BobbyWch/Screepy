import {XFrame} from "@/framework/frame";

import "@/framework/index"
import "@/mount/index"
import {Runtime} from "@/framework/runtime";
export let loop = XFrame.wrapError(()=> {
	XFrame.load()
	Runtime.update()
	Runtime.run()

	if (Game.cpu.bucket == 10000&&Game.cpu.generatePixel) Game.cpu.generatePixel()
},()=>"Main")