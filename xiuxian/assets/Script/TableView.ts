const {ccclass, property} = cc._decorator;

/** 监听回调类型枚举 */
export enum TableViewHandler {
    /** 当前索引列表项 */
    kTableCellAtIndex = 0,
    /** 当前索引列表项大小 */
    kTableCellSizeForIndex = 1,
    /** 列表项数量 */
    kNumberOfCellsInTableView = 2,
    /** 列表项点击 */
    kTableCellTouched = 3,
    /** 列表滚动 */
    kTableViewScroll = 4,
    /** 列表上拉 */
    kTableViewPullUp = 5,
    /** 列表下拉 */
    kTableViewDropDown = 6,
};

/**
 * 列表项
 * @Author: Bingo
 * @Date: 2020-01-01
 */
export class TableViewCell extends cc.Node {
    /** 索引，复用时会更改 */
    index: number = -1;
    /** 初始/真实索引 */
    orgIndex: number = -1;

    constructor() {
        super();
        this.setAnchorPoint(0.5, 1);

        this.addComponent(cc.Widget);
        let widget = this.getComponent(cc.Widget);
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.left = 0;
        widget.right = 0;
    }
}

/**
 * TableView
 * @Author: Bingo
 * @Date: 2020-01-01
 */
@ccclass
class TableView extends cc.Component {
    /** 列表数据 */
    private _data: any[] = [];
    /** 列表项大小，如果没有注册kTableCellSizeForIndex，则取该值 */
    private _cellSize: cc.Size = null;
    /** 监听回调数组 */
    private _arrHandler: Function[] = [];

    /** 列表项Y坐标数组 */
    private _arrCellPosY: number[] = [];
    /** 待机中的列表项数组 */
    private _arrCellIdle: TableViewCell[] = [];
    /** 使用中的列表项数组 */
    private _arrCellInuse: TableViewCell[] = [];
    /** 是否在滚动中 */
    private _bolScrolling: boolean = false;
    /** 滚动偏移量 */
    private _scrollOffsetY: number = null;
    /** 上拉下拉拖拽偏移量 */
    private _pulldropOffsetY: number = 75;
    /** 列表项显示结束索引 */
    private _lastIndexEnd: number = -1;
    /** 列表项显示开始索引 */
    private _lastIndexBegin: number = 0;
    /** 触摸位置信息 */
    private _lastTouch: cc.Touch = null;

    /** 滚动视图控件 */
    private _scrollView: cc.ScrollView = null;
    /** 上拉提示节点 */
    private _labelPullUpTip: cc.Node = null;
    /** 上拉提示节点 */
    private _labelDropDownTip: cc.Node = null;

    protected onLoad() {
        this._scrollView = this.getComponent(cc.ScrollView);
        if (!this._scrollView) {
            throw Error("TableView need scrollView component.");
        }

        let content = this._scrollView.content;
        if (!content) {
            throw Error("TableView need scrollView content.");
        }

        this._labelPullUpTip = content.getChildByName("LabelPullUpTip");
        this._labelDropDownTip = content.getChildByName("LabelDropDownTip");
        if(this._labelPullUpTip) {
            this._labelPullUpTip.active = false;
        }
        if(this._labelDropDownTip) {
            this._labelDropDownTip.active = false;
        }

        // 用于记录点击的位置。 onScrollEvent的回调中并没有位置参数
        let event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = "TableView";
        event.handler = "onScrollEvent";
        this._scrollView.scrollEvents.push(event);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        cc.log("tableview----->>>>")
    }

    protected start() {
        // 改为不自动调用
        // this.reloadData();
    }

    /**
     * 从缓存池取列表项, 缓存池没有则创建
     * @param cleanup 是否清除列表项的所有子节点，默认false
     */
    public dequeueCell(cleanup: boolean = false): TableViewCell {
        let tagCell: TableViewCell = null;
        if (this._arrCellIdle.length > 0){
            tagCell = this._arrCellIdle.pop();
        }
        tagCell = tagCell || new TableViewCell();
        if(cleanup) {
            tagCell.children.forEach((cld) => {
                cld.destroy();
            });
            tagCell.removeAllChildren(true);
        }
        return tagCell;
    }
    
