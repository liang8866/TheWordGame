
module AcFuncEx {


    /**
     * 深拷贝
     * @param obj 对象/数组等
     */
    export function deepCopy(obj?: object) {
        if(!obj) return;

        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * 克隆
     * @param obj 对象/数组等
     */
    export function clone(obj?: object) {
        return deepCopy(obj);
    }

    /**
     * 获取范围内的随机数值
     * @param min 小值
     * @param max 大值
     * @param decimalNum 小数位数
     */
    export function rangeRandom(minNum: number, maxNum: number, decimalNum?: number): number {
        let max = 0, min = 0;
        minNum <= maxNum ? (min = minNum, max = maxNum) : (min = maxNum, max = minNum);
        switch (arguments.length) {
            case 1:
                return Math.floor(Math.random() * (max + 1));
                break;
            case 2:
                return Math.floor(Math.random() * (max - min + 1) + min);
                break;
            case 3:
                return parseInt((Math.random() * (max - min) + min).toFixed(decimalNum));
                break;
            default:
                return Math.random();
                break;
        }
    }

    /**
     @ function:传入一个小数和一个大数获得之间的随机整数值
     @ param
     @ Min:Number
     @ Max:Number
     */
    export function getRandomNum(Min:number,Max:number){
        let Range = Number(Max) - Number(Min);
        let Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }


    /**
     * 千分法计数, 每隔3位加一个逗号
     * @param {number} num
     * @return {string} 格式化之后的结果
     * @example
     *  toThousands(123456); // => 123,456
     */
    export function toThousands(num: number) {
        return num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }

    /**
     * 数字转单位(K,M,G,T...)
     * @param {number} num  待转化数字
     * @param {number} digits 小数位
     * @example
     * toNumberUnit(11111, 2); // => 11.11K
     */
    export function toNumberUnit(num: number, digits: number = 0) {
        const si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "K" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "G" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "P" },
            { value: 1E18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

        let i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num/si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }

    /**
     * 数字转中文单位(千，万，亿...)
     * @param {number} num  待转化数字
     * @param {number} digits 小数位
     * @example
     * toNumberUnit(11111, 2); // => 11.11千
     */
    export function toNumberCnUnit(num: number, digits: number = 0) {
        const si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "千" },
            { value: 1E4, symbol: "万" },
            { value: 1E8, symbol: "亿" },
        ];

