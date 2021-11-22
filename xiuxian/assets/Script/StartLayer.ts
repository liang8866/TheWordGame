

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartLayer extends cc.Component {

    @property(cc.Label)
    Titlelabel: cc.Label = null;

    @property(cc.Label)
    subTitlelabel: cc.Label = null;

    @property(cc.Node)
    midBgNode:cc.Node = null;

    @property(cc.Node)
    progressNode:cc.Node = null;

    @property(cc.Node)
    startBtnNode:cc.Node = null;


    @property(cc.Node)
    loading1:cc.Node = null;

    @property(cc.Node)
    loading2:cc.Node = null;

    @property(cc.ProgressBar)
    progessBar:cc.ProgressBar = null;
    // LIFE-CYCLE CALLBACKS:
    
    
    isUpdate = false;
  
    progressTtpe = 0;
    proDt = 0;
    // onLoad () {}

    start () {
        this.onRestLayout();
    }
    //重设
    onRestLayout(){
        this.progressNode.active = false;
        this.loading1.active = false;
        this.loading2.active = false;
        this.isUpdate = false;
     
        this.progressTtpe = 0;//正在加载中
        this.progessBar.progress = 0;
        this.startBtnNode.getComponent(cc.Button).interactable = true;
        this.proDt = 0.00666;
    }
    onClickStart(){
        this.startBtnNode.getComponent(cc.Button).interactable = false;
        this.progressNode.active = true;
        this.loading1.active = true;
        this.isUpdate = true;
        this.proDt = 0.1;
 
        this.progressTtpe = 0;//正在加载中
    }
     update (dt) {
        if(this.isUpdate)
        {
            if(this.progessBar.progress<1.0)
            {
              
                this.progessBar.progress += this.proDt;//正在加载中
            }else 
            {
                if( this.progressTtpe == 0)
                {
                  
                    this.progressTtpe = 1;//加载完成
                    this.loading1.active = false;
                    this.loading2.active = true;
                }else{
                    UserInfo.startLayoutNode.active = false;
                    UserInfo.TalentLayoutNode.active = true;
                    this.isUpdate = false;
                    let TalentLayoutNodeScript =  UserInfo.TalentLayoutNode.getComponent("TalentLayout");
                    TalentLayoutNodeScript.onStartGetData();
                }
               
            }

        }

     }
}
