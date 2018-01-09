/**
 * $.iflyMobileSlider
 * @charset utf-8
 * @extends zepto
 * @fileOverview 创建一个焦点轮播插件，兼容PC端和移动端
 * @author xysheng
 * @version 1.0
 * @date 2015-09-12
 * @example
 * $(".container").iflyMobileSlider();
 */
;
(function($) {
    $.fn.iflyMobileSlider = function(settings) {
        var defaultSettings = {
            during: 3000, //间隔时间
            speed: 30, //滑动速度
            autoplay: true,
            destory: false
        }
        settings = $.extend({}, defaultSettings, settings);
        return this.each(function() {
            var _this = $(this),
                s = settings,
                startX = 0,
                startY = 0, //触摸开始时手势横纵坐标 
                temPos, //滚动元素当前位置
                iCurr = 0, //当前滚动屏幕数
                timer = null, //计时器
                oMover = $("ul", _this), //滚动元素
                oLi = $("li", oMover), //滚动单元
                num = oLi.length, //滚动屏幕数
                oPosition = {}, //触点位置
                moveWidth = parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3)) > 4.4 ? window.screen.width * window.devicePixelRatio : window.screen.width, //滚动宽度
                oMoverWidth = 100 * num + '%';
            //初始化主体样式
            oMover.css({
                width: 100 * num + '%'
            });
            oLi.css({
                width: 100 / num + '%'
            });
            //初始化焦点容器及按钮
            _this.append('<div class="focus"><div class="focus-inner"></div></div>');
            var oFocusContainer = $(".focus");
            if (num > 1) {
                for (var i = 0; i < num; i++) {
                    $("div", oFocusContainer).append("<span></span>");
                }
                var oFocus = $("span", oFocusContainer);
                oFocus.first().addClass("current");
                bindTochuEvent();
            }

            //代码实现：把子类高度赋予父类高度
            _this.height(oMover.height());


            //页面加载完毕BANNER自动滚动
            if (s.autoplay&& s.destory != true) {
                timer = setInterval(doMove, s.during);
            }
            //自动运动
            function autoMove() {
                    if (timer) {
                        clearInterval(timer);
                    }
                    timer = setInterval(doMove, s.during);
                }
                //停止自动运动
            function stopMove() {
                    if (timer) clearInterval(timer);
                }
                //运动效果
            function doMove() {
                    iCurr = iCurr >= num - 1 ? 0 : iCurr + 1;
                    doAnimate(-moveWidth * iCurr);
                    oFocus.eq(iCurr).addClass("current").siblings().removeClass("current");

                }
                //绑定触摸事件
            function bindTochuEvent() {
                    oMover.get(0).addEventListener('touchstart', touchStartFunc, false);
                    oMover.get(0).addEventListener('touchmove', touchMoveFunc, false);
                    oMover.get(0).addEventListener('touchend', touchEndFunc, false);
                }
                //获取触点位置
            function touchPos(e) {
                    var touches = e.changedTouches,
                        l = touches.length,
                        touch, tagX, tagY;
                    for (var i = 0; i < l; i++) {
                        touch = touches[i];
                        tagX = touch.clientX;
                        tagY = touch.clientY;
                    }
                    oPosition.x = tagX;
                    oPosition.y = tagY;
                    return oPosition;
                }
                //触摸开始
            function touchStartFunc(e) {
                    touchPos(e);
                    startX = oPosition.x;
                    startY = oPosition.y;
                    temPos = oMover.position().left;
                }
                //触摸移动 
            function touchMoveFunc(e) {
                    clearInterval(timer);
                    touchPos(e);
                    var moveX = oPosition.x - startX;
                    var moveY = oPosition.y - startY;
                    if (Math.abs(moveY) < Math.abs(moveX)) {
                        e.preventDefault();
                        /*oMover.css({
                            left: temPos + moveX > 0 ? 0 : (Math.abs(temPos + moveX) < moveWidth * (num - 1) ? -moveWidth * (num - 1) : temPos + moveX)
                        });*/
                        if (s.destory != true) {
                            if (temPos + moveX > 0) {
                                oMover.css({
                                    left: 0
                                });
                            } else if (Math.abs(temPos + moveX) > moveWidth * (num - 1)) {
                                oMover.css({
                                    left: -moveWidth * (num - 1)
                                });
                                // lazyLoad.init(0 ,false,-moveWidth * iCurr);
                            } else {
                                oMover.css({
                                    left: temPos + moveX
                                });
                            }
                        }

                    }
                }
                //触摸结束
            function touchEndFunc(e) {
                    touchPos(e);
                    var moveX = oPosition.x - startX;
                    var moveY = oPosition.y - startY;
                    if (Math.abs(moveY) < Math.abs(moveX)) {
                        if (moveX > 0) {
                            iCurr--;
                            if (iCurr >= 0) {
                                var moveX = iCurr * moveWidth;
                                if (s.autoplay && s.destory != true) {
                                    doAnimate(-moveX, autoMove);
                                } else {
                                    if (iCurr >= 0) {
                                        doAnimate(-moveWidth * iCurr);
                                        oFocus.eq(iCurr).addClass("current").siblings().removeClass("current");
                                        lazyLoad.init(0, false, -moveWidth * iCurr);
                                    }
                                }

                            } else {
                                if (s.autoplay && s.destory != true) {
                                    doAnimate(0, autoMove);
                                } else {
                                    if (iCurr >= 0) {
                                        iCurr++;
                                        doMove();
                                    }
                                }
                                iCurr = 0;
                            }
                        } else {
                            iCurr++;
                            if (iCurr < num && iCurr >= 0) {
                                var moveX = iCurr * moveWidth;
                                if (s.autoplay && s.destory != true) {
                                    doAnimate(-moveX, autoMove);
                                } else {
                                    if (iCurr < num) {
                                        iCurr--;
                                        doMove();
                                    }
                                }
                            } else {
                                iCurr = num - 1;
                                if (s.autoplay && s.destory != true) {
                                    doAnimate(-(num - 1) * moveWidth, autoMove);
                                } else {
                                    if (iCurr < num) {
                                        iCurr--;
                                        doMove();
                                    }
                                }

                            }
                        }
                        oFocus.eq(iCurr).addClass("current").siblings().removeClass("current");
                        lazyLoad.init(0, false, -moveWidth * iCurr);
                        _this.data('index', iCurr);

                    }
                }
                //动画效果
            function doAnimate(iTarget, fn) {
                oMover.animate({
                    left: iTarget
                }, _this.speed, function() {
                    fn && fn();
                });
            }
        });
    }
})(jQuery);