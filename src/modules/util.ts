export const uu={
	cNum:0,
	cP:["a","s","d","f"][Game.shard.name[5]]||"c",
	arrayRemove(obj:any,arr:Array<any>):void{
		let i=arr.indexOf(obj)
		if (i!=-1) arr.splice(i,1)
	},
	firstKey(o:object):string|undefined{
		// noinspection LoopStatementThatDoesntLoopJS,UnnecessaryLocalVariableJS
		for (const a in o) return a
	},
	getCreepName:()=>`${uu.cP}${global.Gtime%10000}_${uu.cNum++}`
}