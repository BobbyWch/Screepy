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
		uu.arrayRemove(unit,this.units)
		uu.arrayRemove(unit,this.shdUpd)
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
	},
	cleanHeap() {
		global.Heap.enemyC = {}
		global.Heap.room={}//TODO 考虑定期随机清除
	},
	cleanMem(){
		const creeps=Game.creeps,memCreeps=Memory.creeps
		let n
		for (n in memCreeps){
			if (!creeps[n]){

				Unit.get(n).finalize()
				delete memCreeps[n]
			}
		}
	}

}