// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainLandItem extends cc.Component {

    @property(cc.Label)
    mlabel: cc.Label = null;

 
    contentStr:string = "";
    isUpdate:boolean = false;
    count:number = 0;
    // LIFE-CYCLE CALLBACKS:
    m_callBack:any = null;
    pSlef:any = null;
    countTime:number = 0;
    // onLoad () {}

    start () {
        // this.mlabel.string = "";
        // this.contentStr = "";
        // this.isUpdate = false;
    }
    onShowContent(str:string,callback,nself)
    {
        this.mlabel.string = "";
        this.contentStr = str;
        this.isUpdate = true;
        this.count = 0;
        this.countTime = 0;
        this.m_callBack = callback;
        this.pSlef = nself;
        this.node.active = true;
        cc.log(this.contentStr,this.isUpdate,this.m_callBack);
    }
    update (dt) {
        if(this.isUpdate == true)
        {
            if( this.countTime>0.033)
            {
                this.countTime = 0;
                if(this.count <= this.contentStr.length)
                {   
                     //cc.log("------>>>>  this.count=", this.count);
                    this.mlabel.string = this.contentStr.slice(0,this.count);
                    this.count +=1;
                }else{
                    this.isUpdate = false;//暂停
                    this.mlabel.string = this.contentStr;
                    if( this.m_callBack)
                    {
                        this.m_callBack( this.pSlef);
                    }
                }
            }else{
                this.countTime += dt;
                // cc.log(this.countTime)
            }

        }

    }
}
