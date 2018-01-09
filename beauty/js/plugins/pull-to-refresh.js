/*!
 *pull to refresh v2.0
 *author:wallace
 *2015-7-22
 */
var refresher = {
	info: {
		"pullDownLable": "下拉刷新",
		"pullingDownLable": "松开立即刷新",
		"loadingDownLable": "正在刷新",
		"pullUpLable": "上拉加载",
		"pullingUpLable": "松开加载更多",
		"loadingLable": "加载数据"
	},
	init: function(parameter) {
		var wrapper = document.getElementById(parameter.id);
		var div = document.createElement("div");
		div.className = "scroller";
		wrapper.appendChild(div);
		var scroller = wrapper.querySelector(".scroller");
		var list = wrapper.querySelector("#" + parameter.id + " div");
		scroller.insertBefore(list, scroller.childNodes[0]);
		var pullDown = document.createElement("div");
		pullDown.className = "pullDown";
		var loader = document.createElement("div");
		loader.className = "loader" + " swing";
		pullDown.appendChild(loader);
		var pullDownLabel = document.createElement("div");
		pullDownLabel.className = "pullDownLabel";
		// document.getElementsByTagName(".loader").className="swinging";
		//$(".loader").addClass("loading");

		var pullDownImg = document.createElement("div");
		pullDownImg.className = "pullDownImg";
		pullDown.appendChild(pullDownImg);

		pullDown.appendChild(pullDownLabel);
		scroller.insertBefore(pullDown, scroller.childNodes[0]);
		var pullUp = document.createElement("div");
		pullUp.className = "pullUp";
		var loader = document.createElement("div");
		loader.className = "loader";
		for (var i = 0; i < 4; i++) {
			var span = document.createElement("span");
			loader.appendChild(span);
		}
		pullUp.appendChild(loader);
		var pullUpLabel = document.createElement("div");
		pullUpLabel.className = "pullUpLabel";
		var content = document.createTextNode(refresher.info.pullUpLable);
		pullUpLabel.appendChild(content);
		pullUp.appendChild(pullUpLabel);
		scroller.appendChild(pullUp);
		var pullDownEl = wrapper.querySelector(".pullDown");
		var pullDownOffset = pullDownEl.offsetHeight;
		var pullUpEl = wrapper.querySelector(".pullUp");
		var pullUpOffset = pullUpEl.offsetHeight;
		this.scrollIt(parameter, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset);
		lazyLoad.init(pullDownOffset);
	},
	scrollIt: function(parameter, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset) {
		eval(parameter.id + "= new iScroll(parameter.id, {useTransition: true,vScrollbar: false,topOffset: pullDownOffset,noPullDown:parameter.noPullDown||false,onRefresh: function () {refresher.onRelease(pullDownEl,pullUpEl);},onScrollMove: function () {parameter.func();refresher.onScrolling(parameter,this,pullDownEl,pullUpEl,pullUpOffset,pullDownOffset); lazyLoad.init(pullDownOffset,this);},onScrollEnd: function () {parameter.func();refresher.onPulling(pullDownEl,parameter.pullDownAction,pullUpEl,parameter.pullUpAction);lazyLoad.init(pullDownOffset,this);},})");
		pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
		document.addEventListener('touchmove', function(e) {
			e.preventDefault();
		}, false);
	},
	onScrolling: function(parameter, e, pullDownEl, pullUpEl, pullUpOffset, pullDownOffset) {
		if (parameter.noPullDown) {
			var pullDownArr = refresher.getElementsClass("pullDown");
			for (i = 0; i < pullDownArr.length; i++) {
				pullDownArr[i].style.display = "none";
			}
			pullDownOffset = 0;
		}
		if (e.y > -(pullUpOffset)) {
			pullDownEl.id = '';
			pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
			if (parameter.noPullDown) {
				pullUpOffset = 0;
			}
			e.minScrollY = -pullDownOffset;

		}
		if (e.y > 0) {
			pullDownEl.classList.add("flip");
			pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullingDownLable;
			e.minScrollY = 0;
		}
		if (e.scrollerH < e.wrapperH && e.y < (e.minScrollY - pullUpOffset) || e.scrollerH > e.wrapperH && e.y < (e.maxScrollY - pullUpOffset)) {
			pullUpEl.style.display = "block";
			pullUpEl.classList.add("flip");
			pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullingUpLable;
		}
		if (e.scrollerH < e.wrapperH && e.y > (e.minScrollY - pullUpOffset) && pullUpEl.id.match('flip') || e.scrollerH > e.wrapperH && e.y > (e.maxScrollY - pullUpOffset) && pullUpEl.id.match('flip')) {
			pullDownEl.classList.remove("flip");
			pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullUpLable;
		}
	},
	onRelease: function(pullDownEl, pullUpEl) {
		if (pullDownEl.className.match('loading')) {
			pullDownEl.classList.toggle("loading");
			pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.pullDownLable;
			pullDownEl.querySelector('.loader').style.display = "none";
			pullDownEl.querySelector('.pullDownImg').style.display = "block";
			pullDownEl.style.lineHeight = pullDownEl.offsetHeight + "px";
		}
		if (pullUpEl.className.match('loading')) {
			pullUpEl.classList.toggle("loading");
			pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.pullUpLable;
			pullUpEl.querySelector('.loader').style.display = "none";
			pullUpEl.querySelector('.pullUpLabel').style.lineHeight = "2rem";
			pullUpEl.style.lineHeight = pullUpEl.offsetHeight + "px";
		}
	},
	onPulling: function(pullDownEl, pullDownAction, pullUpEl, pullUpAction) {
		if (pullDownEl.className.match('flip') /*&&!pullUpEl.className.match('loading')*/ ) {
			pullDownEl.classList.add("loading");
			pullDownEl.classList.remove("flip");
			pullDownEl.querySelector('.pullDownLabel').innerHTML = refresher.info.loadingDownLable;
			pullDownEl.querySelector('.loader').style.display = "block";
			pullDownEl.querySelector('.pullDownImg').style.display = "none";
			pullDownEl.style.lineHeight = "20px";
			if (pullDownAction) pullDownAction();
		}
		if (pullUpEl.className.match('flip') /*&&!pullDownEl.className.match('loading')*/ ) {
			pullUpEl.classList.add("loading");
			pullUpEl.classList.remove("flip");
			pullUpEl.querySelector('.pullUpLabel').innerHTML = refresher.info.loadingLable;
			pullUpEl.querySelector('.loader').style.display = "block";
			pullUpEl.querySelector('.pullUpLabel').style.lineHeight = "20px";
			if (pullUpAction) pullUpAction();
		}
	},
	onLoadCompleted: function(pullDownEl, pullUpEl) {
		refresher.getElementsClass("pullUpLabel").innerHTML = "没有更多了";
		refresher.info = {
			"pullingUpLable": "没有更多了",
			"loadingLable": "没有更多了",
			"pullUpLable": "没有更多了",
			"pullDownLable": "下拉刷新",
			"pullingDownLable": "松开立即刷新",
			"loadingDownLable": "正在刷新",
		};
	},
	onResherCompeted: function() {
		refresher.info = {
			"pullingUpLable": "没有更多了",
			"loadingLable": "加载数据",
			"pullUpLable": "没有更多了",
			"pullDownLable": "下拉刷新",
			"pullingDownLable": "松开立即刷新",
			"loadingDownLable": "正在刷新",
		};
	},
	onEmptyCompeted: function() {
		refresher.info = {
			"pullingUpLable": "",
			"loadingLable": "",
			"pullUpLable": "",
			"pullDownLable": "下拉刷新",
			"pullingDownLable": "松开立即刷新",
			"loadingDownLable": "正在刷新",
		};
	},
	onInitCompeted: function() {
		refresher.info = {
			"pullDownLable": "下拉刷新",
			"pullingDownLable": "松开立即刷新",
			"loadingDownLable": "正在刷新",
			"pullUpLable": "上拉加载",
			"pullingUpLable": "松开加载更多",
			"loadingLable": "加载数据"
		};
	},
	getElementsClass: function(classnames) {
		var classobj = new Array(), //定义数组 
			classint = 0, //定义数组的下标 
			tags = document.getElementsByTagName("*"); //获取HTML的所有标签 
		for (var i in tags) { //对标签进行遍历 
			if (tags[i].nodeType == 1) { //判断节点类型 
				if (tags[i].getAttribute("class") == classnames) //判断和需要CLASS名字相同的，并组成一个数组 
				{
					classobj[classint] = tags[i];
					classint++;
				}
			}
		}
		return classobj; //返回组成的数组 
	}
}