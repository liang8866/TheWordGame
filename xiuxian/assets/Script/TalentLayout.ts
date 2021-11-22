

const {ccclass, property} = cc._decorator;

@ccclass
export default class TalentLayout extends cc.Component {

    TalentItemNodeArr:any = [];

    @property(cc.Node)
    tipLabelNode:cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // for (let index = 1; index < 9; index++) {
        //     let tn =Tools.findNode(this.node,"TalentItem"+index);
        //     this.TalentItemNodeArr[index] = tn;
        // }
      
    
    }
    showTip(str){
  
        this.tipLabelNode.active = true;
        // this.tipLabelNode.string = str;
        this.tipLabelNode.stopAllActions()
        
        var showCallBack = function(self){
            self.tipLabelNode.active = false;
        }
        this.conShowTipAction( this.tipLabelNode,str,showCallBack,this);
    };
      //显示提示的
    conShowTipAction(labelNode,str,callFunc,self){
        var label =  labelNode.getComponent(cc.Label);
        if (label != null) {
            label.string = str;
        }
        var delayAct0 = cc.fadeIn(0.1);
        var delayAct = cc.delayTime(2.0);
        var fadeAct = cc.fadeOut(1.0);
        var callback0 = function()
        {
            // self.tipLabelBg.active = true;
        }

        var action = cc.sequence(delayAct0,cc.callFunc(callback0),delayAct,fadeAct,cc.callFunc(function(){
            if (callFunc) {
                callFunc(self);
            }
            },self)
        );

        labelNode.runAction(action)
    
    };
    onStartGetData()
    {
        UserInfo.selectTalentArray = [];//选择的天赋
        UserInfo.randTalentMap = ConfigMgr.getRandTalentByNums(8,false);
        // cc.log(UserInfo.randTalentMap);
        this.onResetItems();
    };
    onResetItems(){
  
        let itemsDataArray = [];
        UserInfo.randTalentMap.forEach(function(val,key){
            itemsDataArray.push(val);
        })
        itemsDataArray.sort(function(){
            return Math.random() - 0.5;
        });
        
        // cc.log(itemsDataArray);
       let itemIdx =1;
        for (let index = 0; index < itemsDataArray.length; index++) {
            const item = itemsDataArray[index];
            let tn =Tools.findNode(this.node,"TalentItem"+itemIdx);
            // cc.log(item);
            // cc.log(tn);
            if(tn != null)
            {
                let itemScript = tn.getComponent("TalentItemLayout");
                itemScript.onShowContent(item);
            }
            itemIdx++;
        }
      
       

    }
    onClickReset(){//必得一条红的
        UserInfo.randTalentMap = ConfigMgr.getRandTalentByNums(7,true);
        // cc.log(UserInfo.randTalentMap);
        UserInfo.selectTalentArray = [];
        this.onResetItems();
    };
     onClickStartXiuXian(){
        if( UserInfo.selectTalentArray.length < 3  )
        {
           
            this.showTip("请选择三项天赋");
            return;
        }
        UserInfo.TalentLayoutNode.active = false;
        UserInfo.createAttrLayoutNode.active = true;
        let script =   UserInfo.createAttrLayoutNode.getComponent("createAttrLayout");
        script.onShowItems();
     }
    // update (dt) {}
}
