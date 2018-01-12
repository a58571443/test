
/**
 * @author:wgxu
 * @date:2016.01.13
 * @update:2016.01.13
 * @description  requirejs的配置
 */

var requireConfig = {
  /**
   * bserUrl：用来配置模块根目录，可以是绝对路径也可以是相对路径
   * 相对路径指的是以引入requireJS页面为参考点 这里使用的就是相对路径
   */
  baseUrl: "../js",

  /**
   * paths：用来映射不存在根路径下面的模块路径
   */
  paths: {
    jquery: 'lib/jquery.min',
    doT: 'lib/doT',
    card: 'lib/card',
    fly: 'lib/fly',
    common: 'lib/common',
    iscroll: 'plugins/iscroll',
    iflyMobileSlider: 'plugins/ifly-mobile-slider',
    pullToRefresh: 'plugins/pull-to-refresh',
    iflyTabSlider: 'plugins/ifly-tab-slider',
    iflyLengthwaysSlider: 'plugins/ifly-lengthways-slider',
    caculRem: 'lib/rem-cacul',
    lazyLoad: 'plugins/lazyLoad',
    iflyAppSlider: 'plugins/ifly-app-slider',
    swiper: 'plugins/swiper/swiper.min',
    banner:'app/banner'
  },

  shim: {
    'iflyMobileSlider': {
      deps: ['jquery'],
      exports: 'iflyMobileSlider'
    },
    'pullToRefresh': {
      deps: ['lazyLoad'],
      exports: 'pullToRefresh'
    },
    'iflyTabSlider': {
      deps: ['jquery'],
      exports: 'iflyTabSlider'
    },
    'iflyAppSlider': {
      deps: ['jquery'],
      exports: 'iflyAppSlider'
    }
  }
};
