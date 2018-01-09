require.config(requireConfig);
require([
    'jquery',
    'doT',
    'common'
  ],
  function(jquery, doT,common) {

    var creatPage = {
      _getRequestData: {
        _requestAppData: function() {


        },
        _requestHotData: function() {

        }
      },
      //页面事件
      addEvent: function() {
          common.navSilde();
        
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
