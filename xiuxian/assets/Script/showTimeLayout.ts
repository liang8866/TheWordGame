
import AcFuncEx  from "./AcFuncEx";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    mlabel: cc.Label = null;
    @property(cc.Label)
    timelabel: cc.Label = null;
    @property(cc.Label)
    desclabel: cc.Label = null;
    
    mActionSelf:any = null;
    actionData:any = null;

    isUpDate:boolean = false;
    
    totalTime:number = 0;

    countTime:number = 0;

    leftTieme:number = 0;

    docItemData:any = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    onSetActionData(actData,pSelf,dcdata)
    {
        cc.log("--->>>showtimelayout",actData);
        this.docItemData = dcdata;
        this.actionData = actData;
        this.mActionSelf = pSelf;
        this.isUpDate = true
        this.mlabel.string = actData.tip;
        this.totalTime = parseInt(actData.time)
        this.countTime = 0;
    }
    
    onEndForTimeOut()
    {
        this.timelabel.string = "00:00:00"
        this.isUpDate = false;
        this.desclabel.string = "(点击进行下一步)"

    }
    onClickNext()//点击下一步
    {
       if(this.isUpDate == true)
       {
           return;
       }
        if(this.mActionSelf)
        {
            this.mActionSelf.onOpenActionEndCall(this.actionData, this.docItemData);
        }
        this.node.destroy();//销毁

    }

     update (dt) {
        if( this.isUpDate)
        {
            this.countTime += dt;
            if(this.countTime <this.totalTime)
            {
                this.timelabel.string = AcFuncEx.convertSecPad(this.totalTime-this.countTime);
            }
            else{
                this.onEndForTimeOut();
            }

        }

     }
}
