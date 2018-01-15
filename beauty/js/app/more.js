require.config(requireConfig);
require([
    'jquery',
    'doT',
    'common',
    'iscroll',
    'pullToRefresh'
  ],
  function(jquery, doT, common, iscroll, pullToRefresh) {
    var page = 1,
      params = common.getQueryString(location.href);
    $('.site-title').html(params.name);
    var creatPage = {
      _getRequestData: {
        _requestAppData: function() {
          var para = {
            url: '/api/categoy/list',
            data: {
              cid: params.id,
              page: page,
              pageSize: 10
            },
            type: 'get',
            success: function(res) {
              var data = res.message.data;
              if (data && data.length) {
                if (data.length < 10) {
                  $('.pullUp').hide();
                }
                var requestTmpl = doT.template($('#list').text());
                $('.more-ul').append(requestTmpl(data));
              } else {
                refresher.onEmptyCompeted();
              }
              page++;

              wrapper.refresh();
            }
          }
          common.ajax(para);
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
        },
        _pulltoDo: function() {
          //初始化上拉下拉操作
          refresher.init({
            id: "wrapper",
            pullUpAction: creatPage._eventHandle.getMore
          });
        },
      },
      //页面事件
      addEvent: function() {
        common.navSilde();
        creatPage._getRequestData._pulltoDo();
        $(document).off('.go-detail').on('click', '.go-detail', function() {
          var id = $(this).data('id');
          window.location.href = 'detail.html?id=' + id + '&page=1';
        });

      },
      initData: function() {
        creatPage._getRequestData._requestAppData();
        // creatPage._getRequestData._requestHotData();
      },

      _eventHandle: {
        getMore: function() {
          creatPage._getRequestData._requestAppData();
        }
      },
      //初始化
      init: function() {
        creatPage.initData();
        creatPage.addEvent();
      }
    };
    creatPage.init();
  }
);
