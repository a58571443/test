require.config(requireConfig);
require([
    'jquery',
    'doT',
    'common'
  ],
  function(jquery, doT, common) {

    var creatPage = {
      _getRequestData: {
        _requestAppData: function() {
          var total;
          var params = common.getQueryString(location.href);

          var para = {
            url: '/api/info',
            data: {
              id: params.id,
              page: params.page
            },
            type: 'get',
            success: function(res) {
              var data = res.message;
              total = data.total;
              var requestTmpl = doT.template($('#list').text());
              $('#info').append(requestTmpl(data));
              $('#current').html(params.page);
              $('#all').html(data.total);
              $('.mint-indicator').hide();
              if (params.page <= 1) {
                $('.preview-page').hide()
              } else {
                $('.preview-page').show()
              }

              if (parseInt(params.page) >= parseInt(data.total)) {
                $('.next-page').hide()
              } else {
                $('.next-page').show()
              }


            }
          }
          common.ajax(para);


          $('.preview-page').click(function() {
            var page = parseInt(params.page) - 1;
            if (page >= 1) {
              location.href = 'detail.html?id=' + params.id + '&page=' + page;
            }

          });

          $('.next-page').click(function() {
            var page = parseInt(params.page) + 1;
            if (total && page <= total) {
              location.href = 'detail.html?id=' + params.id + '&page=' + page;
            }
          });

        },
        _requestHotData: function() {
          var para = {
            url: '/api/recommend',
            type: 'get',
            success: function(res) {
              var data = res.message;
              var requestTmpl = doT.template($('#nav').text());
              $('#recommend').append(requestTmpl(data));
            }
          }
          common.ajax(para);
        }
      },
      //页面事件
      addEvent: function() {
        // common.navSilde();

      },
      initData: function() {
        creatPage._getRequestData._requestAppData();
        creatPage._getRequestData._requestHotData();
      },

      _eventHandle: {},
      //初始化
      init: function() {
        creatPage.initData();
        creatPage.addEvent();
      }
    };
    creatPage.init();
  }
);
