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
          var para = {
            url: '/api/category',
            type: 'get',
            success: function(res) {
              var data = res.message;
              var requestTmpl = doT.template($('#list').text());
              $('#nav_ul').append(requestTmpl(data));
            }
          }
          common.ajax(para);
        },

        _requestHotData: function() {
          var para = {
            url: '/api/index',
            type: 'get',
            success: function(res) {
              var data = res.message.carousel;
              var requestTmpl = doT.template($('#picture').text());
              $('#carousel').append(requestTmpl(data));
              creatPage._eventHandle._swiper();

              var categoryData = res.message.categoryData;
              var requestTmplpic = doT.template($('#container').text());
              $('.main-container').append(requestTmplpic(categoryData));
              window.lazyLoad.init();
              $('.mint-indicator').hide();
            }
          }
          common.ajax(para);
        }
      },
      //页面事件
      addEvent: function() {

        common.navSilde();
        // $(document).off('.go-detail').on('click', '.go-detail', function() {
        //   var id = $(this).data('id');
        //   window.location.href = 'html/detail.html?id=' + id + '&page=1';
        // });

        $(document).off('.see-more').on('click', '.see-more', function() {
          var id = $(this).data('id');
          var name = $(this).data('name');
          window.location.href = 'html/more.html?id=' + id + '&name=' + name;
        });


      },
      initData: function() {
        creatPage._getRequestData._requestPicData();
        creatPage._getRequestData._requestHotData();
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
