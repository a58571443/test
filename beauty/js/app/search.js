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
                }
              }
            }
            common.ajax(para);
          }




        });
        // $('.clear-history').click(function() {
        //   $('#result').empty();
        //   localStorage.setItem('searchHstory', '');
        // });
        $('.goBack').click(function() {
          window.history.go(-1);
        });
        // $(document).off('.go-detail').on('click', '.go-detail', function() {
        //   var id = $(this).data('id');
        //   window.location.href = 'detail.html?id=' + id + '&page=1';
        // });
      },
      initData: function() {
        // creatPage._getRequestData._requestAppData();
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
