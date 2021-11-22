
let ConfigMgr = new class { 
    
    ageArray:any = [];
    docMap:any = new Map();// 事件文案                  doc.json
    actionEventMap:any =  new Map();// 行为事件          actionEvent.json
    advMeetingMap:any=  new Map();// 奇遇事件            advMeeting.json
    ageMap:any = new Map();//年龄事件池                 age.json
    artifactMap:any =  new Map();// 神器功法             artifact.json
    fateEventMap:any =  new Map();// 逆天改名事件        fateEvent.json
    mainLandArray:any =  [];//大陆分类              mainLand.json
    randEventMap:any =  new Map();// 随机事件            randEvent.json
    talentMap:any =  new Map();//天赋池                  talent.json

    //相关定义 品质对应值
    TYPE_Q1:number = 1;
    TYPE_Q2:number = 2;
    TYPE_Q3:number = 3;
    TYPE_Q4:number = 4;
    TYPE_Q5:number = 5;
   
    //临时的
    talentQualityData:any = [];///二维数组

    initAllConfigJson()
    {
        this.parseToMap("mainLand.json",this.mainLandArray,false);
        this.parseToMap("doc.json",this.docMap,true);
        this.parseToMap("actionEvent.json", this.actionEventMap,true);
        this.parseToMap("advMeeting.json",this.advMeetingMap,true);
        this.parseToMap("age.json",this.ageArray,false);
        this.parseToMap("artifact.json",this.artifactMap,true);
        this.parseToMap("fateEvent.json", this.fateEventMap,true);
        this.parseToMap("randEvent.json",this.randEventMap,true);
        this.parseToMap("talent.json",this.talentMap,true);
       
    };

    parseToMap(json_name:string,ConfigMap:any,isToMap:boolean)
    {
        let json_url = 'data/' + json_name;
        let Configdata = [];
       
        cc.loader.loadRes(json_url, (err, data: cc.JsonAsset) => {
            if (err) {
                cc.log("------>>josn error "+ json_url);
            } else {
                Configdata = data.json;
                //cc.log(Configdata);
                if(isToMap == true)
                {
                    for(var key in Configdata) {
                        var configInfo = Configdata[key];
                        ConfigMap.set(configInfo.id, configInfo);  
                    }
                }else{
                    // ConfigMap = Configdata;
                    for(var key in Configdata) {
                        var configInfo = Configdata[key];
                        ConfigMap.push(configInfo);  
                    }
                   
                }
               
               
            }
        });
      
    };
    parseAgeToMap()
    {
        for(let i =0;i<this.ageArray.length;i++)
        {
            let itemAge = this.ageArray[i];
            this.ageMap.set(itemAge.age, itemAge);  
        }
        
    }
    parseStrIntArr(str:string, del:string) {
        let strs:Array<any> = str.split(del);
        for(var i = 0; i < strs.length; i++) {
            strs[i] = parseInt(strs[i]);
        }

        return strs;
    };
    
    load_json(json_name:string) {
        let json_url = 'data/' + json_name;
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(json_url, (err, data: cc.JsonAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.json);
                }
            });
        });
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
   }

   //获取随机数
   getRandomNum(Min:number,Max:number){
        let Range = Number(Max) - Number(Min);
        let Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    //获取天赋品质的数据
    getTalentArrayByQuatily(talentArr){
        let myArrary = [];
        for (let index = 1; index < 6; index++) {
            let tempArr = [];
            myArrary[index]=tempArr;
            
        }
       // cc.log("talentArr =",talentArr);
        talentArr.forEach(function(val,key){
            let quality = val.quality;
            myArrary[quality].push(val);
        })

     
        return myArrary;
    }

    //随机获取其中一个天赋
    geOneTalentData(randData:any,tyData:any)
    {
        let fag = true;
        let c = 0;
        let res:any = null;
       for (const key in tyData) {
           if (Object.prototype.hasOwnProperty.call(tyData, key)) {
               const element = tyData[key];
               let qId = Number(element.id);
               if(randData.get(qId) != null)
                {
                    c++;
                }
           }
       }
     
       if(c ==  tyData.length)
       {
           fag = false;
           return res;//直接返回不要找了，
       }
    //    cc.log("====>>>>>",c,fag);
       while(fag)
       {
           let qNum = tyData.length;
           let qRand = this.getRandomNum(0,qNum-1);
           let qData = tyData[qRand];
           let qId = qData.id;
           if(randData.get(qId) == null)
           {
               fag = false;
                res =  qData
                break;
           }
       }
       return res;

    }
    //随机获取多少个天赋,第一个是多少条数据，第二个是是否是有红色品质
    getRandTalentByNums(n:any,isRed:boolean)
    {
        let rand1 = this.getRandomNum(0,1);
       // cc.log("rand1 = ",rand1,this.talentQualityData.length);
        let randTalentMap = new Map();
        if(this.talentQualityData.length == 0)
        {
            //cc.log(this.talentMap);
            this.talentQualityData = this.getTalentArrayByQuatily(this.talentMap);
            //cc.log(this.talentQualityData);
        }
       // cc.log("rand2 = ",rand1,this.talentQualityData.length);
        let redId = null;
        let redData:any = null;
        if(isRed)
        {
            let redNum = this.talentQualityData[this.TYPE_Q5].length;
            let rand = this.getRandomNum(1,redNum-1);
            redData = this.talentQualityData[this.TYPE_Q5][rand];
            redId = parseInt(redData.id);
            // randTalentArray[redId]= redData;
            randTalentMap.set(redId,redData);
        }
        let count =0;
        while(count<n)
        {
         
            let rand = this.getRandomNum(0,100);
           // cc.log("rand = ",rand,"count=",count);
            if(rand < 60)//选择白色
            {   
                
                let res =   this.geOneTalentData(randTalentMap,this.talentQualityData[this.TYPE_Q1]);
                
                if(res != null)
                {
                    if(randTalentMap.get(res.mutex) != null)
                    {
                        continue;
                    }
                    count++;
                  
                    randTalentMap.set(res.id,res);
                }
            }
            else if(rand>=60 &&rand <75)//选择绿色
            {
                let res =   this.geOneTalentData(randTalentMap,this.talentQualityData[this.TYPE_Q2]);
                if(res != null)
                {
                    count++;
                    randTalentMap.set(res.id,res);
                }
            }
            else if(rand>=75 &&rand <85)//选择蓝色
            {
                let res =   this.geOneTalentData(randTalentMap,this.talentQualityData[this.TYPE_Q3]);
                if(res != null)
                {
                    count++;
                    randTalentMap.set(res.id,res);
                }
            }
            else if(rand>=85 &&rand <95)//选择紫色
            {
                let res =   this.geOneTalentData(randTalentMap,this.talentQualityData[this.TYPE_Q4]);
                if(res != null)
                {
                    count++;
                    randTalentMap.set(res.id,res);
                }
            }
            else //选择红色
            {
                let res =   this.geOneTalentData(randTalentMap,this.talentQualityData[this.TYPE_Q5]);
                if(res != null)
                {
                    count++;
                    randTalentMap.set(res.id,res);
                }
            }

        }
     
        return randTalentMap;

    }


    getButtonEventWithDocItem(btnEvent)//获取所有对应的按钮事件
    {
        let docBtnEventArray = [];
        this.docMap.forEach(function(val,key){
            if(val.buttonEvent == btnEvent)
            {
                docBtnEventArray.push(val);
            }
            
        })
        return docBtnEventArray;
    }
    getTheFitWithFateEvent()//查找所有符合当前复活的逆天改命事件
    {
        let fateEventArray = [];
        let seletTalentMap = new Map();
        for (let index = 0; index < UserInfo.selectTalentArray.length; index++) {
            const element = UserInfo.selectTalentArray[index];
            seletTalentMap.set(element.id,element);
        }
        this.fateEventMap.forEach(function(fateItemData,key){
            let randCondition = fateItemData.randCondition;
            let noTrigger = fateItemData.noTrigger;
            let fag1 = Tools.getTheContion2(randCondition,seletTalentMap);
            if (fag1 == true) {
                let idArray  = noTrigger.split(",");
                let fag2 = true;
                for (let index = 0; index < idArray.length; index++) {
                    const element = idArray[index];
                    if (UserInfo.selectFateMap.get(element) != null) {
                        fag2 = false;
                        break;
                    }
                }
                if (fag2) {
                    fateEventArray.push(fateItemData);
                }
               
            }
        })
        return fateEventArray;

    }

    getFateEvent()
    {

        let fateEventArray = [];
        this.fateEventMap.forEach(function(fateItemData,key){
            if (UserInfo.selectFateMap.get(fateItemData.id) == null) {
                fateEventArray.push(fateItemData);
            }
        })
        
        let fag = true;
        let fateEventItem = null;
        while(fag )
        {
            let rand = ConfigMgr.getRandomNum(0,fateEventArray.length-1);
            fateEventItem = fateEventArray[rand]; 
            let randCondition = fateEventItem.randCondition;
            if(randCondition.length<=0)
            {
                fag = true;
                break;
            }
           let isOk =  Tools.getTheContion2(randCondition,UserInfo.selectDocMap);
           if(isOk)
           {
                fag = true;
                break;
           }

        }

        return fateEventItem;
    }

};
window["ConfigMgr"] = ConfigMgr
