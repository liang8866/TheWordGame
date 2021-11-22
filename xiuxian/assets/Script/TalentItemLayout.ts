
import AcFuncEx from  "./AcFuncEx"
const {ccclass, property} = cc._decorator;

@ccclass
export default class TalentItemLayout extends cc.Component {

    @property(cc.Node)
    itemBgNode:cc.Node = null;

    @property(cc.Node)
    itemSelectNode:cc.Node = null;

    @property(cc.Label)
    mLabel1: cc.Label = null;

    @property(cc.Label)
    mLabel2: cc.Label = null;
    
    // @property(cc.Node)
    // qualityNode1:cc.Node = null;

    // @property(cc.Node)
    // qualityNode2:cc.Node = null;

    // @property(cc.Node)
    // qualityNode3:cc.Node = null;

    // @property(cc.Node)
    // qualityNode4:cc.Node = null;

    // @property(cc.Node)
    // qualityNode5:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    m_str1:string = "";
    m_str2:string = "";
    m_isSelect:boolean = false;
    m_quality:number = 1;
    itemData = null;
    qualityNodeArr:any = [];
    // onLoad () {}

    start () {
        for (let index = 1; index < 6; index++) {
            let tn =Tools.findNode(this.node,"talent_quality"+index);
            this.qualityNodeArr[index] = tn;
        }
        
    }
    getItemData()
    {
        return this.itemData;
    }
    onShowContent(itdata){
        this.itemData = itdata;
     
        this.mLabel1.string =  this.itemData.talentName;
        this.mLabel2.string =  this.itemData.telentDesc;
        for (let index = 1; index < 6; index++) {
            let tn =Tools.findNode(this.node,"talent_quality"+index);
            tn.active = false;
        }
        let tn =Tools.findNode(this.node,"talent_quality"+this.itemData.quality);
        tn.active = true;
        this.m_isSelect = false;
        this.itemSelectNode.active = this.m_isSelect;
        this.itemBgNode.active = !this.m_isSelect;
    }
    onClickBtn() {
       // cc.log(" on click");
        if( UserInfo.selectTalentArray.length >=3 && this.m_isSelect == false )
        {
            let TalentLayoutNodeScript =  UserInfo.TalentLayoutNode.getComponent("TalentLayout");
            TalentLayoutNodeScript.showTip("最多可选3项");
            return;
        }
            
        this.itemBgNode.active = this.m_isSelect;
        this.m_isSelect = !this.m_isSelect;
        this.itemSelectNode.active = this.m_isSelect;
    
        //cc.log(UserInfo.selectTalentArray);
        if(this.m_isSelect)//如果是选择了，就添加到数组中
        {
            UserInfo.selectTalentArray.push(this.itemData);
        }else{//否则，删除掉
            for (let index = 0; index <  UserInfo.selectTalentArray.length; index++) {
                const element =  UserInfo.selectTalentArray[index];
                if(element.id == this.itemData.id)
                {
                    UserInfo.selectTalentArray.splice(index,1);//
                    break;
                }
            }
        }
        //cc.log(UserInfo.selectTalentArray);

    }
    // update (dt) {}
}
