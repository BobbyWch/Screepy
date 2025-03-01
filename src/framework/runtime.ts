import {RuntimeProto} from "@/framework/frame.interface";
import {Colony} from "@/obj/Colony/colony";
import {uu} from "@/modules/util";

export const Runtime:RuntimeProto={
	cls:[] as Colony[],
	shdUpd:[] as RuntimeObject[],
	addColony(colony: Colony): void {
		this.cls.push(colony)
		this.shdUpd.push(colony)
	},
	removeColony(colony: Colony): void {
		uu.arrayRemove(colony,this.cls)
		uu.arrayRemove(colony,this.shdUpd)
	},
	run(){
		const toRun:Array<RuntimeObject[]>=[this.cls]
		let i,j,aa
		for (i=0;i<toRun.length;i++){
			aa=toRun[i]
			for (j=0;j<aa.length;j++){
				aa[j].run()
			}
		}
	},
	update():void{
		let i,upds=this.shdUpd,len=upds.length
		for (i=0;i<len;i++){
			upds[i].update()
		}
	}

}