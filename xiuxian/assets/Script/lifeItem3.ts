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


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    onSetCellData(cellData:CellData)
    {
       

        this.mLabel.string = cellData.content;
    }

    // update (dt) {}
}
