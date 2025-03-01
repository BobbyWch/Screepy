export const uu={
	arrayRemove(obj:any,arr:Array<any>):void{
		let i=arr.indexOf(obj)
		if (i!=-1) arr.splice(i,1)
	},
	firstKey(o:object):string|undefined{
		// noinspection LoopStatementThatDoesntLoopJS,UnnecessaryLocalVariableJS
		for (const a in o) return a
	}
}