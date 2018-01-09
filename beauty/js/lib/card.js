/**
 * @author:xysheng
 * @date:2016.03.15
 * @description 模块信息加载
 */
define(function(require) {
    var jquery = require('jquery'),
        doT = require('doT');
    var card = {
        //渲染DOM和data
        renderCard: function(parentDomId, htmlUrl, data, jsUrl) {
            $.get(
                htmlUrl,
                function(templ) {
                    var CARD_TEMPL_FUN = doT.template(templ);
                    $(parentDomId).html(CARD_TEMPL_FUN(data));
                    if (jsUrl != '') {
                        card.addJs(jsUrl);
                    }
                },
                "text"
            );
        },
        //添加模块css
        addCss: function(cssUrl) {
            var linkTag = $('<link href="' + cssUrl + '" rel="stylesheet" type="text/css" />');
            $($('head')[0]).append(linkTag);
        },
        //添加模块Js
        addJs: function(jsUrl) {
            require([jsUrl], function(cardManage) {
                cardManage.init();
            });
        }
    }
    return card;
});