        let i, tagNum;
        for (i = si.length - 1; i > 0; i--) {
            tagNum = toNumberFixed(num/si[i].value, digits);
            if (tagNum >= 1) {
                break;
            }
        }
        return tagNum + si[i].symbol;
    }

    /**
     * 向下转化为最大数值
     * @param num 待转化数字
     * @example
     * toFloatMaxNum(5100); // => 5000
     * toFloatMaxNum(12300); // => 12000
     */
    export function toFloatMaxNum(num: number) {
        const si = [1, 1E2, 1E3, 1E4, 1E8];
        let tagNum = num;
        for (let i = si.length - 1; i > 0; i--) {
            if (num/si[i] >= 1) {
                tagNum = Math.floor(num/si[i]) * si[i];
                break;
            }
        }
        return tagNum;
    }

    /**
     * 保留小数位
     * @param num 
     * @param fd 保留位数，默认2
     */
    export function toNumberFixed(num: number, fd: number = 2) {
        if(isNaN(num)) return Number(0).toFixed(fd);

        let times = Math.pow(10, fd);
        var roundNum = Math.round(num * times)/times;
        return Number(roundNum.toFixed(fd));
    }

    /**
     * 隐藏特定数字为指定字符
     * @param num 操作数
     * @param index 起始索引，默认最高位0
     * @param hiddenStr 指定字符，默认?
     * @example
     *  toHiddenNumber(100000); // => 1?????
     */
    export function toHiddenNumber(num: number, index: number = 0, hiddenStr: string = '?') {
        return num.toString().replace(/\S/g, (match, offset) => (offset !== index ? hiddenStr : match));
    }

    /**
     * 格式化秒
     * @param int  value 总秒数
     * @return string result 格式化后的字符串
     */
    export function convertTime(value) { 
        let theTime = parseInt(value); 
        let theTime1: number = 0; // 分 
        let theTime2: number = 0; // 小时 
        let theTime3: number = 0; // 天
        if(theTime > 60) { 
            theTime1 = parseInt((theTime/60).toString()); 
            theTime = parseInt((theTime%60).toString()); 
            if(theTime1 > 60) { 
                theTime2 = parseInt((theTime1/60).toString()); 
                theTime1 = parseInt((theTime1%60).toString()); 
                if(theTime2 > 24){
                    // 大于24小时
                    theTime3 = parseInt((theTime2/24).toString());
                    theTime2 = parseInt((theTime2%24).toString());
                }
            }
        } 
        var result = '';
        if(theTime > 0){
            result = `${theTime}S`;
        }
        if(theTime1 > 0) { 
            result = `${theTime1}M` + result; 
        } 
        if(theTime2 > 0) { 
            result =  `${theTime2}H` + result; 
        } 
        if(theTime3 > 0) { 
            result = `${theTime3}D` + result; 
        }
        return result;
    }

    /**
     * 转换秒为 00:00:00
     * @param t 秒数
     */
    export function convertSec2HHMMSS(t: number): string {
        let h = (Math.floor(t/60/60) + 100 + '').substr(1);
        let m = (Math.floor(t/60%60) + 100 + '').substr(1);
        let s = (Math.floor(t%60) + 100 + '').substr(1);
        return `${h}:${m}:${s}`;
    }

    export function convertSecPad(t: number): string {
        let h = (Math.floor(t/60/60) + 100 + '').substr(1);
        let m = (Math.floor(t/60%60) + 100 + '').substr(1);
        let s = (Math.floor(t%60) + 100 + '').substr(1);
        let hpad = pad2(h);
        let mpad = pad2(m);
        let spad = pad2(s);

        return `${hpad}:${mpad}:${spad}`;
    }

    export function pad2(num) {
        var len = num.toString().length;
        let n = 2;
        while(len < n) {
          num = "0" + num;
          len++;
        }
        return num;
      }

    /**
     * 转换秒为s/m/h
     * @param sec 秒数
     * @param fd 保留小数位
     */
    export function covertSec2SMH(sec: number = 0, fd: number = 0) {
        sec = Math.max(0, sec);
        if(sec < 60) {
            return `${sec.toFixed(0)}s`;
        } else if(sec < 3600) {
            return `${(sec/60).toFixed(fd)}m`;
        } else {
            return `${(sec/3600).toFixed(fd)}h`;
        }
    }

    /**
     * 计算string长度，汉字2个字节，英文数字1个字节
     */
    export function getStringLength  (string) {
        var intLength = 0
        for (var i = 0; i < string.length; i++) {
           if ((string.charCodeAt(i) < 0) || (string.charCodeAt(i) > 255))
            intLength = intLength + 2
          else
            intLength = intLength + 1
       }
        return intLength
    }

    /**
     * 时间戳转年月日
     * @param timeStamp 
     * @returns 
     */
    export function getTimeDate (timeStamp) {
        var time = new Date(timeStamp);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        // var h = time.getHours();
        // var mm = time.getMinutes();
        // var s = time.getSeconds();
        return [y,m,d];
    }
    //查找字符串1中是否包含字符串2
    export function searchStr(str1:string ,str2:string)
    {
        if(str1.search(str2) != -1)
        {
            return true;
        }
        return false;
    }

    //把天赋分拆 按品质
    export function getTalentArrayByQuatily(talentArr)
    {
        let myArrary = new Array();
        for (const key in talentArr) {
            if (Object.prototype.hasOwnProperty.call(talentArr, key)) {
                const element = talentArr[key];
                let quality = element.quality;
                myArrary[quality].push(element);
            }
        }
        return myArrary;
    }
    // 随机获取多少条T
    export function getRandTalentArray(arr:any ,num:number)
    {
       

        while(num>0)
        {
            let rand =  getRandomNum(0,100);
            
        }

    }

}

export default AcFuncEx;
