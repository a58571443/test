require.config(requireConfig);
require([
    'jquery',
    'doT',
    'fly',
    'caculRem',
  ],
  function(jquery, doT, fly, caculRem) {
    var creatPage = {
      _getRequestData: {
        _requestAppData: function() {


        },
        _requestHotData: function() {

        }
      },
      //页面事件
      addEvent: function() {
        if (!!localStorage.getItem('searchHstory')) {
          var arr = JSON.parse(localStorage.getItem('searchHstory'));
          if (arr && arr.length) {
            var requestTmpl = doT.template($('#list').text());
            $('#result').append(requestTmpl(arr));
          }
        }
        $('#search').click(function() {
          var val = $('.search-input').val();
          if (val) {
            var arr = JSON.parse(localStorage.getItem('searchHstory')) || [];
            arr.push(val);
            localStorage.setItem('searchHstory', JSON.stringify(val));
          }

        });
        $('.clear-history').click(function() {
          $('#result').empty();
          localStorage.setItem('searchHstory', '');
        });
        $('.goBack').click(function() {
          window.history.go(-1);
        });
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
