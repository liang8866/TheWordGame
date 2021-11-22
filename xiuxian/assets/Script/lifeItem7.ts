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
    myRichTextNode: cc.Node = null;

     richTextArray:any = [];
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    getRichText(name,val)
    {
        let sStr  = "";
        if(val <0)//说明是负数
        {
            sStr = ""+val;
        }
        else{
            sStr = "+"+val;
        }
        return" <color=#ffffff>"+ name + "  </c><color=#0fffff> " + sStr +"</color>";
    }
    setRichTextNode(str,x,y)
    {
        let  richNode = cc.instantiate(this.myRichTextNode);
        richNode.active = true;
        richNode.parent = this.node;
        richNode.x = x;
        richNode.y = y;
        richNode.getComponent(cc.RichText).string = str;
        return richNode;
    }
    onSetCellData(cellData:CellData)
    {
        this.mLabel.string =  cellData.content;
        for (let index = 0; index < this.richTextArray.length; index++) {
            const element = this.richTextArray[index];
            this.node.removeChild(element);
        }
        this.richTextArray =[];
        let count = 0;
        if(cellData.anyData.mbaowu != "")
        {
            let richNode = this.setRichTextNode(cellData.anyData.mbaowu,-250,-50-count*30);
            this.richTextArray.push(richNode);
            count +=1;
           
        }
        
        if(cellData.anyData.mgongfa != "")
        {
            let richNode = this.setRichTextNode(cellData.anyData.mgongfa,-250,-50-count*30);
            this.richTextArray.push(richNode);
            count +=1;
          
        }
        let attrList= cellData.anyData.mshowAttrList;
        let attrNameTable =  ["悟性","体魄","真元","灵力","仙力","妖力","魔力"];
        for (let index = 0; index < attrList.length; index++) {
            const element = attrList[index];
            if(element != 0)
            {   
                let str = this.getRichText(attrNameTable[index],element)
                let richNode = this.setRichTextNode(str,-250,-50-count*30);
                this.richTextArray.push(richNode);
                count +=1;
              
            }
            
        }


    }
    // update (dt) {}
}
