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
    btnNode1: cc.Node = null;

    @property(cc.Node)
    btnNode2: cc.Node = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.Label)
    mbtnlabel1: cc.Label = null;
    @property(cc.Label)
    mbtnlabel2: cc.Label = null;

    m_cellData:CellData =null;
    m_selfScript:any = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    onSetCellData(cellData:CellData)
    {
      
        this.m_cellData = cellData;
        if (cellData.anyData == "") {
            this.btnNode1.active = true;
            this.btnNode2.active = true;
            this.descLabel.string = "";
            this.mLabel.string= "触发奇遇："+ cellData.content;
            this.mbtnlabel1.string = cellData.docItem.anniu1;
            this.mbtnlabel2.string = cellData.docItem.anniu2;
        }
        else{
            this.btnNode1.active = false;
            this.btnNode2.active = false;
            this.descLabel.string = cellData.anyData;
            this.mLabel.string= "触发奇遇："+ cellData.content;
            
        }
       
    }
    
    setSelfScript(sc:any)
    {
        this.m_selfScript = sc;
    }
    
    onClickBtn1()
    {
        this.btnNode1.active = false;
        this.btnNode2.active = false;
        let str = "(你"+this.m_cellData.docItem.anniu1+"了)";
        this.descLabel.string = str;
        if(this.m_selfScript)
        {
            this.m_selfScript.onClickItem5CallBack(this.m_cellData.docItem.id+"&anniu1",str);
        }
        
    }

    onClickBtn2()
    {
        this.btnNode1.active = false;
        this.btnNode2.active = false;
        let str =  "(你"+this.m_cellData.docItem.anniu2+"了)";
        this.descLabel.string = str;
        if(this.m_selfScript)
        {
            this.m_selfScript.onClickItem5CallBack(this.m_cellData.docItem.id+"&anniu2",str);
        }
    }

    // update (dt) {}
}