    /** 尝试寻找指定的cell */
    public findCellByName(name?: string): TableViewCell {
        if(!name) return new TableViewCell();

        let tagCell: TableViewCell = null;
        for(let i = this._arrCellIdle.length - 1; i >= 0; i--) {
            let cell = this._arrCellIdle[i];
            let node = cell && cell.getChildByName(name);
            if(node) {
                tagCell = cell;
                this._arrCellIdle.splice(i, 1);
                break;
            }
        }
        tagCell = tagCell || new TableViewCell();
        return tagCell;
    }

    /**
     * 重新加载数据
     * @param data 列表数据
     * @param autoRest 是否重设位置， 默认true
     */
    public reloadData(data?: any[], autoRest:boolean = true) {
        if (!cc.isValid(this._scrollView)) {
            cc.warn("TableView reloadData fail, scrollview is not valid.\nPlease call reloadData in start function.");
            return;
        }

        if(data) {
            this.data = data;
        }
        let preY = this._scrollView.content.y;

        this._reload();

        if(autoRest) { // 重新设置位置
            preY = Math.min(preY, this._scrollView.content.height - this._scrollView.content.y);
            this._scrollView.content.y = preY;
            this._onUpdateCellStatus();
        }
    }

    /**
     * 注册监听回调
     * @param handler 回调函数
     * @param handlerType 监听类型
     */
    public registerHandler(handler: Function, registerType: TableViewHandler) {
        this._arrHandler[registerType] = handler;
    }

    /**
     * 重新加载
     */
    private _reload() {
        if (!cc.isValid(this._scrollView)) { return }

        // 根据tableCell的高度计算需显示cell的个数
        // 渲染之前把之前使用的cell压入空闲cell中
        while (this._arrCellInuse.length > 0) {
            let idle = this._arrCellInuse.pop();
            idle.active = false;
            this._arrCellIdle.push(idle); // 把最下面的cell压入空闲中
        }

        let curH = 0;
        let len = this._getCellNumber();
        let viewPortH = this.node.height;
        this._arrCellPosY = [];
        this._lastIndexEnd = -1;
        this._lastIndexBegin = 0;
        
        for (let i = 0; i < len; i++) {
            let curCellH = this._getCellSize4Index(i).height;
            if (curH <= viewPortH){
                this._lastIndexEnd = i;
            }
            this._arrCellPosY.push(-curH);
            curH += curCellH;
        }
        curH = Math.max(curH, this._scrollView.node.height);
        this._scrollView.content.height = curH;
        this._scrollView.content.y = this._scrollView.node.height/2; // 回退到最上面

        if(this._lastIndexEnd >= 0) {
            for (let i = this._lastIndexBegin; i <= this._lastIndexEnd; i++) {
                let cell = this._getCellAtIndex(i);
                cell.index = i;
                if (!cell.parent) {
                    this._scrollView.content.addChild(cell);
                }
                if (cell.orgIndex == -1) {
                    cell.orgIndex = cell.index;
                }

                this._arrCellInuse.push(cell);
                cell.active = true;
                cell.y = this._arrCellPosY[i];
            }
        }

        // 排序是为了方便做回收处理，从上往下排列
        this._arrCellInuse.sort(function (a, b): number {
            return b.y - a.y; // 从大到小排列
        });

        this._onUpdateLoadTip();
    }

