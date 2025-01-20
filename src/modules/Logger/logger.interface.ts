interface LoggerProto{
	err(e:string,notify?:boolean):void;
	log(s:string):void;
	$colorful(s:string,color:string):string;
}