// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class createAttrLayout extends cc.Component {

    @property(cc.Node)
    startBtnNode: cc.Node = null;

    @property(cc.Node)
    ItemNode: cc.Node = null;

    itemNodeArr:any = [];//
  
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        UserInfo.countAttrNum = 0;
    }
    getStartBtn()
    {
        UserInfo.countAttrNum = 0;
        return this.startBtnNode;
    }
    setStartBtnShow(b:boolean)
    {
        this.startBtnNode.active = b;
    }
    onShowItems()
    {
        
        this.startBtnNode.active = false;
        if(this.itemNodeArr.length <= 0)
        {
            for (let index = 0; index < UserInfo.attrNameTable.length; index++) {
                const element =  UserInfo.attrNameTable[index];
                var clone=cc.instantiate(this.ItemNode);
                clone.active = true;
                this.node.addChild(clone);
                this.itemNodeArr.push(clone);
                clone.x = 0;
                clone.y = 323-50*index;
                let attrScript =  clone.getComponent("AttrNode");
                attrScript.onRestShow(element,index);
            }
            
        }
    }
    onClickReset()
    {
        UserInfo.countAttrNum = 0;
        this.startBtnNode.active = false;
        for (let index = 0; index < this.itemNodeArr.length; index++) {
            const element =  this.itemNodeArr[index];
            let attrScript =  element.getComponent("AttrNode");
            attrScript.onResetBtn();
        }
    };
    onClickStart()
    {
       
        for (let index = 0; index < this.itemNodeArr.length; index++) {
            const element =  this.itemNodeArr[index];
            let attrScript =  element.getComponent("AttrNode");
            UserInfo.attrNumList[index] = attrScript.getAttrNum();
        }

        cc.log(UserInfo.attrNumList);
        UserInfo.createAttrLayoutNode.active = false;
        UserInfo.mainLandLayoutNode.active = true;
        let script =   UserInfo.mainLandLayoutNode.getComponent("MainLandLayout");
        script.onShowLand();
    }

    // update (dt) {}
}