    /**
     * 更新列表项状态
     */
    private _onUpdateCellStatus() {
        const arrCellPosY = this._arrCellPosY;
        const arrCellIdle = this._arrCellIdle;
        const arrCellInuse = this._arrCellInuse;
        let scrollView = this._scrollView;
        let mLastShowEndI = this._lastIndexEnd;
        let mLastShowBeginI = this._lastIndexBegin;
        let viewY1 = scrollView.content.y - scrollView.node.height/2;
        let viewY2 = viewY1 + this.node.height;
        let curY = 0;
        let showBeginI = -1;
        let showEndI = -1;
        for (let i = 0; i < arrCellPosY.length; i++) {
            let curCellH = this._getCellSize4Index(i).height;
            if (curY + curCellH < viewY1) { // 视口上面
            } else if (curY > viewY2) { // 视口下面
                break
            } else { // 视口里面
                if (showBeginI == -1) {
                    showBeginI = i;
                } 
                showEndI = i;
            }
            curY += curCellH;
        }
        if (showBeginI == -1 || showEndI == -1)
            return;
        if (showBeginI >= mLastShowBeginI && showEndI <= mLastShowEndI) {
            return; // 显示的cell区间不变
        }

        let showNewBeginI = showBeginI;
        let showNewEndI = showEndI;
        if (showBeginI < mLastShowBeginI) { // 手指往下滑动，组件往下滑动，导致当前显示的顶端cell索引小于之前的
            if (showEndI < mLastShowEndI) {
                let curEnd = mLastShowEndI;
                while (curEnd > showEndI) {
                    if (arrCellInuse.length > 0) {
                        let idle = arrCellInuse.pop();
                        // 之前采用remove的方法导致子cell中添加的TOUCH_START监听后面都无效了，现在改成置为active为false
                        // 来取代从父节点移除操作。其实也没必要移除因为后续又要添加进来，这样算起来还是切换active更高效点
                        idle.active = false;
                        arrCellIdle.push(idle); // 把最下面的cell推入空闲中
                    }
                    curEnd--;
                }
            }
            if(showEndI < mLastShowBeginI) {
                showNewEndI = showEndI; // 快速滑动情况
            }else {
                showNewEndI = mLastShowBeginI - 1;
            }
        } else if (showEndI > mLastShowEndI) { // 手指往上滑动，组件往上滑动,导致当前显示底段的cell索引大于之前的
            if (showBeginI > mLastShowBeginI) {
                let curBegin = mLastShowBeginI;
                while (curBegin < showBeginI) {
                    if (arrCellInuse.length > 0) {
                        let idle = arrCellInuse.shift();
                        idle.active = false;
                        arrCellIdle.push(idle); // 把最下面的cell推入空闲中
                    }
                    curBegin++;
                }
            }
            if(showBeginI > mLastShowEndI) {
                showNewBeginI = showBeginI; // 快速滑动情况
            }else {
                showNewBeginI = mLastShowEndI + 1;
            }
        }
        
        for (let i = showNewBeginI; i <= showNewEndI; i++) {
            let cell = this._getCellAtIndex(i);
            cell.index = i; //更新IDX
            if (!cell.parent) {
                scrollView.content.addChild(cell);
            }
            if (cell.orgIndex == -1) {
                cell.orgIndex = cell.index;
            }
            arrCellInuse.push(cell);
            cell.active = true;
            cell.y = arrCellPosY[i];
        }
        // 排序是为了方便做回收处理，从上往下排列
        arrCellInuse.sort(function (a, b): number {
            return b.y - a.y;//从大到小排列
        });

        this._lastIndexEnd = showEndI;
        this._lastIndexBegin = showBeginI;
    }

    /**
     * 更新加载提示
     */
    private _onUpdateLoadTip() {
        let viewH = this._scrollView.node.height;
        let contH = this._scrollView.content.height;
        let funcpu = this._arrHandler[TableViewHandler.kTableViewPullUp];
        let funcdd = this._arrHandler[TableViewHandler.kTableViewDropDown];
        if(this._labelDropDownTip) {
            this._labelDropDownTip.active = (funcdd != null);
            if(this._labelDropDownTip.active) {
                let widget = this._labelDropDownTip.getComponent(cc.Widget);
                if(widget) {
                    widget.top = -this._pulldropOffsetY;
                }else {
                    this._labelDropDownTip.y = -this._pulldropOffsetY;
                }
            }
        }
        if(this._labelPullUpTip) {
            this._labelPullUpTip.active = false;
            if(funcpu && contH >= viewH) {
                this._labelPullUpTip.active = true;
            }
            if(this._labelPullUpTip.active) {
                let widget = this._labelPullUpTip.getComponent(cc.Widget);
                if(widget) {
                    widget.bottom = -this._pulldropOffsetY;
                }else {
                    this._labelPullUpTip.y = -this._pulldropOffsetY;
                }
            }  
        }
    }

    /**
     * 触摸开始回调
     * @param event 事件
     */
    private onTouchStart(event: cc.Event.EventTouch) {
        this._lastTouch = event.touch;
    }

