﻿
/**
 * $.iflyTabSlider
 * @charset utf-8
 * @extends jquery
 * @fileOverview 创建一个焦点轮播插件，兼容PC端和移动端
 * @author xysheng
 * @version 1.0
 * @date 2016-02-18
 * @example
 * $(".tab-slider").iflyTabSlider();
 */
(function($) {
    $.fn.iflyTabSlider = function() {
        return this.each(function() {
            var _this = $(this),
                startX = 0,
                startY = 0, //触摸开始时手势横纵坐标 
                temPos, //滚动元素当前位置
                iCurr = 0, //当前滚动屏幕数
                timer = null, //计时器
                oMover = $(".tab-cont-ul", _this), //滚动元素
                oLi = $(".tab-cont-li", oMover), //滚动单元
                num = oLi.length, //滚动屏幕数
                oPosition = {}, //触点位置
                moveWidth = parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3)) > 4.4 ? window.screen.width * window.devicePixelRatio : window.screen.width,
                oMoverWidth = 100 * num + '%';
            //初始化主体样式
            oMover.css({
                width: 100 * num + '%'
            });
            oLi.css({
                width: 100 / num + '%'
            });
            var oFocus = $(".tab-slider-head li");
            oFocus.first().addClass("tab-current");
            bindTochuEvent();


            //代码实现：把子类高度赋予父类高度
            _this.parents('.slide').height(_this.height());
            //运动效果
            function doMove() {
                iCurr = iCurr >= num - 1 ? 0 : iCurr + 1;
                doAnimate(-moveWidth * iCurr);
                oFocus.eq(iCurr).addClass("tab-current").siblings().removeClass("tab-current");
                
            }
            //绑定触摸事件
            function bindTochuEvent() {
                oMover.get(0).addEventListener('touchstart', touchStartFunc, false);
                oMover.get(0).addEventListener('touchmove', touchMoveFunc, false);
                oMover.get(0).addEventListener('touchend', touchEndFunc, false);
                $('.tab').find(".head-item").on(
                    'click',
                    function() {
                        iCurr = $(this).index();
                        oFocus.eq(iCurr).addClass("tab-current").siblings().removeClass("tab-current");
                        /*document.getElementById("slider_tab").style.transform = "translate(" + (-moveWidth * iCurr)+ "px,0px) scale(1) translateZ(0px)";*/
                        oMover.css({
                            left: (-moveWidth * iCurr)
                        });
                        var _top=$('.pullDown').height();
                        lazyLoad.init(_top);
                    });
                
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
                e.preventDefault();
                clearInterval(timer);
                touchPos(e);
                var moveX = oPosition.x - startX;
                var moveY = oPosition.y - startY;
                if (Math.abs(moveY) < Math.abs(moveX)) {
                    /*if (temPos + moveX > 0) {
                        oMover.css({
                            left: 0
                        });
                    } else if (Math.abs(temPos + moveX) > moveWidth * (num - 1)) {
                        oMover.css({
                            left: -moveWidth * (num - 1)
                        });
                    } else {
                        oMover.css({
                            left: temPos + moveX
                        });
                    }*/

                    // if (temPos + moveX > 0) {
                    //     document.getElementById("slider_tab").style.transform = "translate(0px,0px) scale(1) translateZ(0px)";
                    // } else if (Math.abs(temPos + moveX) > moveWidth * (num - 1)) {
                    //     document.getElementById("slider_tab").style.transform = "translate(" + (-moveWidth * (num - 1)) + "px,0px) scale(1) translateZ(0px)";
                    // } else {
                    //     document.getElementById("slider_tab").style.transform = "translate(" + (temPos + moveX) + "px,0px) scale(1) translateZ(0px)";
                    // }
                }
            }
            //触摸结束
            function touchEndFunc(e) {
                e.preventDefault();
                touchPos(e);
                var moveX = oPosition.x - startX;
                var moveY = oPosition.y - startY;
                if (Math.abs(moveY) < Math.abs(moveX)) {
                    if (moveX > 0) {
                        iCurr--;
                        if (iCurr >= 0) {
                            var moveX = iCurr * moveWidth;
                            if (iCurr >= 0) {
                                doAnimate(-moveWidth * iCurr);
                                oFocus.eq(iCurr).addClass("tab-current").siblings().removeClass("tab-current");
                                // var _top=$('.pullDown').height();
                                // lazyLoad.init(_top);
                            }

                        } else {
                            if (iCurr >= 0) {
                                iCurr++;
                                doMove();
                            }
                            iCurr = 0;
                        }
                    } else {
                        iCurr++;
                        if (iCurr < num && iCurr >= 0) {
                            var moveX = iCurr * moveWidth;
                            if (iCurr < num) {
                                iCurr--;
                                doMove();
                            }
                        } else {
                            iCurr = num - 1;
                            if (iCurr < num) {
                                iCurr--;
                                doMove();
                            }
                        }
                    }
                    oFocus.eq(iCurr).addClass("tab-current").siblings().removeClass("tab-current");
                    // var _top=$('.pullDown').height();
                    //     lazyLoad.init(_top);
                }
            }
            //动画效果
            function doAnimate(iTarget) {
                /*document.getElementById("slider_tab").style.transform = "translate(" + iTarget + "px,0px) scale(1) translateZ(0px)";*/
                // oMover.animate({
                //     left: iTarget
                // }, 30);
                oMover.css('left',iTarget);
                var _top=$('.pullDown').height();
                lazyLoad.init(_top);
            }
        });
    }
})(jQuery);