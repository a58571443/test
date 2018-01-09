require.config(requireConfig);
require([
        'jquery',
        'doT',
        'fly',
        'caculRem',
    ],
    function(jquery, doT, fly, caculRem) {
        var I = 0;
        var creatPage = {
            _getRequestData: {
                _requestAppData: function() {
                    var data = [{
                        "name": "养老服务"
                    }, {
                        "name": "养老服务1"
                    }, {
                        "name": "养老服务2"
                    }, {
                        "name": "养老服务3"
                    }, {
                        "name": "养老服务4"
                    }, {
                        "name": "养老e服务"
                    }, {
                        "name": "养老v服务"
                    }, {
                        "name": "养a老服务"
                    }, {
                        "name": "养a老服务"
                    }, {
                        "name": "养老服务2"
                    }, {
                        "name": "养老服务3"
                    }, {
                        "name": "养老服务4"
                    }, {
                        "name": "养老服务1"
                    }, {
                        "name": "养老服务2"
                    }, {
                        "name": "养老服务3"
                    }, {
                        "name": "养老服务4"
                    }, {
                        "name": "养老e服务"
                    }, {
                        "name": "养老v服务"
                    }, {
                        "name": "养a老服务"
                    }, {
                        "name": "养a老服务"
                    }, {
                        "name": "养老服务2"
                    }, {
                        "name": "养老服务3"
                    }, {
                        "name": "养老服务4"
                    }, {
                        "name": "养老服务4"
                    }]

                    var requestTmpl = doT.template($('#list').text());
                    $('.service-demo-w').append(requestTmpl(data));

                },
                _requestHotData: function(n) {
                    var circle = document.getElementById("c1");
                    var percent = n / 10,
                        perimeter = Math.PI * 2 * I;
                    circle.setAttribute('stroke-dasharray', perimeter * percent + " " + perimeter * (1 - percent));
                }
            },
            //页面事件
            addEvent: function() {
                var s1 = $('head style').text().indexOf(':'),
                    s2 = $('head style').text().indexOf('p'),
                    fs = $('head style').text().substring(s1 + 1, s2),
                    size = 0.6 * fs,
                    d = size * 4;
                I = 0.56 * fs;
            },
            initData: function() {
                // ctr.addEventListener('change', creatPage._getRequestData._requestHotData, false);
                // creatPage._getRequestData._requestAppData();
                var a = 0;
                setInterval(function() {
                    a++;
                    creatPage._getRequestData._requestHotData(a);
                }, 3000)
            },

            _eventHandle: {},
            //初始化
            init: function() {
                creatPage.initData();
                creatPage.addEvent();
                document.getElementById("c1").setAttribute('stroke-dasharray', 0 + " " + 1);
                // setTimeout(function(){
                //     // $('video').attr("src","http://www.w3school.com.cn/i/movie.ogg");
                //      // document.getElementById("myVideo").play();
                //      // $('#myVideo').play();
                // }, 2000);
            }
        };
        creatPage.init();
    }
);