/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Script Name: Aeron's Calender
 * Files Associated：  AC.js, AC.css, AC.html
 *
 * Author: Aeron
 * QQ: 909052875
 * Email: sxjvip@gmail.com
 * Loc: GZU
 * Date: 2009年10月30日
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 调用方式
 *    new AC(inputObject);
 * 或
 *    MyCalender.getInstance().main(inputObject);
 *
 * 其中input为输入框对象，例如
 *
 * 	<input type="text" onclick="new AC(this)"/>
 *
 *  <input type="text" onclick="MyCalender.getInstance().main(this)"/>
 *
 ************************************************************************/
var AC = function(input){
    MyCalender.getInstance().main(input);
}

/**
 * MyCalender 构造器，由于采用单例模式，只有创建时才调用，
 * 采用面向对象方式创建DOM对象，没有拼串，
 * 这段代码占了的1/2长度，但一点儿也不复杂
 */
var MyCalender = function(){
    if (MyCalender.caller != MyCalender.getInstance) {
        throw new Error("不能创建MyCalender实例!");
    }
    
    var _this = this;
    /**
     * 创建文档片段，减少DOM刷新页面的次数
     */
    var myCal = document.createDocumentFragment();
    {
        var btnClone = document.createElement("input");
        btnClone.type = "button";
        /**
         * 日历控件最外层div
         */
        this.divOut = document.createElement("div");
        myCal.appendChild(this.divOut);
        this.divOut.id = "divOut";
        {
            var divHeader = document.createElement("div");
            this.divOut.appendChild(divHeader);
            var ttClone = document.createElement("tt");
            /**
             * 日历头选择年、月
             */
            divHeader.id = "divHeader";
            {
                /**
                 * 添加前一年tt元素、上个月元素、
                 * 年文本框和“年”标签文字、
                 * 月文本框和“月”标签文字、
                 * 下个月tt元素、下一年tt元素
                 */
                /* 上一年 */
                var ttPreYear = ttClone.cloneNode(false);
                divHeader.appendChild(ttPreYear);
                ttPreYear.innerHTML = "&lt;&lt;";
                ttPreYear.title = "上一年";
                ttPreYear.onclick = function(){
                    _this.changeYear(-1);
                }
                /* 上个月 */
                var ttPreMonth = ttClone.cloneNode(false);
                divHeader.appendChild(ttPreMonth);
                ttPreMonth.innerHTML = "&lt;"
                ttPreMonth.title = "上个月";
                ttPreMonth.onclick = function(){
                    _this.changeMonth(-1);
                }
                /* yyyy年文本框 */
                this.selYear = document.createElement("select");
                divHeader.appendChild(this.selYear);
                this.selYear.title = "【Tab】：选择月份\n【←↑↓→】：选择年份\n【Enter】：插入选中的日期\n";
                var optionClone = document.createElement("option");
                for (var i = 1900; i <= 2100; i++) {
                    var option = optionClone.cloneNode(false);
                    option.value = i;
                    option.innerHTML = i;
                    this.selYear.appendChild(option);
                }
                this.selYear.onchange = function(){
                    var year = _this.date.getFullYear();
                    var dy = this.value - year;
                    _this.changeYear(dy);
                }
                /* IE下select会响应键盘事件自动执行onchange
                 * FF和Chrome不会，解决办法是强迫执行onchange
                 */
                this.selYear.onkeyup = function(evt){
                    var event = evt || window.event;
                    if (event.keyCode == 13) {
                        _this.onDay();
                    }
                    this.onchange();
                }
                /* “年”文本标签 */
                divHeader.appendChild(document.createTextNode("年"));
                /* MM月文本框 */
                this.selMonth = this.selYear.cloneNode(false);
                divHeader.appendChild(this.selMonth);
                this.selMonth.title = "【Tab】：选择日期\n【←↑↓→】：选择月份\n【Shift+Tab】： 选择年份";
                for (var i = 1; i <= 12; i++) {
                    var option = optionClone.cloneNode(false);
                    option.value = i;
                    option.innerHTML = i;
                    this.selMonth.appendChild(option);
                }
                this.selMonth.onchange = function(){
                    var month = _this.date.getMonth() + 1;
                    var dy = this.value - month;
                    _this.changeMonth(dy);
                }
                this.selMonth.onkeyup = function(evt){
                    var event = evt || window.event;
                    if (event.keyCode == 13) {
                        _this.onDay();
                    }
                    /* IE下select会响应键盘事件自动执行onchange
                     * FF和Chrome不会，解决办法是强迫执行onchange
                     */
                    this.onchange();
                }
                /* “月”文本标签 */
                divHeader.appendChild(document.createTextNode("月"));
                /* 下个月 */
                var ttNextMonth = ttClone.cloneNode(false);
                divHeader.appendChild(ttNextMonth);
                ttNextMonth.innerHTML= "&gt;";
                ttNextMonth.title = "下个月";
                ttNextMonth.onclick = function(){
                    _this.changeMonth(1);
                }
                /* 下一年 */
                var ttNextYear = ttClone.cloneNode(false);
                divHeader.appendChild(ttNextYear);
                ttNextYear.innerHTML = "&gt;&gt;";
                ttNextYear.title = "下一年";
                ttNextYear.onclick = function(){
                    _this.changeYear(1);
                }
            }
            /**
             * 创建一个a元素，以后直接复制，而不用再创建，提高效率
             */
            var aClone = document.createElement("a");
            /**
             * 日历星期部分
             */
            var divWeek = document.createElement("div");
            this.divOut.appendChild(divWeek);
            divWeek.id = "divWeek";
            {
                /**
                 * 用一个数组记录星期的汉字
                 */
                var week = ["一", "二", "三", "四", "五", "六", "日"];
                /**
                 * 在divWeek中添加天数
                 */
                for (var i = 0; i < 7; i++) {
                    var aElem = aClone.cloneNode(true);
                    divWeek.appendChild(aElem);
                    aElem.innerHTML = week[i];
                    if (i >= 5) {
                        aElem.className = "weekend";
                    }
                }
            }
            /**
             * 日历主体div，用于显示天
             */
            this.divMain = document.createElement("div");
            this.divOut.appendChild(this.divMain);
            this.divMain.id = "divMain";
            this.divMain.title = "【←↑↓→】：选择日期\n【Shift+Tab】： 选择月份";
            this.divMain.onmouseover = function(){
                _this.btnHidden.focus();
            }
            {
                /**
                 * 使用一个隐藏的input（高度为0，非隐藏域），
                 * 当它获得焦点时，将divMain显示轮廓，
                 * 并且能响应键盘事件，改变日期，
                 * 看起像是divMain响应了键盘事件
                 */
                this.btnHidden = btnClone.cloneNode(false);
                this.divMain.appendChild(this.btnHidden);
                this.btnHidden.onfocus = function(){
                    /* 使divMain显示轮廓，看起来像是divMain获得了焦点  */
                    _this.divMain.style.outline = "dashed 1px";
                }
                this.btnHidden.onblur = function(){
                    _this.divMain.style.outline = "none";
                }
                this.btnHidden.onkeydown = function(evt){
                    var event = evt || window.event;
                    var day = _this.date.getDate();
                    switch (event.keyCode) {
                        case 9:
                            if (event.shiftKey) {
                                _this.selMonth.focus();
                            } else {
                                _this.aClear.focus();
                            }
                            break;
                        case 13:
                            _this.onDay();
                            break;
                        case 37:
                            _this.changeDay(day - 1);
                            break;
                        case 39:
                            _this.changeDay(day + 1);
                            break;
                        case 38:
                            _this.changeDay(day - 7);
                            break;
                        case 40:
                            _this.changeDay(day + 7);
                            break;
                    }
                    /**
                     * 阻止事件默认行为，以免按方向键时，浏览器滚动条也一起滚动
                     */
                    if (evt) {
                        /* FF & Chorme等 */
                        /* 取消事件冒泡  */
                        //event.stopPropagation();
                        /* 阻止事件默认行为 */
                        event.preventDefault();
                    } else {
                        /* IE */
                        /* 取消事件冒泡  */
                        //event.cancelBubble = true;
                        /* 阻止事件默认行为 */
                        event.returnValue = false;
                    }
                }
                /**
                 * 在divMain中添加空元素,同时产生6个空元素方便月份改变时使用
                 */
                this.blanks = new Array()
                var bClone = document.createElement("b");
                for (var i = 1; i <= 6; i++) {
                    var bElem = bClone.cloneNode(false);
                    this.divMain.appendChild(bElem);
                    this.blanks.push(bElem);
                }
                /**
                 * 在divMain中添加天数,同时产生31天方便月份改变时使用
                 */
                this.days = new Array();
                for (var i = 1; i < 32; i++) {
                    var aElem = aClone.cloneNode(true);
                    this.divMain.appendChild(aElem);
                    this.days.push(aElem);
                    aElem.innerHTML = i;
                    aElem.title = "【←↑↓→】：选择日期\n【Shift+Tab】： 选择月份\n单击或【Enter】：插入该日期";
                    aElem.onclick = (function(day){
                        return function(){
                            _this.changeDay(day);
                            _this.onDay();
                        }
                    })(i);
                    aElem.onmouseover = (function(day){
                        return function(){
                            _this.changeDay(day);
                        }
                    })(i);
                }
            }
            /**
             * 日历脚部div
             */
            var divFooter = document.createElement("div");
            this.divOut.appendChild(divFooter);
            divFooter.id = "divFooter";
            {
                /**
                 * 清空文本框
                 */
                this.aClear = btnClone.cloneNode(false);
                divFooter.appendChild(this.aClear);
                this.aClear.value = "清空";
                this.aClear.title = "清空输入框";
                this.aClear.onclick = function(){
                    _this.onClear();
                }
                /**
                 * 创建"今天" 按钮，并加到脚部div中
                 */
                this.aToday = btnClone.cloneNode(false);
                divFooter.appendChild(this.aToday);
                this.aToday.id = "today";
                this.aToday.value = "今天";
                this.aToday.title = "插入" + (_this.format(new Date()));
                this.aToday.onclick = function(){
                    _this.onToday();
                }
                /**
                 * 创建取消按钮
                 */
                this.aCancel = btnClone.cloneNode(false);
                divFooter.appendChild(this.aCancel);
                this.aCancel.value = "取消";
                this.aCancel.onclick = function(){
                    _this.onCancel();
                }
            }
        }
    }
    /**
     * 把日历控件加到文档片段上
     */
    var eBody = document.getElementsByTagName('body')[0];
    eBody.appendChild(myCal);
}
/*
 以上是创建DOM结点的过程， 生成的纯HTML如下
 <div  id="divOut">
 <div id="divHeader">
 <tt title="上一年">&lt;&lt;</tt>
 <tt title="上个月">&lt;</tt>
 <select title="单击可选择年份">
 <option value="1970">1970</option>
 <option value="1971">1971</option>
 ......
 <option value="2050">2050</option>
 </select>
 <label>年</label>
 <select title="单击可选择月份">
 <option value="1">1</option>
 <option value="2">2</option>
 ......
 <option value="12">12</option>
 </select>
 <label>月</label>
 <tt title="下个月">&gt;</tt>
 <tt title="下一年">&gt;&gt;</tt>
 </div>
 <div id="divWeek">
 <a>一</a>
 ......
 <a>日</a>
 </div>
 <div id="divMain">
 <input />
 <b ></b>
 <b ></b>
 <b ></b>
 <b ></b>
 <b ></b>
 <b ></b>
 <a >1</a>
 ......
 <a >31</a>
 </div>
 <div id="divFooter">
 <a id="clear">清空</a>
 <a id="today">今天</a>
 <a id="cancel">X</a>
 </div>
 </div>
 */
