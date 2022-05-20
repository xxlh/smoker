import "../css/swiper.min.css";
import "../css/public.css";
import "../css/index.css";
import $ from "jquery";
import  swal from "sweetalert"
import * as Ajax from "@lib/Ajax"
import getParams from "./getParams"
import wxShare from "@lib/wxShare"
import App from "./html2CanvasAttr"
import repairPhoto from "./repairPhoto";
import qrCode from "./qrCodeNoid";
import maxRow from "maxrow";

let param = getParams();

// import VConsole from 'vconsole';
// var vConsole = new VConsole();

$.ajaxSetup({
	crossDomain: true,
	xhrFields: {
		withCredentials: true
	}
});

let app =new App();
// let param = getParams();

var wx = {};

//微信分享文案设置
wx.shareLink =location.origin + location.pathname; 
wx.sharePic = "http://n.sinaimg.cn/fj/2021qingshu/img/wxShare.jpg?9"; 
wx.shareDesc = `风华鹭岛，百年先锋！`;
wx.shareTit = "纸短情长，记录厦门的一颦一笑"; 
wx.sharePyq = `风华鹭岛，百年先锋！`;
let wxshare =new wxShare();
wxshare.setInfo(wx);

window.tid=0;
window.posterStute = false;
import Hammer from "hammerjs"
var reqAnimationFrame = (function () {
	return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

$(async function(){
	
	var ticking = false;
	var transform;   //图像效果
	var timer;
	var initAngle = 0;  //旋转角度
	var initScale = 1;  //放大倍数

	var el = document.querySelector("#imgid");
	var START_X = Math.round((window.innerWidth - el.width) / 2);
	var START_Y = Math.round((window.innerHeight - el.height) / 2);

	var mc = new Hammer.Manager(el);   //用管理器  可以同时触发旋转 拖拽  移动
	mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));  
	mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
	mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
		
	//结束时做一些处理
	mc.on("hammer.input", function(ev) {
		if(ev.isFinal) {
		console.log(START_X+"  "+transform.translate.x  +"   "+ev.deltaX);
		START_X = transform.translate.x ;
		START_Y = transform.translate.y ;
		}
		
	});
	mc.on("panstart panmove", onPan);
	mc.on("rotatestart rotatemove rotateend", onRotate);
	mc.on("pinchstart pinchmove", onPinch);
	/**
	第二次进入拖拽时  delta位移重置
	移动时 初始位置startxy不动。delta增加
	*/
	function onPan(ev){
		if(!ev.isFinal) {
		//  el.className = '';
			console.log(START_X   +"  "+  START_Y +" |  "+ev.deltaX   +"  "+  ev.deltaY);		
				transform.translate = {
					x: START_X + ev.deltaX,
					y: START_Y + ev.deltaY
				};
				requestElementUpdate();
		}	   
	}

	function onPinch(ev){
		if(ev.type == 'pinchstart') {
			initScale = transform.scale || 1;
		}
		// el.className = '';
		transform.scale = initScale * ev.scale;
		requestElementUpdate();	
	}

	//旋转相关
	var  preAngle =0 ;
	var  tempAngleFlag=0;
	var  deltaAngle = 0;	
	var  startRotateAngle = 0;

	function onRotate(ev) {
		//点下第二个触控点时触发
		if(ev.type == 'rotatestart') {			    
				startRotateAngle =  ev.rotation ;			 
				tempAngleFlag = 0 ;
		}	
		if(ev.type == 'rotatemove'){
			if(tempAngleFlag == 0){
				preAngle = startRotateAngle;
				tempAngleFlag ++;
			}else{				
				deltaAngle = ev.rotation - preAngle;
				// el.className = '';
				transform.rz = 1;  //非0  垂直xy轴
				transform.angle =initAngle + deltaAngle;									
				requestElementUpdate();	
			}
		}
		//旋转结束  记录当前图片角度	
		if(ev.type =='rotateend'){
			initAngle = transform.angle;
		}	
	}
	function updateElementTransform() {
		var value = [
			'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
			'scale(' + transform.scale + ', ' + transform.scale + ')',
			'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
		];

		value = value.join(" ");
		el.style.webkitTransform = value;  /*为Chrome/Safari*/
		el.style.mozTransform = value; /*为Firefox*/
		el.style.transform = value; /*IE Opera?*/
		ticking = false;
	}
	function requestElementUpdate() {
		if(!ticking) {
			reqAnimationFrame(updateElementTransform);
			ticking = true;
		}
	}
	/**
	初始化设置
	*/
	function resetElement() {
		// el.className = 'animate';
		transform = {
			translate: { x: START_X, y: START_Y },
			scale: 1,
			angle: 0,
			rx: 0,
			ry: 0,
			rz: 0
		};
		requestElementUpdate();
	}
	getMusic();

	console.log(localStorage.getItem("tokenj")) ;
	console.log(param.tokenj) ;

	let initInfo = await window._initInfo;
	// let initInfo =  window._initInfo;
	tid = initInfo.tid;
	qrCode("qrcode");
	let word = new maxRow({selector:"#word", row:3, dialog:swal})
	let nickname = new maxRow({selector:"#nickname", row:1, dialog:swal})
	nickname.setText(initInfo.nickname)
	// $("#nickname").html(initInfo.nickname);
	let picId =Math.floor(Math.random()*5) +1
	$("#imgid").attr("src",require(`../images/${picId}.png`));
	$(".psum span").html(`我是第${initInfo.psum}位表白者 `);
	$(".page02").show().siblings().hide();
	START_X = 0 ;
	START_Y =0;
	resetElement();

    $(".label-img").click(function(){
		$('#headupload').click();
	})

	$('#headupload').on('change', function() {
		$(".carmen").hide();
		$(".origin").hide();
		var file = $(this)[0].files[0];
		if(!file) {//undefined
			return;
		}
		$("#tips p").html("照片上传中哦~");
		$("#tips").show();
		repairPhoto(file,1,750).then((result)=>{
			$(`#imgid`).attr("src",result.img);
			START_X = 0 ;
			START_Y =0;
			resetElement();
			$("#tips").hide();
		});
	});

	$("#nickname div").focus(function(){
		$(".bi").hide();
	}) 
	$(".word div").focus(function(){
		$(".qstip").hide();
	}) 
	$(".poster").click(function(){

		if(posterStute) return false;
		window.posterStute = true;

		if($("#imgid").attr("src") == ""){
			swal("请上传图片");
			window.posterStute = false;
			return false;
		}
		
		if($(".page02  .word div").html() == ""){
			alert("请写下你想对厦门说的话");
			$(".page02  .word div").focus();
			window.posterStute = false;
			return false;
		}
		$(".poster").removeClass("pulse");
		$("#tips p").html("美美的情书海报生成中...");
		$("#tips").show();
		let text = $(".page02  .word div").html();
		let data = {};
		data.text = $(".page02  .word div").html() + $(".page02  .nickname div").html();
		Ajax.post("http://www.appmn.cn/public/baidu/sensitive_words.php",data, (json) => {
			if (json.err == 0) { 
				$(".is-show").hide();
				$(".is-show1").show();
				app.setListener(text, tid);
			}else{
				swal(`"${json.data}"  ${json.msg}`);
				$("#tips").hide();
				window.posterStute = false;
			}
			$(".poster").addClass("pulse");
		});
		
	})
	

	//微博分享
	$('.weibo').click( function(){
		// let data = {};
		// data.tid = tid;
		// localStorage.setItem("tokenj", "11111");
		// console.log("tokenj"+localStorage.getItem("tokenj"));

	    // console.log(localStorage.getItem("tokenj"))	
		// data.tokenj = param.tokenj;
		// data.img = $("#show img").attr("src");

		// Ajax.post("https://www.appmn.cn/project2021/xiamenqingshu/sendweibo.php",data, (json) => {
		// 	if (json.err == 0) { 
		// 		swal(json.msg);
		// 	} else if (json.err == 3001) {
		// 		var callbackurl=encodeURIComponent(window.location.href);
		// 		window.location.replace("https://api.weibo.com/oauth2/authorize?client_id=585049065&redirect_uri="+encodeURIComponent('https://www.appmn.cn/public/weibo/oauth2_wlsx_index.php?redirect_url='+callbackurl)+"&response_type=code&state=123&display=123");
		// 	} else{
		// 		swal(json.msg);
		// 	}
		// })
		let title="我写了一封情书告白厦门，快来康康我的神“采”飞扬吧！纸短情长，记录一颦一笑，一起写下#厦门情书#，大声说出你的爱吧~" ,rLink = location.origin + location.pathname,site ="转贴网站",pic =window.imgurl_s;
		window.open('http://service.weibo.com/share/share.php?title='+encodeURIComponent(title)+'&url='+encodeURIComponent(rLink)+'&appkey='+encodeURIComponent(site)+'&pic='+encodeURIComponent(pic),'_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes')       	
	})
	$(".poster-box .close").click(function(){
		$(".poster-box").hide();
		$(".is-show1").hide();
		$(".is-show").show();
		$("#show").empty();
	});
   
	// document.getElementById("word").onblur = excute;
	// let textStorage = [];
	// document.getElementById("word").onkeyup = function(e){
	// 	let v = $(this).html();
	// 	let lineHeight = parseInt($(this).css("line-height"));
	// 	console.log(v.substr(0, v.length - 3));
	// 	if ($(this).height() > lineHeight*3) {
	// 		console.log("peijian～～");
	// 		$(this).html(textStorage.pop());
	// 		$(this).blur();
	// 		swal("超出了,最多三行哦～～");
	// 	} else {
	// 		textStorage.push(v);
	// 	}
	// };
	// document.getElementById("word").onkeydown = function(e){
	// 	let keycode = (e.keyCode ? e.keyCode : e.which);
	// 	console.log($(this).height());
	// 	console.log($(this).css("line-height"));
	// 	let lineHeight = parseInt($(this).css("line-height"));
	// 	if ($(this).height() > lineHeight*3) {
	// 		if (keycode >= 48 || keycode == 13) return false;
	// 	}
	// };
	// document.getElementById("word").onblur = function(e){
	// 	let v = $(this).html();
	// 	let lineHeight = parseInt($(this).css("line-height"));
	// 	if ($(this).height() > lineHeight*3) {
	// 		console.log("peijian～～");
	// 		$(this).html(textStorage.pop());
	// 		$(this).blur();
	// 		swal("超出了,最多三行哦～～");
	// 	} else {
	// 		// textStorage.push(v);
	// 	}
	// };
})	

