require.config(requireConfig);
require([
    'jquery',
    'doT',
    'caculRem',
    'common'
  ],
  function(jquery, doT, caculRem, common) {
    var creatPage = {
      _getRequestData: {
        _requestAppData: function() {
          var para = {
            url: '/api/keyword',
            type: 'get',
            data: {},
            success: function(res) {
              var data = res.message;
              if (data && data.length) {
                var requestTmpl = doT.template($('#keywords').text());
                $('#recommend_ul').html(requestTmpl(data));
              }
            }
          }
          common.ajax(para);

        },
        _requestHotData: function() {

        }
      },
      //页面事件
      addEvent: function() {
        $('#search').click(function() {
          var val = $('.search-input').val();
          if (val) {
            var para = {
              url: '/api/search',
              type: 'get',
              data: {
                key: val
              },
              success: function(res) {
                var data = res.message;
                if (data && data.length) {
                  var requestTmpl = doT.template($('#searchList').text());
                  $('#result_ul').html(requestTmpl(data));
                } else {
                  common.toast('暂无内容哦~');
                }
              }
            }
            common.ajax(para);
          }
        });
        $('.goBack').click(function() {
          window.history.go(-1);
        });
        $(document).off('#recommend_ul li').on('touchend', '#recommend_ul li', function() {
          var val = $(this).text();
          $('.search-input').val(val);
          $('#search').trigger('click')
          $('#recommend_ul').hide();
        });
        $('.search-input').on('change', function() {
          var val = $(this).text();
          if (!val) {
            $('#result_ul').empty();
            $('#recommend_ul').show();
          }
        });
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
