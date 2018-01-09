/**
 * @author:xysheng
 * @date:2015.09.26
 * @update:2015.11.16
 * @description 常用操作
 */
define(function(require) {
  var common = {
    navSilde: function() {
      var type = common.getQueryString(location.href).type;
      if (type) {
        switch (parseInt(type)) {
          case 1:
            $('#slide-menu li').eq(0).siblings().removeClass('active');
            $('#slide-menu li').eq(0).addClass('active');
            break;
          case 2:
            $('#slide-menu li').eq(1).siblings().removeClass('active');
            $('#slide-menu li').eq(1).addClass('active');
            break;
          default:
            $('#slide-menu li').eq(0).siblings().removeClass('active');
            $('#slide-menu li').eq(0).addClass('active');
            break;
        }
      }
      $('.list').click(function(e) {
        $('body').addClass('menu-active menu-activing');
        $('#slide-menu').addClass('db');
        $('.menu-active #page').on('click', function() {

        })
      });
      $(document).off('.view-window').on('click', '.view-window', function() {
        $('body').removeClass('menu-active menu-activing');
        setTimeout(function() {
          $('#slide-menu').removeClass('db');
        }, 300);

      })
    },
    isArray: function(o) {
      return Object.prototype.toString.call(o) === '[object Array]';
    },
    /**
     * 将14位数字字符串转日期格式
     * @param str 14位字符串
     * @return 日期
     */
    dateFormat: function(str) {
      if (str != undefined && str != "") {
        var st = str.substring(0, 4) + "/" + str.substring(
            4, 6) + "/" + str.substring(6, 8) + " " +
          str.substring(8, 10) + ":" + str.substring(
            10, 12) + ":" + str.substring(12, 14);
        return new Date(st);
      }
    },

    /**
     * 将日期格式转成12位数字字符串
     * @param str 日期
     * @return 字符串
     */
    timeForData: function(time) {
      var year = time.getFullYear().toString();
      var month = (time.getMonth() + 1).toString();
      if (month.length == 1) {
        month = "0" + (time.getMonth() + 1).toString();
      }
      var day = time.getDate().toString();
      if (day.length == 1) {
        day = "0" + time.getDate().toString();
      }
      return year + "-" + month + "-" + day;
    },

    //计算时间小时和分钟差
    getTimeRange: function(time2) {
      time2 = time2.substring(0, 12);
      var date1 = new Date(),
        time1 = common.timeForData(date1).replace("-", "").replace("-", ""),
        date2 = common.dateFormat(time2),
        time3 = time2.substring(0, 8);
      date3 = date1.getTime() - date2.getTime();
      if (time3 == time1) {
        //计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours > 0) {
          var result = hours + '小时前';
          return result;
        } else {
          //计算相差分钟数
          var leave2 = leave1 % (3600 * 1000);
          //计算小时数后剩余的毫秒数
          var minutes = Math.floor(leave2 / (60 * 1000));
          var result = minutes + '分钟前';
          return result;
        }
      } else {
        var result = time2.substring(
          0, 4) + "-" + time2.substring(
          4, 6) + "-" + time2.substring(6, 8);
        return result;
      }
    },
    getTimeRangeInHour: function(time2, now) {
      time2 = time2.substring(0, 12);
      var date1 = new Date(),
        time1 = common.timeForData(date1).replace("-", "").replace("-", ""),
        date2 = common.dateFormat(time2),
        time3 = time2.substring(0, 8),
        date3 = date1.getTime() - date2.getTime();
      if (time3 == time1) {
        //计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        if (hours > 0) {
          var result = time2.substring(8, 10) + ":" + time2.substring(10, 12);
          return result;
        } else {
          //计算相差分钟数
          var leave2 = leave1 % (3600 * 1000);
          //计算小时数后剩余的毫秒数
          var minutes = Math.floor(leave2 / (60 * 1000));
          if (minutes > 0) {
            var result = minutes + '分钟前';
          } else {
            var result = '刚刚';
          }
          return result;
        }
      } else {
        var result = time2.substring(
          0, 4) + "-" + time2.substring(
          4, 6) + "-" + time2.substring(6, 8) + " " + time2.substring(8, 10) + ":" + time2.substring(10, 12);
        return result;
      }
    },
    //计算列表图片大小
    getListImgSize: function(basW, ratio) {
      var screenW = window.screen.width,
        dpr = window.devicePixelRatio,
        imgSizeW,
        imgSizeH;
      if (screenW <= 320) {
        imgSizeW = parseInt(basW * 0.89);
        imgSizeH = parseInt(basW * 0.89 * ratio);
      } else if (screenW >= 320 && screenW <= 393) {
        imgSizeW = parseInt(basW * dpr);
        imgSizeH = parseInt(basW * ratio * dpr);
      } else if (screenW >= 393) {
        imgSizeW = parseInt(basW * 1.092 * ratio * dpr);
        imgSizeH = parseInt(basW * 1.092 * ratio * dpr);
      }
      screenImgSize = imgSizeW + "_w," + imgSizeH + "_h"; //活动图片比例
      return screenImgSize;
    },
    getQueryString: function(url) {
      var theRequest = {};
      var str = url.indexOf("#") > -1 ? url.substring(1 + url.indexOf("?"), url.indexOf("#")) : url.substr(1 + url.indexOf("?"));
      str = str.split("&");
      for (var i = 0; i < str.length; i++) {
        var param = str[i].split("=");
        theRequest[param[0]] = decodeURIComponent(param.slice(1).join("="))
      }
      return theRequest
    },
    //计算日期相差的天数
    calcdate: function(time) {
      var sDate, //存储日期的数组
        oDate1, //数据库中的时间转化
        oDate2, //系统的时间转化
        days, //相差的天数
        result; //结果
      var timeStart = time.substring(
        0, 4) + "-" + time.substring(
        4, 6) + "-" + time.substring(6, 8);

      var timeNow = new Date(); //现在的时间
      timeNow = common.timeForData(timeNow); //将日期转为字符串

      sDate = timeStart.split("-");
      oDate1 = new Date(sDate[1] + '-' + sDate[2] + '-' + sDate[0]);
      nDate = timeNow.split("-");
      oDate2 = new Date(nDate[1] + '-' + nDate[2] + '-' + nDate[0]);

      days = parseInt(Math.abs(oDate2 - oDate1) / 1000 / 60 / 60 / 24);

      switch (days) {
        case 0:
          result = "今天" + time.substring(8, 10) + ":" + time.substring(
            10, 12);
          break;
        case 1:
          result = "昨天" + time.substring(8, 10) + ":" + time.substring(
            10, 12);
          break;
        case 2:
          result = "前天" + time.substring(8, 10) + ":" + time.substring(
            10, 12);
          break;
        default:
          result = sDate[0] + '年' + sDate[1] + '月' + sDate[2] + '日&nbsp' + time.substring(8, 10) + ":" + time.substring(
            10, 12);
          break;
      };
      return result;
    }
  }
  return common;
});
