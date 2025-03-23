import {Colony} from "@/obj/Colony/colony";
import {uu} from "@/modules/util";
import {Unit} from "@/obj/Unit/unit";

export const Runtime={
	cls:[] as Colony[],
	units:[] as Unit[],
	shdUpd:[] as RuntimeObject[],
	addColony(colony: Colony): void {
		this.cls.push(colony)
		this.shdUpd.push(colony)
	},
	removeColony(colony: Colony): void {
		uu.arrayRemove(colony,this.cls)
		uu.arrayRemove(colony,this.shdUpd)
	},
	addUnit(unit:Unit):void{
		this.units.push(unit)
		this.shdUpd.push(unit)
	},
	removeUnit(unit:Unit):void{
		uu.arrayRemove(Unit,this.units)
		uu.arrayRemove(Unit,this.shdUpd)
	},
	run(){
		const toRun:Array<RuntimeObject[]>=[this.cls,this.units]
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