/**
 * MyCalender 单例模式
 */
MyCalender.instance = null;

MyCalender.getInstance = function(){
    if (!MyCalender.instance) {
        this.instance = new MyCalender();
    }
    return this.instance;
}

/**
 * 为  MyCalneder 添加原型函数
 */
MyCalender.prototype = {
    main: function(input){
        this.input = input;
        
        this.setPosition();
        this.divOut.style.display = "block";
        
        /* 记录前一次选中的日期，以便在这一次将它取消加亮   */
        var srcDate = this.date ? this.date.getDate() : 1;
        
        var value = input.value;
        var regexp = /^\d{4}(-\d{2}){2}$/;
        if (regexp.test(value)) {
            var substrs = value.split("-");
            this.date = new Date(substrs[0], substrs[1] - 1, substrs[2]);
        } else {
            this.date = new Date();
        }
        
        this.setCurrent(srcDate, this.date.getDate());
        
        this.changeDays();
        
        this.selYear.focus();
    },
    changeYear: function(dy){
        var srcDate = this.date.getDate();
        
        this.date.setFullYear(this.date.getFullYear() + dy);
        
        var curDate = this.date.getDate();
        if (srcDate != curDate) {
            this.date.setDate(0);
            this.setCurrent(srcDate, this.date.getDate());
        }
        
        this.changeDays();
    },
    changeMonth: function(dm){
        var srcDate = this.date.getDate();
        
        this.date.setMonth(this.date.getMonth() + dm);
        
        var curDate = this.date.getDate();
        if (srcDate != curDate) {
            this.date.setDate(0);
            this.setCurrent(srcDate, this.date.getDate());
        }
        
        this.changeDays();
    },
    changeDay: function(day){
        var srcDate = this.date.getDate();
        var tmp = new Date(this.date);
        tmp.setDate(32);
        tmp.setDate(0);
        var srcDayNum = tmp.getDate();
        
        this.date.setDate(day);
        
        
        if (day <= 0 || day > srcDayNum) {
            this.changeDays();
        }
        this.setCurrent(srcDate, this.date.getDate());
    },
    setCurrent: function(src, day){
        this.days[src - 1].className = (this.days[src - 1].className).replace(/ ?current ?/, "");
        this.days[day - 1].className += " current";
    },
    clearWeekend: function(){
        for (var i = 0; i < this.days.length; i++) {
            this.days[i].className = (this.days[i].className).replace(/ ?weekend ?/, "");
        }
    },
    setWeekend: function(sunday, dayNum){
        var satursday = sunday - 1 || sunday + 6;
        while (sunday <= dayNum) {
            this.days[sunday - 1].className += " weekend";
            sunday += 7;
        }
        while (satursday <= dayNum) {
            this.days[satursday - 1].className += " weekend";
            satursday += 7;
        }
    },
    changeDays: function(){
        /**
         * 显示年月数
         */
        this.selYear.value = this.date.getFullYear();
        this.selMonth.value = this.date.getMonth() + 1;
        /**
         * 先去除上个月星期六、星期天的颜色
         */
        this.clearWeekend();
        /**
         * 拷贝当前日期如11月29日，不要改变源日期对象
         */
        var tmp = new Date(this.date);
        /**
         * 确定第一天应放置的位置，前面几天用空b元素填充，
         * 按本地习惯，星期按一、二、三、四、五、六、天的顺序排列,
         * 所以上个月最后一天是星期数正好是空元素的个数
         */
        tmp.setDate(0);
        var blankNum = tmp.getDay();
        /**
         * 只在Dom树上显示需要的空元素,其它的隐藏
         */
        for (var i = 0; i < blankNum; i++) {
            this.blanks[i].style.display = "inline-block";
        }
        for (; i < 6; i++) {
            this.blanks[i].style.display = "none";
        }
        /**
         * 得到天数，这个月的最后一天即是这个月的天数
         */
        tmp.setDate(1);
        tmp.setMonth(tmp.getMonth() + 2);
        tmp.setDate(0);
        var dayNum = tmp.getDate();
        /**
         * 只在Dom树上显示需要的空元素,其它的隐藏
         */
        for (i = 28; i < dayNum; i++) {
            this.days[i].style.display = "inline-block";
        }
        for (; i < 31; i++) {
            this.days[i].style.display = "none";
        }
        /**
         * 改变星期六、星期天颜色
         */
        this.setWeekend(7 - blankNum, dayNum);
    },
    onDay: function(){
        this.input.value = this.format(this.date);
        this.divOut.style.display = "none";
        this.input.blur();
    },
    onClear: function(){
        this.input.value = "";
        this.divOut.style.display = "none";
    },
    
    onToday: function(){
        var srcDate = this.date.getDate();
        
        this.date = new Date();
        
        this.setCurrent(srcDate, this.date.getDate());
        
        this.input.value = this.format(this.date);
        this.divOut.style.display = "none";
        
        this.changeDays();
    },
    format: function(date){
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = date.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    },
    onCancel: function(){
        this.divOut.style.display = "none";
    },
    
    setPosition: function(){
        /* 得到输入框的位置，以确定日历控件的位置 */
        var curNode = this.input;
        var left = 0;
        var top = curNode.offsetHeight - 2;
        /* 逐层向上递归加和所有父元素的位置 */
        while (curNode) {
            left += curNode.offsetLeft;
            top += curNode.offsetTop;
            curNode = curNode.offsetParent;
        }
        this.divOut.style.left = left + "px";
        this.divOut.style.top = top + "px";
    }
}

