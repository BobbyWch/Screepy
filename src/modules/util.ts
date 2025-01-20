export const uu={
	arrayRemove(obj:any,arr:Array<any>):void{
		let i=arr.indexOf(obj)
		if (i!=-1) arr.splice(i,1)
	}
}