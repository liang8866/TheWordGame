// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { CellData } from "./CellData";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    mLabel: cc.Label = null;

    @property(cc.Node)
    myRichTextNode1: cc.Node = null;

    @property(cc.Node)
    myRichTextNode2: cc.Node = null;

    @property(cc.Node)
    myRichTextNode3: cc.Node = null;

    @property(cc.Node)
    myRichTextNode4: cc.Node = null;

    @property(cc.Node)
    myRichTextNode5: cc.Node = null;

    @property(cc.Node)
    myRichTextNode6: cc.Node = null;

    @property(cc.Node)
    myRichTextNode7: cc.Node = null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    getRichText(name,valStr)
    {
        let sStr  = valStr;
        if(valStr.indexOf("-") == -1)//说明是正数
        {
            sStr = "+"+valStr;
        }
        return" <color=#ffffff>"+ name + "  </c><color=#0fffff> " + sStr +"</color>";
    }
    onSetCellData(cellData:CellData)
    {
        
       
        this.mLabel.string = cellData.content;
        let docItemData = cellData.docItem;
        this.myRichTextNode1.active = false;
        this.myRichTextNode2.active = false;
        this.myRichTextNode3.active = false;
        this.myRichTextNode4.active = false;
        this.myRichTextNode5.active = false;
        this.myRichTextNode6.active = false;
        this.myRichTextNode7.active = false;

        // attrNameTable =  ["悟性","体魄","真元","灵力","仙力","妖力","魔力"];
        // attrNumList:any = [10,11,12,13,14,15,16];//分别存储"悟性","体魄","真元","灵力","仙力","妖力","魔龙"，年龄，修为的值
        let count = 0;
       if(docItemData.wuxing != "")
       {
            count++;
            this.myRichTextNode1.active = true;
            this.myRichTextNode1.getComponent(cc.RichText).string = this.getRichText("悟性",docItemData.wuxing);
       }
       if(docItemData.tipo != "")
       {
            count++;
            this.myRichTextNode2.active = true;
            this.myRichTextNode2.getComponent(cc.RichText).string = this.getRichText("体魄",docItemData.tipo);
       }
       if(docItemData.zhenyuan != "")
       {
            count++;
            this.myRichTextNode3.active = true;
            this.myRichTextNode3.getComponent(cc.RichText).string = this.getRichText("真元",docItemData.zhenyuan);
       }
       if(docItemData.lingli != "")
       {
            count++;
            this.myRichTextNode4.active = true;
            this.myRichTextNode4.getComponent(cc.RichText).string = this.getRichText("灵力",docItemData.lingli);
       }
       if(docItemData.xianli != "")
       {
            count++;
            this.myRichTextNode5.active = true;
            this.myRichTextNode5.getComponent(cc.RichText).string = this.getRichText("仙力",docItemData.xianli);
       }
       if(docItemData.yaoli != "")
       {
            count++;
            this.myRichTextNode6.active = true;
            this.myRichTextNode6.getComponent(cc.RichText).string = this.getRichText("妖力",docItemData.yaoli);
       }
       if(docItemData.moli != "")
       {
            count++;
            this.myRichTextNode7.active = true;
            this.myRichTextNode7.getComponent(cc.RichText).string = this.getRichText("魔力",docItemData.moli);
       }
    }
    

    // update (dt) {}
}