/* 
function excute(){
    var num1 = document.getElementById("word").innerText.length;
    if(num1 > 69){
        document.getElementById("word").innerHTML = document.getElementById("word").innerText.substring(0,69);
		swal("字数超出了哦～～")
        // num1 = 63;
    }
	let arr = document.getElementById("word").innerText.split("\n");
	if(arr.length>=4){
		document.getElementById("word").innerHTML = arr.slice(0,3).join("<br>")
		swal("超出了,最多三行哦～～")
	}
    // alert(document.getElementById("word").innerText);
    // var rest = 60 - num1;
    // document.getElementById("rest").innerHTML = rest;
} */

 //用户完成输入时，点击输入完成，收回软键盘的一瞬间，触发此事件--------失去焦点
 window.addEventListener('focusout', function () {
	this.focus = false;
	setTimeout(function () {
		if(this.focus==false){
			window.scrollTo(0,0);
		};
	},30)
});

window.addEventListener('focusin', function (){
	this.focus = true;
});

//点击输入框获得焦点，此时用户开始/正在输入
function getMusic(){
	var audio = document.getElementById("music");
	audio.play();
	document.addEventListener("WeixinJSBridgeReady", function () { 
        audio.play(); 
    }, false); 
	let playOnce = ()=>{
		audio.play();
		document.removeEventListener("touchstart", playOnce);
	}
	document.addEventListener("touchstart", playOnce);
	playCotrol();
}
//点击播放/暂停
function playCotrol(){
	var audio = document.getElementById("music");
	$(".playBtn").click(function(){
		if($(".playBtn").hasClass("playState")){
			$(".playBtn").removeClass("playState");
			$(".playBtn i").removeClass("playMusic");
			audio.pause();
		}else{
			$(".playBtn").addClass("playState");
			$(".playBtn i").addClass("playMusic");
			audio.play();
		}
	})
}