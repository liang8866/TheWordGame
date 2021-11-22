


let UserInfo = new class { 
    
    name: string = '';
    sex:number = 0;//表示未知，1表示男，2表示女
    lvName:string = '先天凡体'
    age:number = -1;//表示还没出生
    dieNum:number = 0;//死亡次数
    dieTotalNum:number = 2;//最多能死2次，也就算复活2次
    startLayoutNode:cc.Node = null;
    TalentLayoutNode:cc.Node = null;
    createAttrLayoutNode:cc.Node = null;
    mainLandLayoutNode:cc.Node = null;
    mylifeLayoutNode:cc.Node = null;
  
    wuxing:number = 0;//悟性
    tipo:number = 1;//体魄
    zhenyuan:number = 2;//真元
    lingli:number = 3;//灵力
    xianli:number = 4;//仙力
    yaoli:number = 5;//妖力
    moli:number = 6;//魔力
    nianling:number = 7;//年龄
    xiuwei:number = 8;//修为 = 体魄+真元+悟性+ 灵力+ 仙力 +妖力+ 魔力
    
    randTalentMap:any = null;//随机出来的8条天赋
    selectTalentArray:any = [];//选择的天赋
    selectTalentMutexMap:any = null;//选出来的天赋池的互斥事件
    countAttrNum:number = 0;
    attrNameTable =  ["悟性","体魄","真元","灵力","仙力","妖力","魔力"];
    attrNumList:any = [10,11,12,93,14,15,16];//分别存储"悟性","体魄","真元","灵力","仙力","妖力","魔龙"，年龄，修为的值
    selectDocMap:any = new Map();///已经选出来的文案事件
    selectFateMap:any = new Map();//选择了的逆天改命事件


    getXiuWei()//获取我的修为
    {
        let xw = 0;
        for (let index = 0; index < this.attrNumList.length; index++) {
            const element = this.attrNumList[index];
            xw += Number(element);
            
        }
        return xw;
    }
    
   
    
};
window["UserInfo"] = UserInfo;