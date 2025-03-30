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
	getCreepName:()=>`${uu.cP}${global.Gtime%10000}_${uu.cNum++}`,
	findPriority(arr:any,targets:any[],key?:string):any{
		let j,tar
		if (key){//按优先级查找对象，key为对象匹配时的键
			for (let i=0;i<targets.length;i++){
				tar=targets[i]
				for (j=0;j<arr.length;j++){
					if (arr[j][key]==tar){
						return arr[j]
					}
				}
			}
		}else {
			for (let i=0;i<targets.length;i++){
				tar=targets[i]
				for (j=0;j<arr.length;j++){
					if (arr[j]==tar){
						return arr[j]
					}
				}
			}
		}
	}
}