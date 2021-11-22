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
    mLabel1: cc.Label = null;
    @property(cc.Label)
    mLabel2: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    onSetCellData(cellData:CellData)
    {
      
        this.ageLabel.string = cellData.age +"岁";
        this.mLabel1.string = cellData.content;
        this.mLabel2.string = "("+cellData.anyData +")";
    }

    // update (dt) {}
}
