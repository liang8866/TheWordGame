// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainLandLayout extends cc.Component {

  
    @property(cc.Node)
    itemNode0: cc.Node = null;
    @property(cc.Node)
    itemNode1: cc.Node = null;
    @property(cc.Node)
    itemNode2: cc.Node = null;
    @property(cc.Node)
    itemNode3: cc.Node = null;
    @property(cc.Node)
    itemNode4: cc.Node = null;
    @property(cc.Node)
    itemNode5: cc.Node = null;
    @property(cc.Node)
    itemNode6: cc.Node = null;
    @property(cc.Node)
    itemNode7: cc.Node = null;

    @property(cc.Node)
    itemNode11: cc.Node = null;
    @property(cc.Node)
    itemNode21: cc.Node = null;

    itemsNodeArray:any = [];

    m_count = -1;
    m_indx = 0;
   
    m_landData =null;
    m_wordsArry = null;
   

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //  this.comDoCallBack();
      
    }

    comDoCallBack(){

        var delayAct0 = cc.delayTime(0.3);
        var self = this;
        var action = cc.sequence(delayAct0,cc.callFunc(function(){
            if (self.onShowLand) {
                self.onShowLand();
            }
            },self)
        );

        this.node.runAction(action)
    
    };
    onShowLand()
    {   
        this.node.active = true;
        for (let index = 0; index < ConfigMgr.mainLandArray.length; index++) {
            const element = ConfigMgr.mainLandArray[index];
            let pngName:string  =element.img;
            let arr = pngName.split('.');
            let mainlandNode:cc.Node = Tools.findNode(this.node,arr[0]);
            mainlandNode.active = false;
        }
        // cc.log(ConfigMgr.mainLandArray.length);
        // cc.log(ConfigMgr.mainLandArray);
        let landDataIdx = ConfigMgr.getRandomNum(0,ConfigMgr.mainLandArray.length-1);
       
        let landData = ConfigMgr.mainLandArray[landDataIdx];
      
        this.m_landData = landData;
        let wordsArry = [];
        wordsArry.push("随着一声啼哭，你轮回降生在");
        wordsArry.push(landData.name);
        wordsArry.push("正在生成势力"+ Tools.getStringRand(landData.shili)+"个...");
        wordsArry.push("正在生成地图"+ Tools.getStringRand(landData.map)+"个...");
        wordsArry.push("正在生成奇遇事件"+ Tools.getStringRand(landData.adventure)+"个...");
        wordsArry.push("正在生成宝物"+ Tools.getStringRand(landData.treasure)+"个...");
        wordsArry.push("正在生成功法"+ Tools.getStringRand(landData.skill)+"个...");
        wordsArry.push("正在生成NPC角色......");
        wordsArry.push("人物关系网生成完毕");
        wordsArry.push("正在进入游戏....");
        this.m_wordsArry = wordsArry;
        if(this.itemsNodeArray.length <= 0)
        {
            this.itemsNodeArray.push(this.itemNode11);
            this.itemsNodeArray.push(this.itemNode21);
            this.itemsNodeArray.push(this.itemNode0);
            this.itemsNodeArray.push(this.itemNode1);
            this.itemsNodeArray.push(this.itemNode2);
            this.itemsNodeArray.push(this.itemNode3);
            this.itemsNodeArray.push(this.itemNode4);
            this.itemsNodeArray.push(this.itemNode5);
            this.itemsNodeArray.push(this.itemNode6);
            this.itemsNodeArray.push(this.itemNode7);
            for (let index = 0; index <10; index++) {
                this.itemsNodeArray[index].active = false;
            
            }
        }
        
      
        this.showConetntCallBack(this);

    }

   showConetntCallBack(self) {
      
        self.m_count++;
        //cc.log("------->>>>>>>",self.m_count,self.itemsNodeArray.length);
        if(self.m_count > self.itemsNodeArray.length )
        {
            cc.log("进入下一页面");
            this.node.active = false;
            UserInfo.mylifeLayoutNode.active = true;
            this.node.active = false;
            let attrScript =   UserInfo.mylifeLayoutNode.getComponent("mylifeLayout");
            attrScript.onBeginShow();
        }
        else{
            if(self.m_count == 2)
            {   
            //   cc.log("self.m_landData.img = ",self.m_landData.img);
                let pngName:string  = self.m_landData.img;
                let arr = pngName.split('.');
                let mainlandNode:cc.Node = Tools.findNode(self.node,arr[0]);
                mainlandNode.active = true;
                self.showConetntCallBack(self);
                // cc.loader.loadRes("Texture/"+self.m_landData.img, cc.SpriteFrame, function (err, spriteFrame) {
                //         cc.log(spriteFrame);
                //         self.mainlandSpriteNode.active = true;
                //         self.mainlandSpriteNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                //         self.showConetntCallBack(self);
                //     });

            }else{
                let node:cc.Node = self.itemsNodeArray[self.m_indx];
                node.active = true;
                let attrScript =  node.getComponent("MainLandItem");
                attrScript.onShowContent(self.m_wordsArry[self.m_indx],self.showConetntCallBack,self);
                self.m_indx++;
            }
            
        }

    }


    // update (dt) {}
}
