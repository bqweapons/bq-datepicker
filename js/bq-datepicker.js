/**
 * 日付ピッカライブラリ
 */
(function (global, _obj){

    // ロケールを日本に設定する
    moment.locale('ja');

    var parse_format = ['NNyMMDD', 'YYYY/MM/DD', 'YYYYMMDD'];

    var week_en = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var week_ja = ['日', '月', '火', '水','木','金','土'];
    var __option = {
        format : "YYYY/MM/DD",           // サブミットフォーマット
        month_format : "NNNNyoM月",      // 年月フォーマット
        edit_format : "NNyMMDD",         // 編集時のフォーマット
        display_format : "NNNNyoM月D日", // 表示フォーマット
        now_format : "YYYY/MM/DD",       // 今日の日付のフォーマット
        ja_date_format : "NNNyoMMDD",
        now : moment()
    }

    /**
     * 初期化処理
     */
    _obj.init = function(){
        // コンテンナーを描画
        this.drawDatepicker();
        // タイトルを描画
        this.drawTitleBar();
        // 年月選択エリアを描画
        this.drawYearMonthArea();
        // ボディを描画
        this.drawBody();
    }

    /**
     * datepickerのコンテンナーを描画
     */
    _obj.drawDatepicker =  function(){
        let container = createElement("div","bq-datepicker hide");
        let title = createElement('div', 'd-flex justify-content-between bq-title');
        let body = createElement('div', 'bq-body');
        let year_month = createElement('div', 'year-month hide');

        container.appendChild(title);
        container.appendChild(year_month);
        container.appendChild(body);
        document.body.appendChild(container);

        this.container = container;
        this.title = title;
        this.body = body;
        this.year_month = year_month;
    }

    /**
     * ナビエリア描画
     */
     _obj.drawTitleBar = function(){

        let left = createElement('i', 'fas fa-angle-left');
        let current_month = createElement('span', 'current-month');
        let right = createElement('i', 'fas fa-angle-right');
        this.title.appendChild(left);
        this.title.appendChild(current_month);
        this.title.appendChild(right);

        // イベント追加
        left.addEventListener('click', (evt)=> _obj.eventListener('arrow_left',evt));
        right.addEventListener('click', (evt)=> _obj.eventListener('arrow_right',evt));
        current_month.addEventListener('click', (evt)=> _obj.eventListener('change_month',evt));

    }

    /**
     * ボディを描画
     */
    _obj.drawBody = function(){
        let week = createElement('div');

        week_ja.forEach((s, i)=>{
            let className = "week-item " + week_en[i];
            week.appendChild(createElement('span', className , s));
        });

        let items_container = createElement('div');
        
        let nowDiv = createElement('div', "bq-now text-center");
        let nowSpan = createElement('span', '', '今日:');
        nowSpan.innerHTML += '<span>@@@@</span>'
        nowDiv.appendChild(nowSpan);

        _obj.body.appendChild(week);
        _obj.body.appendChild(items_container);
        _obj.body.appendChild(nowDiv);
        _obj.now = nowSpan;
        _obj.items_container = items_container;

        nowSpan.addEventListener('click', (evt)=> _obj.eventListener('now',evt));
    }

    /**
     * 年月選択エリアを描画
     */
    _obj.drawYearMonthArea = function(){

        let yearitem = createElement('div', 'year-item' , '年：');
        let year_select = createElement('select', 'year-select custom-select');
        yearitem.appendChild(year_select);

        // 1900~2100までの年を選択可能にする
        for(var y = 1900; y <= 2100; y++){
            let ja_year = moment(y.toString()).format('NNNNyo')
            let op = createElement('option', 'year-select', y + '(' + ja_year + ')');
            op.value = y;
            year_select.appendChild(op);

        }
        this.year_month.appendChild(yearitem);

        // 1~12月まで描画
        for(var m = 1;  m <= 12; m++){
            let monthitem = createElement('span', 'month-item' , m + '月');
            monthitem.dataset.date = m;
            this.year_month.appendChild(monthitem);
            monthitem.addEventListener('click', evt => _obj.eventListener('month-item', evt));
        }
    }

    /**
     * 各イベント処理を定義
     * 
     * @param {String} type 
     * @param {Event} evt 
     * @returns 
     */
    _obj.eventListener = function(type, evt) {
        let elem = evt.target;

        switch(type) {
            case 'arrow_left':
                // 前月に切替
                _obj.option.current_date.add(-1, 'M');
                _obj.drawItems();
                break;
            case 'arrow_right':
                // 翌月に切替
                _obj.option.current_date.add(1, 'M');
                _obj.drawItems();
                break;
            case 'now':
                // 現在月に切替
                _obj.option.current_date = moment(_obj.option.now);
                _obj.drawItems();
                break;
                // 年月選択エリアを表示
            case 'change_month':
                let year_month = _obj.year_month;
                if (year_month.classList.contains("hide")){
                    year_month.classList.remove('hide');
                    _obj.body.classList.add('hide');
                } else {
                    year_month.classList.add('hide');
                    _obj.body.classList.remove('hide');
                    return;
                }
                let year_select = year_month.querySelector('.year-select');
                let current_year = _obj.option.current_date.year();
                for(let op of year_select.children){
                    if (current_year == op.value) {
                        op.selected = true;
                    }
                }
                break;
                // 日付選択後に、テキストボックスに埋め込む
            case 'day-item':
                _obj.setValueToInput(elem.dataset.date, "blur")
                //_obj.option.target.value = moment(elem.dataset.date, _obj.option.format).format(_obj.option.display_format);
                _obj.option.target._datepicker.toogleShow();
                break;
                // 選択した月に切替
            case 'month-item':
                let selected_year = _obj.year_month.querySelector('.year-select').selectedOptions[0].value;
                _obj.option.current_date = moment([selected_year, elem.dataset.date, 1].join('/'), 'YYYY/MM/DD');
                _obj.year_month.classList.add('hide');
                _obj.body.classList.remove('hide');
                _obj.drawItems();
                break;
        }


    }
    
    /**
     * 日付を描画
     * 
     * @returns _obj
     */
    _obj.drawItems = function(){
        // 日付エリアをクリアする
        this.clear();
        
        let option = this.option;

        // 今日の日付
        let now_date =  option.now.format(option.format);
        // 入力した日付
        let input_date = option.input_date?.format(option.format);
        // 現在表示月の日付を取得 ⇒ 切替用
        let current_date = option.current_date;
        // 月初を取得
        let firstDate = getMonthFirstDate(current_date);
        // 月末を取得
        let lastDate = getMonthLastDate(firstDate);

        // 月初の曜日を取得
        let firstDay = firstDate.day();
        // 月末の曜日を取得
        let lastDay = lastDate.day();

        var i = 0 ;
        let end = lastDate.date() + firstDay + ( 7 - lastDay);
        let tmpDate = firstDate.add(- firstDay, 'd');
        do{
            let tmpDay = tmpDate.format(option.format);
            let className = "day-item " + week_en[tmpDate.day()];

            // 同一月でない場合
            if (tmpDate.month() != current_date.month()){
                className += " other";
            }

            // テキストボックスの値の場合
            if(tmpDay == input_date){
                className += " input-day";
            }

            // 現在日の場合
            if(tmpDay == now_date){
                className += " bq-now";
            }
            let dateSpan = createElement('span', className , tmpDate.date());
            dateSpan.dataset.date = tmpDay;

            this.items_container.appendChild(dateSpan);

            i++;
            tmpDate.add(1, 'd');
        }while(i < end - 1);

        // イベント追加
        this.items_container.querySelectorAll('.day-item').forEach(elem=>{
            elem.addEventListener('click', (evt)=> _obj.eventListener('day-item',evt));
        });

        // 現在表示月を表示
        this.title.children[1].innerHTML = current_date.format(option.month_format);
        return this;
    }

    /**
     * 現在日を描画
     * @returns 
     */
    _obj.drawNowStr = function(){
        this.now.children[0].innerHTML = _obj.option.now.format(_obj.option.now_format);
        return this;
    }

    /**
     * クリア処理
     * @returns _obj
     */
    _obj.clear = function(){
        // 日付エリアをクリアする
        this.items_container.innerHTML = "";
        return this;
    }

    /**
     * datepickerを表示にする
     * @returns _obj
     */
    _obj.show = function(){
        this.container.classList.remove('hide');
        this.year_month.classList.add('hide');
        this.body.classList.remove('hide');
        this.showed = true;
        global.addEventListener('resize', this.resize);
        global.addEventListener('click', this.outerClick);
       global.addEventListener('keyup', _obj.outerClick);
        return this;
    }

    /**
     * 指定対象外にクリックする場合、datepickerを非表示にする
     */
    _obj.outerClick = function(evt){
        let option = _obj.option;
        let canHide = (!evt.target.closest('.bq-datepicker') 
            && evt.target != option.target 
            && evt.target != option.target.parentElement
            && evt.target != option.show_button
            && evt.target.closest('.datepicker-button') != option.show_button
            ) || (evt.target == option.target && option.target.classList.contains('hide'));
        if(evt.type == "keyup"){
            console.log(evt.type);
        }
        if(canHide){
            option.target._datepicker.hide();
            global.removeEventListener('click', _obj.outerClick);
            global.removeEventListener('keyup', _obj.outerClick);
        }
    }

    /**
     * datepickerを非表示にする
     * @returns _obj
     */
    _obj.hide = function(){
        this.showed = false;
        this.container.classList.add('hide');
        global.removeEventListener('resize', this.resize);
        return _obj;
    }

    /**
     * datepickerの表示位置をリサイズする
     * @returns _obj
     */
    _obj.resize = function(type){
        
        let target = _obj.option.target;
        let rect = target.getBoundingClientRect();
        if(target.classList.contains('hide'))rect = target.display_elem.getBoundingClientRect();

        let _height = _obj.container.offsetHeight;
        let _width = _obj.container.offsetWidth;

        let body_height = document.body.clientHeight;
        let body_width = document.body.clientWidth;

        let elemtop = rect.top + window.pageYOffset;
        let elemright = rect.right + window.pageXOffset;

        let elemleft = rect.left + window.pageXOffset;
        let elembotom = rect.bottom + window.pageYOffset;

        let top = elembotom + 2;
        let left = elemleft;

        if (top + _height > body_height) top = elemtop - _height - 2;
        if (left + _width > body_width) left = body_width - _width;
        
        // if(type == "y"){
        //     _obj.container.style.top = top + "px";
        // } else{
            _obj.container.style.top = top + "px";
            _obj.container.style.left = left + "px";
        // }
        return _obj;
    }

    
    /**
     * エレメント作成
     * 
     * @param tag タグ名
     * @param className クラスネーム
     * @param text 内容
     */
    createElement = (tag, className = '', text = '') => {
        let element = document.createElement(tag);
        className && (className.split(' ').forEach(cls => element.classList.add(cls)));
        text && (element.innerText = text);
        return element;
    }

    /**
     * 月初を取得
     */
    getMonthFirstDate = (date)=>{
        let month = [date.year(), date.month() + 1 , 1].join('/');
        return moment(month, "YYYY/MM/DD");
    }

    /**
     * 月末を取得
     * @returns 
     */
    getMonthLastDate = (date) => {
        let ret = new moment(date);
        return ret.add(1, 'M').add(-1,'d');
    }

    /**
     * 日付をテキストボックスに写す
     * @returns 
     */
    _obj.setValueToInput = function(datestr, flag){
        let target = _obj.option.target;

        let date =  parseToMoment(datestr);
        if(date && date.isValid()){
            let format = _obj.option.format
            if(flag == "input"){
                format = _obj.option.edit_format;
            } 
            target.value = date.format(format);
            target.display_elem.innerText = date.format(_obj.option.display_format);
            return date;
        } else {
            target.value = "";
            target.display_elem.innerText = "";
        }
    }

    /**
     * 文字列を日付に変換<br>
     * 文字列に英字存在する場合、nullを返却
     * @param {string} str 
     * @returns 日付
     */
    function parseToMoment(str){
        //和暦の日付を「,」で分割
        if (str.match(/^[A-Za-z]\d+$/)) str = [str.slice(0,-4), str.slice(-4)].join(',');
        else if (str.match(/[A-Za-z]/)) return null;
        return moment(str, parse_format);
    }

    /**
     * datepickerコントロール対象
     * 
     * @param {HTMLElement} target 
     * @param {*} option 
     * @param {*} obj 
     */
    var datepicker = function(target, option, obj){
        // 表示ボタン
        option.show_button = target.parentElement.querySelector(".datepicker-button")
        option.show_button.addEventListener('click', () => target._datepicker.toogleShow());
        option.target = target;
        this.option = option;
        this.obj = obj;

        // フォーカスイベント
        target.display_elem.addEventListener('focus', (evt) => {
            //_obj.showed && _obj.outerClick(evt);
            
            target.classList.remove("hide");
            target.focus();
            target.display_elem.classList.add("hide");

            if(!target.value)return;
            _obj.setValueToInput(target.value, 'input')
        });
        
        // フォーカスアウトイベント
        target.addEventListener('blur', (evt) => {
            //_obj.showed && _obj.outerClick(evt);
            target.display_elem.classList.remove("hide");
            target.classList.add("hide");

            if(!target.value)return;
            _obj.setValueToInput(target.value, 'blur')
        });

        // インプットイベント
        target.addEventListener('input', (evt) => {
            let dateStr = target.value;
            if(!dateStr || !target._datepicker.isShow)return;
            let date =  parseToMoment(dateStr, parse_format);
            if(date && date.isValid()){

                target.display_elem.innerText = date.format(_obj.option.display_format);
                option.input_date = moment(date);
                option.current_date = moment(date);
                target._datepicker.obj.drawItems().resize();
            }
        });
    };



    /**
     * datepickerを表示/非表示に切り替わる
     */
    datepicker.prototype.toogleShow = function(){
        if (this.isShow && this.option == this.obj.option) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * datepickerを表示にする
     */
    datepicker.prototype.hide = function(){
        this.isShow = false;
        this.obj.hide();
    }

    /**
     * datepickerを非表示にする
     */
    datepicker.prototype.show = function(){
        this.isShow = true;

        this.option.current_date = moment(this.option.now);
        // テキストボックスの値を取得する
        if(this.option.target.value) {
            this.option.input_date = moment(this.option.target.value, parse_format);
            this.option.current_date = moment(this.option.input_date);
        }
        this.obj.option = this.option;
        this.obj.show().drawNowStr().drawItems().resize();
    }

    // 初期化処理を実行
    _obj.init();

    /**
     * 日付ピッカ対象を元素にバントする
     * 
     * @param {*} opt 
     * @returns datepickerコントロール対象
     */
     HTMLInputElement.prototype.datepicker = function(opt){
        let target = this;
        let option = Object.assign({}, __option);

        
        if(!target._datepicker){

            // データセットからフォーマットを設定
            target.dataset.edit_format && (option.edit_format = target.dataset.edit_format);
            target.dataset.display_format && (option.display_format = target.dataset.display_format);
            target.dataset.month_format && (option.month_format = target.dataset.month_format);

            // パラメータ存在する場合
            // パラメータの設定を取得する。
            opt && Object.assign(option, opt);

            let display_elem = createElement("span", target.classList.toString() + ' bq-datepicker', target.value);
            display_elem.contentEditable = true;
            target.parentElement.insertBefore(display_elem, target.nextSibling);
            target.display_elem = display_elem;
            target.classList.add("hide");
            let _datepicker = new datepicker(target, option, _obj);
            target._datepicker = _datepicker;
        } else {
            // パラメータ存在する場合
            // パラメータの設定を取得する。
            opt && Object.assign(target._datepicker.option, opt);
            _obj.option = target._datepicker.option;
            _obj.setValueToInput(target.value, "blur")
        }

        return target._datepicker;

    }

})(window, function(){});
