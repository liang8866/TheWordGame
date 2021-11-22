// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class AttrNode extends cc.Component {

    @property(cc.Label)
    namelabel: cc.Label = null;

    @property(cc.Label)
    attrlabel: cc.Label = null;

    @property(cc.Button)
    comfirmBtn: cc.Button = null;
    attNum:number = 0;
    isUpdate:boolean = true;
    countTime:number=0;
    indx:number = -1;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.isUpdate = true;
        this.countTime = 0;
    }
    onRestShow(nameStr:string,midx:number)
    {
        this.isUpdate = true;
        this.countTime = 0;
        this.namelabel.string = nameStr+":";
        this.comfirmBtn.interactable = true;
        this.attNum = 0;
        this.indx = midx;
    }
    onResetBtn()
    {
        this.comfirmBtn.interactable = true;
        this.isUpdate = true;
        this.attNum = 0;
    }
    getAttrNum()
    {
        return this.attNum;
    }
    
    onClickComfirm()
    {
        this.isUpdate = false;
        this.comfirmBtn.interactable = false;
        this.attNum = Number(this.attrlabel.string);
        // UserInfo.attrNumList.push(this.attNum);
        UserInfo.countAttrNum ++;
        if( UserInfo.countAttrNum >=7)
        {
            let script =   UserInfo.createAttrLayoutNode.getComponent("createAttrLayout");
            script.setStartBtnShow(true);
        }
    }
     update (dt) {
        if(this.isUpdate == true)
        {
            if(this.countTime >0.1)
            {
                this.countTime = 0;
                let num = ConfigMgr.getRandomNum(1,20);
                
                this.attrlabel.string =  num+"";
                
            }else{
                this.countTime +=dt;
            }
        }

     }
}
