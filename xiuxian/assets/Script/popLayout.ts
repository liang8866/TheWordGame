

const {ccclass, property} = cc._decorator;

@ccclass
export default class popLayout extends cc.Component {

    @property(cc.Label)
    mlabel: cc.Label = null;

    @property(cc.Node)
    btnNode1: cc.Node = null;
    @property(cc.Node)
    btnNode2: cc.Node = null;

    @property(cc.Label)
    mbtnlabel1: cc.Label = null;
    @property(cc.Label)
    mbtnlabel2: cc.Label = null;

    mDocItemData:any = null;
    mRandEventData:any = null;
    callback:any = null;
    mSelf:any = null;

    mCallAction:any = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        
    }
    onSetCellData(docItemData,parentself)
    {
     
        this.mSelf = parentself;
        this.mDocItemData = docItemData;
        let randEventData = ConfigMgr.randEventMap.get(Number(docItemData.typEvent));
      
        this.mRandEventData = randEventData;
        this.mlabel.string = randEventData.randEven;
        this.mbtnlabel1.string = randEventData.anniu1;
        this.mbtnlabel2.string = randEventData.anniu2;

        //this.mlabel.string = docItemData.
    }

    onSetActionData(actData,pself)
    {
        // cc.log("------>>>>>.....",actData);
        this.mDocItemData = actData;
        this.mCallAction = pself;
        this.mlabel.string = actData.actionEventDesc;
        this.mbtnlabel1.string = actData.anniu1;
        this.mbtnlabel2.string = actData.anniu2;
    }
    onClickBtn1()
    {
        // cc.log("----anniu1---")
        if(  this.mSelf)
        {
            this.mSelf.onClickPopLayout( this.mRandEventData.id+"&anniu1",this.mDocItemData);
        }
        if(this.mCallAction)
        {
            this.mCallAction.onClickEventLayout(this.mDocItemData.id+"&anniu1",this.mDocItemData);
        }
       
        this.node.destroy();
       
    
    };
    onClickBtn2()
    {
        // cc.log("----anniu2---")
        if(  this.mSelf)
        {
            this.mSelf.onClickPopLayout(this.mRandEventData.id+"&anniu2",this.mDocItemData);
        }
        if(this.mCallAction)
        {
            this.mCallAction.onClickEventLayout(this.mDocItemData.id+"&anniu2",this.mDocItemData);
        }
    
        this.node.destroy();
      
    }



    // update (dt) {}
}
