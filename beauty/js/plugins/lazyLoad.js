;
(function(window) {
  var oImg,
    item,
    lazyLoad = {};

  var css = (function() {
    var doEle = document.documentElement,
      doBody = document.body,
      elementScrollLeft,
      elementScrollTop,
      utils,
      offsetLeft,
      offsetTop,
      offsetParent;

    utils = {

      // 获取页面的可视宽度和高度
      getAvailPage: function() {
        if (document.compatMode === 'BackCompat') { // ie6下的计算方法
          return {
            width: doBody.clientWidth,
            height: doBody.clientHeight
          };
        } else {
          return {
            width: doEle.clientWidth,
            height: doEle.clientHeight
          };
        }
      },

      // 获取页面的占位宽度和高度
      getAllPage: function() {
        if (document.compatMode === 'BackCompat') {
          return {
            width: Math.max(doBody.clientWidth, doBody.scrollWidth),
            height: Math.max(doBody.clientHeight, doBody.scrollHeight)
          };
        } else {
          return {
            width: Math.max(doEle.clientWidth, doEle.scrollWidth),
            height: Math.max(doEle.clientHeight, doEle.scrollHeight)
          };
        }
      },

      // 获取元素的绝对位置
      getOffset: function(element) {

        offsetLeft = element.offsetLeft;
        offsetTop = element.offsetTop;
        offsetParent = element.offsetParent;

        while (offsetParent) {
          offsetLeft += offsetParent.offsetLeft;
          offsetTop += offsetParent.offsetTop;
          offsetParent = offsetParent.offsetParent;
        }

        return {
          top: offsetTop,
          left: offsetLeft
        };
      },

      // 获取元素的相对位置
      getOffsetRelative: function(element) {

        doScrollLeft = doEle.scrollLeft || window.pageXOffset || doBody.scrollLeft;
        doScrollTop = doEle.scrollTop || window.pageYOffset || doBody.scrollTop;　

        return {
          top: this.getOffset(element).top - doScrollTop,
          left: this.getOffset(element).left - doScrollLeft
        };
      },

      // 是否可见
      isVisible: function(element, y) {
        var left = this.getOffset(element).left,
          top = this.getOffset(element).top + y,
          width = element.offsetWidth,
          height = element.offsetHeight,
          docuHeight = this.getAvailPage().height,
          docuWidth = this.getAvailPage().width,
          docuLeft = doEle.scrollLeft || window.pageXOffset || doBody.scrollLeft,
          docuTop = doEle.scrollTop || window.pageYOffset || doBody.scrollTop;
        if (top + height < docuTop || top > docuTop + docuHeight || left > docuLeft + docuWidth || left + width < docuLeft) {
          return false;
        } else {
          return true;
        }
      }

    };

    return utils;

  })();

  lazyLoad.init = function(pullDownOffset, e) {
    var y = e ? e.y - pullDownOffset : -pullDownOffset;

    oImg = document.getElementsByTagName('img');

    for (var i = 0; i < oImg.length; i++) {
      item = oImg[i];
      if (css.isVisible(item, y) && item.getAttribute('data-load') !== 'true') {
        (function(item) {
          // if(typeof($(item).attr("data-src"))!=="undefined"){
          if (typeof(item.getAttribute("data-src")) !== "undefined") {
            var img = new Image(),

              src = item.getAttribute('data-src');
            if (src) {
              img.src = src;
            }
            img.onload = function() {
              item.setAttribute('src', src);
              item.setAttribute('data-load', 'true');
            };
            img.onerror = function() {
              // console.log(3);
            };

          }
        })(item);
      }

    }
  };

  lazyLoad.init();

  window.lazyLoad = lazyLoad;

  return lazyLoad;

})(window);
