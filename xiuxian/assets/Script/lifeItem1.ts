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
    ageLabel: cc.Label = null;

    @property(cc.Label)
    mLabel: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    onSetCellData(cellData:CellData)
    {
        // cc.log("=========>>>>>>>>>>>>>>>>>")
       
        this.ageLabel.string = cellData.age +"岁";
        this.mLabel.string = cellData.content;
    }

    // update (dt) {}
}
