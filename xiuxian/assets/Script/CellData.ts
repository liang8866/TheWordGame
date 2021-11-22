export interface CellData {
    type:number,        // 显示窗口类型1,2,3,4,5,6
    itemName:string,
    itemScriptName:string,
    itemNode:cc.Node,
    age:number,   //显示年龄
    content:string,//显示的内容
    height:number,//需要显示layout的高度
    dieStr:string,
    docItem:any,
    anyData:any,//特殊附带信息
}
