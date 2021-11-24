import TableView, { TableViewCell, TableViewHandler } from "./TableView";

import { CellData } from "./CellData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class mylifeLayout extends cc.Component {

    @property(cc.Node)
    headicon1: cc.Node = null;//女头像

    @property(cc.Node)
    headicon2: cc.Node = null;//男头像

    @property(cc.Node)
    headicon3: cc.Node = null;//未知

    @property(cc.RichText)
    sexRichText: cc.RichText = null;//性别

    @property(cc.RichText)
    lvRichText: cc.RichText = null;//等级
    
    attrLabelList:any = [];
   
   
    @property(cc.Node)
    lifeitem1:cc.Node = null;
    @property(cc.Node)
    lifeitem2:cc.Node = null;
    @property(cc.Node)
    lifeitem3:cc.Node = null;
    @property(cc.Node)
    lifeitem4:cc.Node = null;
    @property(cc.Node)
    lifeitem5:cc.Node = null;
    @property(cc.Node)
    lifeitem6:cc.Node = null;
    @property(cc.Node)
    lifeitem7:cc.Node = null;

    @property(cc.Prefab)
    popLayer:cc.Prefab = null;
    @property(cc.Prefab)
    showTimeLayer:cc.Prefab = null;

    @property(cc.Node)
    growupLifeNode:cc.Node = null
    @property(cc.Node)
    sumLifeNode:cc.Node = null
    @property(cc.Node)
    changeLifeNode:cc.Node = null;

    /** 列表组件 */
    @property({ type: TableView, displayName: "TableView"})
    mTableView: TableView = null;

    tableDataArray:any = [];
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
       
        this.mTableView.registerHandler(this._tableCellAtIndex.bind(this), TableViewHandler.kTableCellAtIndex);
        this.mTableView.registerHandler(this._tableCellSizeForIndex.bind(this), TableViewHandler.kTableCellSizeForIndex);
        // this.onBeginShow()//进入的时候显示数据
    }
    getAttrLabelObj()
    {
        if(this.attrLabelList.length <=0)
        {
            for (let index = 0; index < 7; index++) {
                let mlabel = Tools.findLabel(this.node,'mLabel'+index);
                this.attrLabelList.push(mlabel);
            }

        }     
           
    }

    onBeginShow()//进入的时候显示数据
    {
        Tools.addTalentArrToMyAttr();//吧 选择的天赋里面的属性添加到我的身上
        UserInfo.selectTalentMutexMap = Tools.getSelectTalentMutexToMap();//选择的天赋里面的互斥事件
        this.getAttrLabelObj();//
       this.showAllAttrNum();;//显示属性

        UserInfo.age = -1;//重置年龄
        UserInfo.lvName = '先天凡体';
        UserInfo.dieNum = 0;
        this.setLvNameShow()//显示等级和名字
        this.setHeadIconAndSexShow();//显示头像
        UserInfo.selectDocMap = new Map();///重置文案事件为空的map
        UserInfo.selectFateMap = new Map();//选择了的逆天改命事件
        this.tableDataArray = [];//相当于初始化为空
        this.mTableView.reloadData(this.tableDataArray);

    }

    setHeadIconAndSexShow()
    {
        this.headicon1.active = false;
        this.headicon2.active = false;
        this.headicon3.active = false;
        if(UserInfo.sex == 0)
        {
            this.headicon3.active = true;
            this.sexRichText.string = Tools.getLifeLvRich("未知");
        }else if(UserInfo.sex == 1)
        {
            this.headicon2.active = true;
            this.sexRichText.string = Tools.getLifeLvRich("男");
        }
        else if(UserInfo.sex == 2)
        {
            this.headicon1.active = true;
            this.sexRichText.string = Tools.getLifeLvRich("女");
        }
   
    }
    showAllAttrNum()//显示属性出来
    {
        for (let index = 0; index < 7; index++) {
            let mlabel =  this.attrLabelList[index];
             mlabel.string = UserInfo.attrNameTable[index]+"："+ UserInfo.attrNumList[index];
        }
        
    }
    setLvNameShow()
    {
        this.lvRichText.string = Tools.getLifeLvRich(UserInfo.lvName);
    }

    onClickGrowUp()
    {
        this.getFromAgeDataForDoc();

    }

    onClicklifeSum()
    {
        this.node.active = false;
        UserInfo.startLayoutNode.active = true;
    }

    onClickChangeLife()//逆天改命
    {
         let fateEventItem = ConfigMgr.getFateEvent();//查找所有符合当前复活的逆天改命事件
         UserInfo.selectFateMap.set(fateEventItem.id,fateEventItem);
         this.setShowItem3(fateEventItem);//你复活了
        this.changeLifeNode.active = false;
        this.growupLifeNode.active = true;
        this.sumLifeNode.active = false;
   
    }
    /** 当前索引列表项 */
    private _tableCellAtIndex(tableview: TableView, index: number): TableViewCell {
        let cell = null;
        let data:CellData = this.tableDataArray[index];
        
        cell = tableview.findCellByName(data.itemName);
        let node = cell.getChildByName(data.itemName);
        if(!node){
            node = cc.instantiate(data.itemNode);
            node.active = true;
            node.parent = cell;
        }
        node.y = 0;
        node.setContentSize(579,data.height);
        let nodeScript = node.getComponent(data.itemScriptName);
        if(nodeScript)
        {
            nodeScript.onSetCellData(data);
            if(data.type ==5)
            {
                nodeScript.setSelfScript(this);
            }
        }
       

        return cell;
    }

     /** 当前索引列表项大小 */
     private _tableCellSizeForIndex(tableview: TableView, index: number): cc.Size {
        let tagSize = cc.size(579, 63);
      
        let data:CellData = this.tableDataArray[index];
        tagSize = cc.size(579, data.height+10);//data.itemNode.getContentSize();
        return tagSize;
 
    }

    getFromAgeDataForDoc()
    {
        UserInfo.age +=1;//年龄+1
        // UserInfo.age = 8
        let ageItemData = ConfigMgr.ageArray[UserInfo.age];
        let evenIDsStr = ageItemData.eventid + "";//转成字符串
        let eventIdsArray = evenIDsStr.split(',');

        Tools.setTalentArrToMyAttr();//把符合条件的添加
        this.showAllAttrNum();//更新显示

        let fitAllDocArrary = [];
        for (let index = 0; index < eventIdsArray.length; index++) {
            const docId = eventIdsArray[index];
           let docItem =  ConfigMgr.docMap.get(docId);
            //cc.log("-----------------------------------开始--------------------------------------------------");
           let fag0 =  Tools.getIsHaveDoc(docItem);
           let fag1 =  Tools.getRandDocIsInSelectExistNoHappen(docItem);//是否在我选择的天赋池里面有互斥事件
           let fag2 = false;
           if(fag1 == false&&fag0 == false)
           {
               //let xiuwei = UserInfo.getXiuWei();//获取我的修为
               fag2= Tools.getRandDocIsXwEventProbability(docItem);
               //cc.log("fag2=",fag2);
               if(fag2 == true)//可用用
               {

                    fitAllDocArrary.push(docItem);
               }
               
           }
        
        }
       // cc.log("---------------------------------------结束----------------------------------------------");
       // cc.log(fitAllDocArrary);
        let rand = ConfigMgr.getRandomNum(0,fitAllDocArrary.length-1);
        let docItemData = fitAllDocArrary[rand];
        

        if(parseInt(docItemData.type) == 1)
        {
            this.setTypeShow1(docItemData);//type=1进行的逻辑
        }
        else if(parseInt(docItemData.type) == 2)
        {
            this.setTypeShow2(docItemData)//type=2进行的逻辑

        }
        else if(parseInt(docItemData.type) ==3)//奇遇事件
        {
           this.setTypeShow3(docItemData)//奇遇事件

        }
        else if(parseInt(docItemData.type) ==4)//触发事件任务
        {
            this.setTypeShow4(docItemData)//奇遇事件

        }
        else if(parseInt(docItemData.type) == 10)//段位，和各种属性变化的
        {
            this.setTypeShow10(docItemData);

        }

        if(UserInfo.age ==0)
        {
            if(docItemData.existNoHappen == "1002")
            {
                UserInfo.sex = 1;
            }else{
                UserInfo.sex = 2;
            }
            this.setHeadIconAndSexShow();//显示头像
        }
        

    };

    setTypeShow1(docItemData)//type=1进行的逻辑
    {
        let isDie =  Tools.getIsDieForDocItem(docItemData);//根据ITEM判断是否会死亡
       // cc.log("-------->>>> isDie=",isDie)
        if(isDie == false)
        {
            
            this.setShowItem1(docItemData);//普通文本
        }else{
            this.setShowItem2(docItemData)//显示死亡
            this.onForDieShowBtn()//死了后的按钮表现
        }
    };
    setTypeShow2(docItemData)//type=2进行的逻辑
    {
        //先弹出参加测试窗口

        this.popUpLayout(docItemData);
    };
    setTypeShow3(docItemData)//奇遇事件
    {
        this.growupLifeNode.active = false;//成长按钮屏蔽下
        this.setShowItem1(docItemData);//先显示1类型的文本，然后显示有按钮的layout
      
        let advMeetData = ConfigMgr.advMeetingMap.get(Number(docItemData.typEvent));
        
        this.setShowItem5(advMeetData);//先显示1类型的文本，然后显示有按钮的layout
    };

    setTypeShow4(docItemData)//type=4进行的逻辑
    {
        this.setShowItem1(docItemData);//先显示1类型的文本
        //然后弹出窗口
        this.popActionEventLayout(docItemData)//弹出行为事件
    };
    setTypeShow10(docItemData)//
    {
        this.setShowItem6(docItemData);
        UserInfo.lvName = docItemData.lvname;
        this.setLvNameShow();
    };

    onForDieShowBtn()//死了后的按钮表现
    {
        UserInfo.dieNum++
        if (UserInfo.dieNum < UserInfo.dieTotalNum) {
            this.growupLifeNode.active = false;//按钮关闭
            this.sumLifeNode.active = true;
            this.changeLifeNode.active = true;//逆天改命按钮
        }
        else{
            this.growupLifeNode.active = false;//按钮关闭
            this.sumLifeNode.active = true;
            this.changeLifeNode.active = false;//逆天改命按钮
        }
    }
    setShowItem1(docItemData)//正常的文案
    {
        let h = 63;
        let n = Math.ceil(docItemData.desc.length/19.0);
        // cc.log("----?>>>>>>>",docItemData.desc.length,n)
        if(n>1)
        {
            h = 63+ (n-1)*26;
        }
        let mcellData:CellData = {
            type:1,
            itemName:"lifeitem1",
            itemScriptName:"lifeItem1",
            itemNode:this.lifeitem1,
            age: UserInfo.age,
            content:docItemData.desc,
            height:h,
            dieStr:"",
            docItem:docItemData,
            anyData:docItemData,//特殊附带信息
        }
        UserInfo.selectDocMap.set(docItemData.id,docItemData);
        this.tableDataArray.push(mcellData);
        this.mTableView.reloadData(this.tableDataArray);
        this.mTableView.scrollToBottom();
    }
    

    
    setShowItem2(docItemData)//显示死亡
    {
        // cc.log("你死拉-------")
        let mcellData:CellData = {
            type:2,
            itemName:"lifeitem2",
            itemScriptName:"lifeItem2",
            itemNode:this.lifeitem2,
            age: UserInfo.age,
            content:docItemData.desc,
            height:63,
            dieStr:"你挂了",
            docItem:docItemData,
            anyData:docItemData,//特殊附带信息
        }
        UserInfo.selectDocMap.set(docItemData.id,docItemData);
        this.tableDataArray.push(mcellData);
        this.mTableView.reloadData(this.tableDataArray,true);
        this.mTableView.scrollToBottom();
    }

    setShowItem3(fateEventItem)//你复活了
    {
        
        let mcellData:CellData = {
            type:3,
            itemName:"lifeitem3",
            itemScriptName:"lifeItem3",
            itemNode:this.lifeitem3,
            age: UserInfo.age,
            content:fateEventItem.fateEventDesc,
            height:63,
            dieStr:"",
            docItem:fateEventItem,
            anyData:fateEventItem,//特殊附带信息
        }
       
        this.tableDataArray.push(mcellData);
        this.mTableView.reloadData(this.tableDataArray,true);
        this.mTableView.scrollToBottom();
    }

    setShowItem4(docItemData,popChoseDocItemData,isDie)
    {
        let str = "";
        if (isDie) {
            str = "，你挂了";
        }
        let mcellData:CellData = {
            type:4,
            itemName:"lifeitem4",
            itemScriptName:"lifeItem4",
            itemNode:this.lifeitem4,
            age: UserInfo.age,
            content:docItemData.desc+str,
            height:150,
            dieStr:"",
            docItem:docItemData,
            anyData:popChoseDocItemData.desc,//特殊附带信息
        }
        UserInfo.selectDocMap.set(docItemData.id,docItemData);
        this.tableDataArray.push(mcellData);
        this.mTableView.reloadData(this.tableDataArray,true);
        this.mTableView.scrollToBottom();
        if (isDie) {
            this.onForDieShowBtn()//死了后的按钮表现
        }
     
    }

   setShowItem5(advMeetData)
    {
       
        let mcellData:CellData = {
            type:5,
            itemName:"lifeitem5",
            itemScriptName:"lifeItem5",
            itemNode:this.lifeitem5,
            age: UserInfo.age,
            content:advMeetData.randEvent,
            height:150,
            dieStr:"",
            docItem:advMeetData,
            anyData:"",//特殊附带信息
        }
      
        this.tableDataArray.push(mcellData);
        this.mTableView.reloadData(this.tableDataArray,true);
        this.mTableView.scrollToBottom();
    }

    setShowItem6(docItemData)
    {
       //有多少个属性,用于计算高度"tipo":"","zhenyuan":"","wuxing":"","lingli":"","xianli":"","yaoli":"","moli":""
    //    attrNameTable =  ["悟性","体魄","真元","灵力","仙力","妖力","魔力"];
    //    attrNumList:any = [10,11,12,13,14,15,16];//分别存储"悟性","体魄","真元","灵力","仙力","妖力","魔龙"，年龄，修为的值
       let count =0;
      
       if(docItemData.wuxing != "")
       {
            count++;
            UserInfo.attrNumList[0] +=  Tools.getAttrValue(docItemData.wuxing);
       }
       if(docItemData.tipo != "")
       {
            count++;
            UserInfo.attrNumList[1] += Tools.getAttrValue(docItemData.tipo);
       }
       if(docItemData.zhenyuan != "")
       {
            count++;
            UserInfo.attrNumList[2] += Tools.getAttrValue(docItemData.zhenyuan);
       }
       if(docItemData.lingli != "")
       {
            count++;
            UserInfo.attrNumList[3] += Tools.getAttrValue(docItemData.lingli);
       }
       if(docItemData.xianli != "")
       {
            count++;
            UserInfo.attrNumList[4] += Tools.getAttrValue(docItemData.xianli);
       }
       if(docItemData.yaoli != "")
       {
            count++;
            UserInfo.attrNumList[5] += Tools.getAttrValue(docItemData.yaoli);
       }
       if(docItemData.moli != "")
       {
            count++;
            UserInfo.attrNumList[6] += Tools.getAttrValue(docItemData.moli);
       }
        let h = 80+count*30;
        
        
        let mcellData:CellData = {
            type:6,
            itemName:"lifeitem6",
            itemScriptName:"lifeItem6",
            itemNode:this.lifeitem6,
            age: UserInfo.age,
            content:docItemData.desc,
            height:h,
            dieStr:"",
            docItem:docItemData,
            anyData:"",//特殊附带信息
        }
      
         this.tableDataArray.push(mcellData);
         this.mTableView.reloadData(this.tableDataArray,true);
        this.showAllAttrNum();//显示属性出来
        this.growupLifeNode.active = true;//成长按钮显示出来
        this.mTableView.scrollToBottom();
    }

    setShowItem7(docItemData,artifactData1,artifactData2,artifactData3)
    {   
      
        let titleDesc = "";
        if(docItemData)
        {
            titleDesc = docItemData.desc;
        }
        let baowu = "<color=#ffffff> 获得宝物： </color>";
        let gongfa = "<color=#ffffff> 获得功法： </color>";
        let fag1 = false;
        if(artifactData1 != null || artifactData2 != null || artifactData1 != null)
        {
            if(artifactData1 != null && parseInt(artifactData1.type) ==1)
            {
                baowu = baowu + Tools.getAtifactRich(artifactData1.name,artifactData1.lv);
                fag1 = true;
            }
            if(artifactData2 != null && parseInt(artifactData2.type) ==1)
            {
                baowu = baowu + Tools.getAtifactRich(artifactData2.name,artifactData2.lv);
                fag1 = true;
            }
            if(artifactData3 != null && parseInt(artifactData3.type) ==1)
            {
                baowu = baowu + Tools.getAtifactRich(artifactData3.name,artifactData3.lv);
                fag1 = true;
            }
        }
        let fag2 = false;
        if(artifactData1 != null || artifactData2 != null || artifactData3 != null)
        {
            if(artifactData1 != null && parseInt(artifactData1.type) ==2)
            {
                gongfa = gongfa + Tools.getAtifactRich(artifactData1.name,artifactData1.lv);
                fag2 = true;
            }
            if(artifactData2 != null && parseInt(artifactData2.type) ==2)
            {
                gongfa = gongfa + Tools.getAtifactRich(artifactData2.name,artifactData2.lv);
                fag2 = true;
            }
            if(artifactData3 != null && parseInt(artifactData3.type) ==2)
            {
                gongfa = gongfa + Tools.getAtifactRich(artifactData3.name,artifactData3.lv);
                fag2 = true;
            }
        }
        if (fag1 == false) {
            baowu = "";
        }
        if (fag2 == false) {
            gongfa = "";
        }
       let arrtList1 = Tools.getAtifactXwAttr(artifactData1);
       let arrtList2 = Tools.getAtifactXwAttr(artifactData2);
       let arrtList3 = Tools.getAtifactXwAttr(artifactData3);

       let showAttrList = [0,0,0,0,0,0,0];
       for (let index = 0; index < 7; index++) {//累计属性到总和
           
            let n = arrtList1[index] + arrtList2[index] + arrtList3[index];
            UserInfo.attrNumList[index]  += n;
            showAttrList[index]  =  n;
       }
       this.showAllAttrNum();//显示属性出来
       let count = 0;
       if(baowu != "")
       {
            count++;
       }
       if(gongfa != "")
       {
            count++;
       }
       for (let i = 0; i <7; i++) {
           if(showAttrList[i] != 0)
           {
                count++;
           }
       }
       let h = 80+count*30;
    
       let anyData = {
           mbaowu: baowu,
           mgongfa:gongfa,
           mshowAttrList:showAttrList
       } 
       
        
        let mcellData:CellData = {
            type:7,
            itemName:"lifeitem7",
            itemScriptName:"lifeItem7",
            itemNode:this.lifeitem7,
            age: UserInfo.age,
            content:titleDesc,
            height:h,
            dieStr:"",
            docItem:null,
            anyData:anyData,//特殊附带信息
        }
      
          this.tableDataArray.push(mcellData);
          this.mTableView.reloadData(this.tableDataArray,true);

         this.growupLifeNode.active = true;//成长按钮显示出来
         this.mTableView.scrollToBottom();
    }

    onClickItem5CallBack(buttonEventKey,anyData)
    {
        this.tableDataArray[ this.tableDataArray.length-1].anyData = anyData;
        this.mTableView.reloadData(this.tableDataArray,true);
        

        let popChoseDocItemData = this.getButtonKeyEventByDoc(buttonEventKey);
    
       
        this.setShowItem6(popChoseDocItemData);

    }

    popUpLayout(docItemData)
    {
        UserInfo.selectDocMap.set(docItemData.id,docItemData);
        let popLayoutNode = cc.instantiate(this.popLayer);
        popLayoutNode.active = true;
        popLayoutNode.parent = this.node;
     
        let nodeScript = popLayoutNode.getComponent("popLayout");
        if(nodeScript)
        {
            nodeScript.onSetCellData(docItemData,this);
        }
        
    }
    onClickPopLayout(buttonEventKey,docItemData)
    {
       
     
        let popChoseDocItemData = this.getButtonKeyEventByDoc(buttonEventKey);
    
        UserInfo.selectDocMap.set(popChoseDocItemData.id,popChoseDocItemData);
        let isDie = Tools.getIsDieForDocItem(popChoseDocItemData);
        this.setShowItem4(docItemData,popChoseDocItemData,isDie)


    }
    
    getButtonKeyEventByDoc(buttonEventKey)
    {

        let docBtnEventArray = ConfigMgr.getButtonEventWithDocItem(buttonEventKey);
  
        //查找到符合的item
        let resItemArray1 = [];
        for (let index = 0; index < docBtnEventArray.length; index++) {
            const eleItem = docBtnEventArray[index];
            if(Tools.getTheDocItemForXwHappen(eleItem) == true && UserInfo.selectDocMap.get(eleItem.id) == null)
            {
                resItemArray1.push(eleItem);

            }
        }
       
        //存在某个事件一定不发生
        let resItemArray2 = [];
        for (let index = 0; index < resItemArray1.length; index++) {
            const eleItem = resItemArray1[index];
            if(eleItem.existNoHappen != "")
            {
                let idArray = eleItem.existNoHappen.split(",");
                let tmpFag = true;
                for (let i = 0; i < idArray.length; i++) {
                    const id =  idArray[i];
                    if(UserInfo.selectDocMap.get(id) != null)
                    {
                        tmpFag = false;
                        break;
                    }
                }   
                if (tmpFag == true) {
                    resItemArray2.push(eleItem)
                }
            }else{
                resItemArray2.push(eleItem)
            }
        }

        let rand = ConfigMgr.getRandomNum(0,resItemArray2.length-1);
        let popChoseDocItemData = resItemArray2[rand];

        return  popChoseDocItemData;

    }

    popActionEventLayout(docItemData)//弹出行为事件
    {
       
        let actionEventData = ConfigMgr.actionEventMap.get(docItemData.typEvent);
       
        let popLayoutNode = cc.instantiate(this.popLayer);
        popLayoutNode.active = true;
        popLayoutNode.parent = this.node;
     
        let nodeScript = popLayoutNode.getComponent("popLayout");
        if(nodeScript)
        {
            nodeScript.onSetActionData(actionEventData,this);
        }
    }

    onShowActionItem(popChoseDocItemData)
    {
      
        UserInfo.selectDocMap.set(popChoseDocItemData.id,popChoseDocItemData);
       
        let mcellData:CellData = {
            type:3,
            itemName:"lifeitem3",
            itemScriptName:"lifeItem3",
            itemNode:this.lifeitem3,
            age: UserInfo.age,
            content:popChoseDocItemData.desc,
            height:63,
            dieStr:"",
            docItem:popChoseDocItemData,
            anyData:popChoseDocItemData,//特殊附带信息
        }
        
        this.tableDataArray.push(mcellData);
        this.mTableView.reloadData(this.tableDataArray,true);
        this.mTableView.scrollToBottom();

    }
    onClickEventLayout(buttonEventKey,actionData)//点击行为事件后的判断
    {
        let popChoseDocItemData = this.getButtonKeyEventByDoc(buttonEventKey);
        if (popChoseDocItemData == null) {
            return;
        }
        
        if(buttonEventKey.indexOf("anniu1") != -1 )///拒绝了，用3的
        {   
            
            let popChoseDocItemData = this.getButtonKeyEventByDoc(buttonEventKey);
            this.onShowActionItem(popChoseDocItemData)
         
        }else{//接受了,在弹出个窗口

            let popLayoutNode = cc.instantiate(this.showTimeLayer);
            popLayoutNode.active = true;
            popLayoutNode.parent = this.node;
         
            let nodeScript = popLayoutNode.getComponent("showTimeLayout");
            if(nodeScript)
            {
                nodeScript.onSetActionData(actionData,this,popChoseDocItemData);
            }
        }
        UserInfo.selectDocMap.set(popChoseDocItemData.id,popChoseDocItemData);

    }

    onOpenActionEndCall(actData,dcdata)
    {   

        let docItemData =  dcdata;
        let isDie =  Tools.getIsDieForDocItem(docItemData);//根据ITEM判断是否会死亡

        if(isDie == true)
        {
            this.setShowItem2(docItemData)//显示死亡
            this.onForDieShowBtn()//死了后的按钮表现
        }

     
        if(parseInt(actData.contact) ==  parseInt(docItemData.id))//存在某个事件必触发奖励
        {
            
            // this.onShowActionItem(docItemData);//下拉文本
            let rewardID1 = Tools.getActionRewardID(actData.randReward1);
            let rewardID2 = Tools.getActionRewardID(actData.randReward2);
            let rewardID3 = Tools.getActionRewardID(actData.randReward3);
            let artyifactData1 = ConfigMgr.artifactMap.get(rewardID1);
            let artyifactData2 = ConfigMgr.artifactMap.get(rewardID2);
            let artyifactData3 = ConfigMgr.artifactMap.get(rewardID3);
            this.setShowItem7(docItemData,artyifactData1,artyifactData2,artyifactData3);
        }
       

    }


    // update (dt) {}
}