    /**
     * 上边缘继续往下拖拽: SCROLL_BEGAN->SCROLLING->SCROLL_TO_TOP->SCROLLING->TOUCH_UP(抬起)
     *                   ->BOUNCE_TOP->SCROLLING->AUTOSCROLL_ENDED_WITH_THRESHOLD->SCROLLING->SCROLL_ENDED
     * 中间拖拽：SCROLL_BEGAN->SCROLLING->TOUCH_UP(抬起)->SCROLL_ENDED
     * 下边缘继续往上拖拽: SCROLL_BEGAN->SCROLLING->SCROLL_TO_BOTTOM->SCROLLING->TOUCH_UP(抬起)
     *                   ->BOUNCE_BOTTOM->SCROLLING->AUTOSCROLL_ENDED_WITH_THRESHOLD->SCROLLING->SCROLL_ENDED
     * 抬起: TOUCH_UP
     * @param scrollView
     * @param eventType
     * @param customEventData
     */
    private onScrollEvent(scrollView: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData: string) {
        if (eventType == cc.ScrollView.EventType.SCROLL_BEGAN) {
            this._bolScrolling = true;
            this._scrollOffsetY = null;
        } else if (eventType == cc.ScrollView.EventType.SCROLL_ENDED) {
            this._bolScrolling = false;
            this._scrollOffsetY = null;
        } else if (eventType == cc.ScrollView.EventType.SCROLLING) {
            let cury = scrollView.content.y;
            this._scrollOffsetY = this._scrollOffsetY || cury;
            if(Math.abs(cury - this._scrollOffsetY) >= 5) {
                this._scrollOffsetY = cury;
                this._onUpdateCellStatus();
            }
            let func = this._arrHandler[TableViewHandler.kTableViewScroll];
            func && func(this, cury);
        } else if (eventType == cc.ScrollView.EventType.TOUCH_UP) {
            let func = this._arrHandler[TableViewHandler.kTableCellTouched];
            if (!this._bolScrolling && func && this._lastTouch) {
                for (let i = 0; i < this._arrCellInuse.length; i++) {
                    let child = this._arrCellInuse[i];
                    let rect = child.getBoundingBoxToWorld();
                    if (rect.contains(this._lastTouch.getLocation())) {
                        func(this, child, this._lastTouch);
                        break;
                    }
                }
                this._lastTouch = null;
            }

            let funcpu = this._arrHandler[TableViewHandler.kTableViewPullUp];
            if(funcpu) {
                let offset = scrollView.getScrollOffset();
                let maxOffset = scrollView.getMaxScrollOffset();
                if((offset.y - maxOffset.y) >= this.pulldropOffsetY) {
                    funcpu(this, offset.y - maxOffset.y);
                }
            }

            let funcdd = this._arrHandler[TableViewHandler.kTableViewDropDown];
            if(funcdd) {
                let offset = scrollView.getScrollOffset();
                if(offset.y < 0 && Math.abs(offset.y) >= this.pulldropOffsetY) {
                    funcdd(this, Math.abs(offset.y));
                }
            }
        }
    }

    /**
     * 获取列表项个数
     */
    private _getCellNumber(): number {
        let func = this._arrHandler[TableViewHandler.kNumberOfCellsInTableView];
        if(func) {
            return func(this);
        }else {
            return this.data.length;
        }
    }

    /**
     * 获取列表项大小
     * @param index 索引
     */
    private _getCellSize4Index(index: number): cc.Size {
        let func = this._arrHandler[TableViewHandler.kTableCellSizeForIndex];
        if(func) {
            return func(this, index);
        }else {
            return this.cellSize || cc.size(0, 0);
        }
    }

    /**
     * 获取当前的列表项
     * @param index 索引
     */
    private _getCellAtIndex(index: number): TableViewCell {
        let func = this._arrHandler[TableViewHandler.kTableCellAtIndex];
        if(func) {
            return func(this, index);
        }else {
            cc.warn("TableView can not found kTableCellAtIndex register.");
        }
    }

    /** 列表数据 */
    public get data(): any[] {
        return this._data;
    }

    public set data(data: any[]) {
        this._data = data;
    }

    /**
     * 使用中的列表项数组
     */
    public get arrCellInuse(): TableViewCell[] {
        return this._arrCellInuse;
    }

    /** 列表项大小，如果没有注册kTableCellSizeForIndex，则取该值 */
    public get cellSize(): cc.Size {
        return this._cellSize;
    }
    public set cellSize(size: cc.Size) {
        this._cellSize = size;
    }

    /** 上拉下拉拖拽偏移量 */
    public get pulldropOffsetY(): number {
        return this._pulldropOffsetY;
    }
    public set pulldropOffsetY(offsety: number) {
        this._pulldropOffsetY = offsety;
    }

    /**
     * 滚动到百分比
     */
    public scrollToPercentVertical(percent:number) {
        this.scheduleOnce(() => { // 延迟
            this._scrollView.scrollToPercentVertical(percent, 0.2);
        }, 0.1);
    }

    public scrollToTop()
    {
        this._scrollView.scrollToTop();
    }

    public scrollToBottom()
    {
        this._scrollView.scrollToBottom();
        this.reloadData();
    }
}

export default TableView;
