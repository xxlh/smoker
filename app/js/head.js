import * as Ajax from "@lib/Ajax"
import AjaxData from "@lib/AjaxData"
import {desiginwidth, setConfig} from "./config"
import preloader from "preloader"
import ready from "document-ready"
import loading from './loading'
import VConsole from 'vconsole';

// var vConsole = new VConsole();

// 清除html缓存
if(window.location.search.indexOf('newclearCache=')==-1){
	location.href = location.href + (location.href.indexOf('?')!=-1?'&':'?') + 'newclearCache='+Math.random();
}



// REM布局


var windowResize =function() {
	var devicePixelRatio = window.devicePixelRatio;
	var documentWidth = document.documentElement.clientWidth;
	let rem = documentWidth / desiginwidth * 100;
	document.documentElement.style.fontSize=rem +"px";
	//处理特殊机型
	console.log("rem=======" + rem);
	if(window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize) {
		var size = window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize.split('p')[0];
		console.log("size=======" + size);
		if(size*1.2 < rem ) {
			document.documentElement.style.fontSize = 1.25 * rem + 'px';
			console.log("fontSize=======" + window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize)
		}
	};
}
windowResize();
window.onresize=windowResize;



// (function () {
// 	windowResize();
// })



// 资源预加载，更新进度条
loading.init();
let loader = preloader({
	xhrImages: false
});
loader.add(require('../images/page1.jpg'));
loader.add(require('../images/page033.png'));
loader.add(require('../images/title.png'));
loader.add(require('../images/love2.png'));
loader.add(require('../images/logo.png'));

loader.add(require('../images/input.png'));
loader.add(require('../images/nickname.png'));
loader.add(require('../images/tips.png'));
loader.add(require('../images/qstip.png'));
loader.add(require('../images/rule.png'));
loader.add(require('../images/bg.png'));

loader.on('progress',function(p) {
	loading.update(Math.floor(p*100), -1);
});
loader.on('complete',function(c) {
	ready(()=>{
		loading.complete();
	})
});

let Data = new AjaxData('https://www.appmn.cn/project2022/wuyanri/');
window._initInfo = Data.get('browse.php');
	ready(async ()=>{
	window.initInfo = await window._initInfo;
	// window._initInfo = {tid:1 ,nickname:"dd", psum:2};
	loader.load();
})


