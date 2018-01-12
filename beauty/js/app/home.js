require.config(requireConfig);
require([
    'jquery',
    'doT',
    'swiper',
    'common',
    'lazyLoad',
    'banner'
  ],
  function(jquery, doT, swiper, common, lazyLoad, banner) {
    var type = common.getQueryString(location.href).type;
    var creatPage = {
      _getRequestData: {
        _requestPicData: function() {

        },

        _requestHotData: function() {

        }
      },
      //页面事件
      addEvent: function() {
        creatPage._eventHandle._swiper();
        common.navSilde();
        $(document).off('.go-detail').on('click', '.go-detail', function() {
          window.location.href = 'html/detail.html?type=' + type;
        });


      },
      initData: function() {
        creatPage._getRequestData._requestPicData();
      },

      _eventHandle: {
        _swiper: function() {
          var mySwiper = new Swiper('.swiper-container', {
            autoplay: 5000, //可选选项，自动滑动
            pagination: '.swiper-pagination'
          });
        },
      },
      //初始化
      init: function() {
        creatPage.initData();
        creatPage.addEvent();
        // lazyLoad.init();

      }
    };
    creatPage.init();
  }
);
