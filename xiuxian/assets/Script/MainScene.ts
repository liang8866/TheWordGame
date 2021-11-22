// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    @property(cc.Node)
    rootNode:cc.Node = null;//主节点

    @property(cc.Node)
    startLayout:cc.Node = null;

    @property(cc.Node)
    TalentLayout:cc.Node = null;

    
    @property(cc.Node)
    createAttrLayoutNode:cc.Node = null;

    @property(cc.Node)
    mainlandLayoutNode:cc.Node = null;

    @property(cc.Node)
    myliefLayoutNode:cc.Node = null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad(){
        ConfigMgr.initAllConfigJson();
        this.startLayout.active = true;
        this.TalentLayout.active = false;
        this.createAttrLayoutNode.active = false;
        this.mainlandLayoutNode.active = false;
        this.myliefLayoutNode.active = true;

        cc.game.setFrameRate(60);
    }

    start () {
        UserInfo.rootNode  = this.rootNode;
        UserInfo.startLayoutNode = this.startLayout;
        UserInfo.TalentLayoutNode = this.TalentLayout;
        UserInfo.createAttrLayoutNode = this.createAttrLayoutNode;
        UserInfo.mainLandLayoutNode = this.mainlandLayoutNode;
        UserInfo.mylifeLayoutNode = this.myliefLayoutNode;
                // cc.log(ConfigMgr.docMap);
        // cc.log(ConfigMgr.talentMap);
    }

    // update (dt) {}
}
