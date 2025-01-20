import {XFrame} from "@/framework/frame";

import "@/framework/index"
export let loop = XFrame.wrapError(()=> {
	XFrame.load()


	if (Game.cpu.bucket == 10000&&Game.cpu.generatePixel) Game.cpu.generatePixel()
},()=>"Main")