document.addEventListener('DOMContentLoaded', function () {
    const main = new Main();
});
//この記載について、{once: false} は、一度スクロールを実行すると終了してしまうため、２回目以降も有効になるようにオプションとして記述している。

class Main {
    constructor() {
        this.header = document.querySelector('.header');
        this.sides = document.querySelectorAll('.side');
        this._observers = [];
        this._init();
    }

    set observers(val) {
        this._observers.push(val);
    }// observersメソッドに渡ってきた引数（val）を _observersの配列に対してpushで格納していく事になる。

    get observers() {
        return this._observers;
    }// 値を取得する為のメソッド、戻したい値をreturnする。今回は、_observersを戻す。

    _init() {
        new MobileMenu();
        this.hero = new HeroSlider('.swiper-container');
        Pace.on('done', this._paceDone.bind(this));//この記述をすることで、ロードが終わった後にアニメーションを開始する。
    }

    _paceDone() {
        this._scrollInit();
    }//この記述をすることで、ロードが終わった後にアニメーションを開始する。

    _inviewAnimation(el, inview) {
        if (inview) {
            el.classList.add('inview');
        }else {
            el.classList.remove('inview');
        }
    }

    _navAnimation(el, inview) {
        if (inview) {
            this.header.classList.remove('triggerad');//画面の中に入ってきたらtriggeradというクラスを削除する処理を行う
        }else {
            this.header.classList.add('triggerad');//画面の外に出たらtriggeradというクラスをつける処理を行う
        }
    }

    _sideAnimation(el, inview) {
        if (inview) {
            this.sides.forEach(side => side.classList.add('inview'));
        }else {
            this.sides.forEach(side => side.classList.remove('inview'));
        }
    }

    _textAnimation(el, inview) {
        if(inview) {
            const ta = new TweenTextAnimation(el);
            ta.animate();
        }
    } 

    _toggleSlideAnimation(el, inview) {
        if (inview) {
            this.hero.start();//画面内に入って来たらアニメーションを開始させる。
        }else {
            this.hero.stop();//画面外に出たらアニメーションを止める。
        }
    }

    _destroyObservers() {
        this.observers.forEach(ob => {
            ob.destroy();
        });
    }

    destroy() {
        this._destroyObservers();
    }

    _scrollInit() {
        this.observers = new ScrollObserver('.nav-trigger', this._navAnimation.bind(this), {once: false});
        this.observers = new ScrollObserver('.cover-slide', this._inviewAnimation);
        this.observers = new ScrollObserver('.appear', this._inviewAnimation);
        this.observers = new ScrollObserver('.tween-animate-title', this._textAnimation), {once: false, rootMargin: "-200px 0px"};
        this.observers = new ScrollObserver('.swiper-container', this._toggleSlideAnimation.bind(this), {once: false});
        this.observers = new ScrollObserver('#main-content', this._sideAnimation.bind(this), {once: false, rootMargin: "-300px 0px"});
    }
}

// .bind(this) は、定義したメソッド内でthisを使っている時につける。
// {once: false} は、継続的に監視を続けるようにする為の記述。
//  {once: false, rootMargin: "-200px 0px"} rootMarginを設定することでアニメーションを発火させるタイミングを遅らせて見栄えを読みすることができる。