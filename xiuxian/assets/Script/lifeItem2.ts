
import { CellData } from "./CellData";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    ageLabel: cc.Label = null;

    @property(cc.RichText)
    myRichText: cc.RichText = null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    onSetCellData(cellData:CellData)
    {
        
      
        this.ageLabel.string = cellData.age +"岁";
        this.myRichText.string = "<color=#ffffff>"+cellData.content+"</c><color=#ff0000>"+cellData.dieStr +"</color>"; 
    }
    // update (dt) {}
}
