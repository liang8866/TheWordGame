//工具类

let Tools = new class { 
    

    parseStrIntArr(str:string, del:string) {
        let strs:Array<any> = str.split(del);
        for(var i = 0; i < strs.length; i++) {
            strs[i] = parseInt(strs[i]);
        }

        return strs;
    };
    format2Num(num:any){
        if(num >= 10) {
            return "" + num;
        }else {
            return "0" + num;
        }
    };
    getQualityColor (quality:any) {
        let color:any = cc.color(255, 255, 255);
        if(quality == 1) {
            color = cc.color(255, 255, 255);
        }else if(quality == 2) {
            color = cc.color(0, 255, 0);
        }else if(quality == 3) {
            color = cc.color(0, 0, 255);
        }else if(quality == 4) {
            color = cc.color(255, 0, 255);
        }else if(quality == 5) {
            color = cc.color(255, 255, 0);
        }else if(quality == 6) {
            color = cc.color(255, 0, 0);
        }

       return color
   };
 
    findComponent(parentNode, childName, typeOrClassName) {
        if(childName == null) {
            return parentNode.getComponent(typeOrClassName);
        }else {
            var childNode = this.findNode(parentNode, childName);
            if(childNode != null) {
                return childNode.getComponent(typeOrClassName);
            }else {
                cc.error("UIToos findComponent childNode is nil childName = ", childName);
            }
        }
        
    };

    findNode(parentNode, childName) {
        if(childName == null) {
            return parentNode;
        }else {
            for (var i = 0; i < parentNode.children.length; i++) {
                var node = parentNode.children[i];
                if(node._name == childName) {
                    return node;
                }

                //在子节点上寻找
                var node = this.findNode(node, childName);
                if(node != null) {
                    return node;
                }
            }
            //return parentNode.getChildByName(childName);
        }
    };

    findSprite(parentNode:cc.Node, childName:any) {
        return this.findComponent(parentNode, childName, cc.Sprite);
    };

    findButton(parentNode, childName) {
        return this.findComponent(parentNode, childName, cc.Button);
    };

    findLabel(parentNode, childName) {
        return this.findComponent(parentNode, childName, cc.Label);
    };

    findRichText(parentNode, childName) {
        return this.findComponent(parentNode, childName, cc.RichText);
    };

    findLayout(parentNode, childName) {
        return this.findComponent(parentNode, childName, cc.Layout);
    };

    setRichText(para) {
        if (!para.node) return;
        var str = "";
        for (var i = 0; i < para.contents.length; i++)
        {
            str += "<color=" + para.contents[i].color + ">" + para.contents[i].str + "</c>";
        }
        para.node.string = str;
    };
    getAtifactRich(name,q)
    {
        let str = "";
        let quality = parseInt(q);
        if(quality == 1)
        {
            str = "<color=#0fffff>"+name +"</color>";
        }
        else if(quality == 2)
        {
            str = "<color=#00FF00>"+name +"</color>";
        }
        else if(quality == 3)
        {
            str = "<color=#0000FF>"+name +"</color>";
        }
        else if(quality == 4)
        {
            str = "<color=#FF00FF>"+name +"</color>";
        }
        else if(quality == 5)
        {
            str = "<color=#FFFF00>"+name +"</color>";
        }
        else if(quality ==6)
        {
            str = "<color=#FF0000>"+name +"</color>";
        }

        return str+" ";
    }
    getAtifactXwAttr(artiData)
    {
        let nAttr:any = [0,0,0,0,0,0,0];
        if(artiData != null)
        {
           
            if(artiData.wuxing != "")
            {
              
                nAttr[0] =  Tools.getAttrValue(artiData.wuxing);
            }
            if(artiData.tipo != "")
            {
                  
                nAttr[1] = Tools.getAttrValue(artiData.tipo);
            }
            if(artiData.zhenyuan != "")
            {
                  
                nAttr[2] = Tools.getAttrValue(artiData.zhenyuan);
            }
            if(artiData.lingli != "")
            {
                    
                nAttr[3] = Tools.getAttrValue(artiData.lingli);
            }
            if(artiData.xianli != "")
            {
                    
                nAttr[4] = Tools.getAttrValue(artiData.xianli);
            }
            if(artiData.yaoli != "")
            {
                  
                nAttr[5]  = Tools.getAttrValue(artiData.yaoli);
            }
            if(artiData.moli != "")
            {
                   
                nAttr[6]  = Tools.getAttrValue(artiData.moli);
            }
        }

        return nAttr;
    }

    getLifeSexRich(str)
    {
       return "<color=#ffffff>性别：</c><color=#0fffff>"+str +"</color>";
    };
    getLifeLvRich(str)
    {
       return "<color=#ffffff>境界：</c><color=#0fffff>"+str +"</color>";
    };
    getStringRand(str:string)
    {
        let arr = str.split(",");
        let rand = ConfigMgr.getRandomNum(parseInt(arr[0]),parseInt(arr[1]));
        return rand;
    };
    getStrToNum(str)
    {
        if(str == "")
        {
            return 0;
        }
        let val = parseInt(str);
        return val;
    };
    setTalentArrToMyAttr()//累计选择的天赋属性到用户身上
    {
         //     wuxing:number = 0;//悟性
    // tipo:number = 1;//体魄
    // zhenyuan:number = 2;//真元
    // lingli:number = 3;//灵力
    // xianli:number = 4;//仙力
    // yaoli:number = 5;//妖力
    // moli:number = 6;//魔力
    // nianling:number = 7;//年龄
    // xiuwei:number = 8;//修为 = 体魄+真元+悟性+ 灵力+ 仙力 +妖力+ 魔力
        for(let i=0;i<UserInfo.selectTalentArray.length;i++)
        {
            let talentArrItem = UserInfo.selectTalentArray[i];
            UserInfo.attrNumList[UserInfo.wuxing] = this.getStrToNum(talentArrItem.wuxing);
            UserInfo.attrNumList[UserInfo.tipo] = this.getStrToNum(talentArrItem.tipo);
            UserInfo.attrNumList[UserInfo.zhenyuan] = this.getStrToNum(talentArrItem.zhenyuan);
            UserInfo.attrNumList[UserInfo.lingli] = this.getStrToNum(talentArrItem.lingli);
            UserInfo.attrNumList[UserInfo.xianli] = this.getStrToNum(talentArrItem.xianli);
            UserInfo.attrNumList[UserInfo.yaoli] = this.getStrToNum(talentArrItem.yaoli);
            UserInfo.attrNumList[UserInfo.moli] = this.getStrToNum(talentArrItem.moli);

        }
    }
  
    getSelectTalentMutexToMap()//获取选择的天赋里面的互斥事件
    {
        let MutexMap = new Map();
        for(let i=0;i<UserInfo.selectTalentArray.length;i++)
        {
            let talentArrItem = UserInfo.selectTalentArray[i];
            let mutexStr = talentArrItem.mutex+"";//转成字符串，
            let mutexArr = mutexStr.split(',');//分割
            for (let index = 0; index < mutexArr.length; index++) {
                const element = mutexArr[index];
                MutexMap.set(element,element);
            }
        }
        return MutexMap;
    }
    //是否这个doc已经有了
    getIsHaveDoc(docItem)
    {
        let fag = false;
        if(UserInfo.selectDocMap.get(docItem.id) != null)
        {
                
            fag = true;//存在不可用
             
        }
        return fag;

    }
    getDocItemExistNoHappen(docItem)//获取对应doc文案中存在必定不会发生的事件
    {
        let docExistNoHappenStr = docItem.existNoHappen+"";//转成字符串，
        let tmpArr = docExistNoHappenStr.split(',');//分割
        let tmpMap = new Map()
        for (let index = 0; index < tmpArr.length; index++) {
            const element = tmpArr[index];
            tmpMap.set(element,element);
        }
        return tmpMap;
    }
    getRandDocIsInSelectTalentMutexMap(docItem)//我随机到的文案在我的选择的天赋池里面是否有互斥
    {
        let fag = false;//不存在，可用
        let docExistNoHappenStr = docItem.existNoHappen+"";//转成字符串，
        let tmpArr = docExistNoHappenStr.split(',');//分割
      
        for (let index = 0; index < tmpArr.length; index++) {
            const element = tmpArr[index];
            if(UserInfo.selectTalentMutexMap.get(element) != null)
            {
                
                fag = true;//存在，不可用
                break;
            }
        }
        return fag;

    }
    //修为存在事件，如何有字符串：分析下我的已经选择的文案事件里面有没有，如果没有的话就不能用  
    //如果是空字符串，就是随时可用
    getRandDocIsXwEventProbability(docItem)//
    {
        let fag = false;//不存在
        let XwEventProbabilityStr = docItem.xwEventProbability+"";//转成字符串，
        if(XwEventProbabilityStr == "")
        {
            return true;//表示没限制，可以用
        }
        let tmpArr = XwEventProbabilityStr.split(',');//分割
        for (let index = 0; index < tmpArr.length; index++) {
            const element = tmpArr[index];
            if(UserInfo.selectDocMap.get(element) != null)
            {
                
                fag = true;//存在，可用
                break;
            }
        }
        return fag;
    }

    getIsDieForDocItem(docItem)//根据ITEM判断是否会死亡
    {
        let isDie = false;
        if(docItem.die !=""|| parseInt(docItem.die) != 0)
        {
            let ratioNum = parseInt(docItem.die);//
            let rand = ConfigMgr.getRandomNum(0,100);
            cc.log("------>>> die rand=",rand,"ratioNum=",ratioNum);
            if(rand <=ratioNum)//随机到了
            {   
                isDie =true;
            }
        }
        return isDie;
    }

    getTheDocItemForXwHappen(docItem)
    {
        let  xwHappenStr:string = docItem.xwHappen;
        
        return this.getTheContion1(xwHappenStr,UserInfo.selectDocMap);

    }


    getTheContion1(constr,selectMap)
    {
        let  orgStr:string = constr;
        if(orgStr.length<=0)
        {
            return true;
        }
        let xwStr = "";
        let idStr = "";
        if(orgStr.indexOf("&") != -1)
        {
            let orgArr = orgStr.split("&");
            if (orgArr.length >0) {
                idStr = orgArr[0];
            }
            if (orgArr.length >1) {
                xwStr = orgArr[0];
            }
        }else{//单一的
            if(orgStr.indexOf(":") != -1)//说明是有修为啊，年龄这种
            {
                xwStr = orgStr;
            }else{ 
                idStr = orgStr;
            }
        }
        let idArray  = idStr.split(",");
        let fag1 = false;
        for (let index = 0; index < idArray.length; index++) {
            const element = idArray[index];
            if (selectMap.get(element) != null) {
                return false;
            }
        }

        let tmpArr = xwStr.split(':');//分割
        let arr = tmpArr[1].split(",");
        let num1:number = null;
        let num2:number = null;
        if(arr.length>0)
        {
            num1 = parseInt(arr[0]);
        }
        if(arr.length>1)
        {
            num2 = parseInt(arr[1]);
        }
        let keyNum = 0;
        if(xwStr.indexOf("wuxing") != -1)
        {
            keyNum = UserInfo.attrNumList[0];
        }
        else if(xwStr.indexOf("tipo") != -1 )
        {
            keyNum = UserInfo.attrNumList[1];
        }
        else if(xwStr.indexOf("zhenyuan") != -1 )
        {
            keyNum = UserInfo.attrNumList[2];
        }
        else if(xwStr.indexOf("lingli") != -1 )
        {
            keyNum = UserInfo.attrNumList[3];
        }
        else if(xwStr.indexOf("xianli") != -1 )
        {
            keyNum = UserInfo.attrNumList[4];
        }
        else if(xwStr.indexOf("yaoli") != -1 )
        {
            keyNum = UserInfo.attrNumList[5];
        }
        else if(xwStr.indexOf("moli") != -1 )
        {
            keyNum = UserInfo.attrNumList[6];
        }
        else if(xwStr.indexOf("nianling") != -1 )
        {
            keyNum = UserInfo.age;
        }
        else if(xwStr.indexOf("xiuwei") != -1 )
        {
            keyNum = UserInfo.getXiuWei();
        }
        if(num1 != null && num2 != null)
        {
            return keyNum>=num1&&keyNum<=num2 ?true:false;
        } 
        else if(num1 != null && num2 == null)
        {
            return keyNum>=num1 ?true:false;
        }

        return true;
    }

    getTheContion2(constr,selectMap)
    {
        let  orgStr = constr + "";
        cc.log("orgStr  ",orgStr)
        if(orgStr.length<=0)
        {
            return true;
        }
        let xwStr = "";
        let idStr = "";
        if(orgStr.indexOf("&") != -1)
        {
            let orgArr = orgStr.split("&");
            if (orgArr.length >0) {
                idStr = orgArr[0];
            }
            if (orgArr.length >1) {
                xwStr = orgArr[0];
            }
        }else{//单一的
            if(orgStr.indexOf(":") != -1)//说明是有修为啊，年龄这种
            {
                xwStr = orgStr;
            }else{ 
                idStr = orgStr;
            }
        }
        let idArray  = idStr.split(",");
        let fag1 = true;
        if (idArray.length<= 0) {
            fag1 = true;
        }else{
            fag1 = false;
        }

        for (let index = 0; index < idArray.length; index++) {
            const element = idArray[index];
            if (selectMap.get(element) != null) {
                fag1 = true;
            }
        }

        let tmpArr = xwStr.split(':');//分割
        let arr = tmpArr[1].split(",");
        let num1:number = null;
        let num2:number = null;
        if(arr.length>0)
        {
            num1 = parseInt(arr[0]);
        }
        if(arr.length>1)
        {
            num2 = parseInt(arr[1]);
        }
        let keyNum = 0;
        if(xwStr.indexOf("wuxing") != -1)
        {
            keyNum = UserInfo.attrNumList[0];
        }
        else if(xwStr.indexOf("tipo") != -1 )
        {
            keyNum = UserInfo.attrNumList[1];
        }
        else if(xwStr.indexOf("zhenyuan") != -1 )
        {
            keyNum = UserInfo.attrNumList[2];
        }
        else if(xwStr.indexOf("lingli") != -1 )
        {
            keyNum = UserInfo.attrNumList[3];
        }
        else if(xwStr.indexOf("xianli") != -1 )
        {
            keyNum = UserInfo.attrNumList[4];
        }
        else if(xwStr.indexOf("yaoli") != -1 )
        {
            keyNum = UserInfo.attrNumList[5];
        }
        else if(xwStr.indexOf("moli") != -1 )
        {
            keyNum = UserInfo.attrNumList[6];
        }
        else if(xwStr.indexOf("nianling") != -1 )
        {
            keyNum = UserInfo.age;
        }
        else if(xwStr.indexOf("xiuwei") != -1 )
        {
            keyNum = UserInfo.getXiuWei();
        }
        let fag2 = false;
        if(num1 != null && num2 != null)
        {
            fag2 =  keyNum>=num1&&keyNum<=num2 ?true:false;
        } 
        else if(num1 != null && num2 == null)
        {
            fag2 = keyNum>=num1 ?true:false;
        }

        return fag1&&fag2;
    }

    getAttrValue(str)
    {
        if(str == "")
        {
            return 0;
        }
        // if(str.indexOf("-") != -1 )//说明是负数
        // {
        //    return parseInt(str)*-1;
        // }
        return parseInt(str);
    }

    getActionRewardID(rewardStr)
    {
        let rewardid = null;
        if(rewardStr.length < 1)
        {
            return rewardid
        }
        let tmpArr = rewardStr.split('|');//分割
        let id =  parseInt(tmpArr[0]);
        let ration = parseInt(tmpArr[1]);
        let rand = ConfigMgr.getRandomNum(0,100)
        if(rand<= ration)
        {
            rewardid  = id;
        }
        return rewardid
    }
};
window["Tools"] = Tools;