import Hammer from "hammerjs"

var reqAnimationFrame = (function () {
	return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

class hammer{
   constructor(o){
		// init
		this.element = document.querySelector(o.containerId);
		this.START_X = Math.round((window.innerWidth - this.element.offsetWidth) / 2);
		this.START_Y = Math.round((window.innerHeight - this.element.offsetHeight) / 2);

		this.ticking = false;
		this.timer;
		this.initAngle = 0;  //旋转角度
		this.initScale = 1;  //放大倍数

		//旋转相关
		this.preAngle = 0 ;
		this.tempAngleFlag = 0;
		this.deltaAngle = 0;	
		this.startRotateAngle = 0;
		this.element.className = 'animate';

		this.transform = {
			translate: { x: this.START_X, y: this.START_Y },
			scale: 1,
			angle: 0,
			rx: 0,
			ry: 0,
			rz: 0
		};
		this.requestElementUpdate();

		this.mc = new Hammer.Manager(this.element);   //用管理器  可以同时触发旋转 拖拽  移动

		/**
		ev.srcEvent.type  touchstart  touchend touchmove
		ev.deltaX  手势移动位移变量  
		*/
		this.mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));  
		this.mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(this.mc.get('pan'));
		this.mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([this.mc.get('pan'), this.mc.get('rotate')]);
		
		//结束时做一些处理
		this.mc.on("hammer.input", (ev) => {
			if(ev.isFinal) {
			// console.log(START_X+"  "+transform.translate.x  +"   "+ev.deltaX);
			this.START_X = this.transform.translate.x ;
			this.START_Y = this.transform.translate.y ;
			}
		});
		this.mc.on("panstart panmove", (ev)=>{
			if(!ev.isFinal) {
				this.element.className = '';
				// console.log(START_X   +"  "+  START_Y +" |  "+ev.deltaX   +"  "+  ev.deltaY);		
				this.transform.translate = {
					x: this.START_X + ev.deltaX,
					y: this.START_Y + ev.deltaY
				};
				this.requestElementUpdate();
			}	   
		}
		);
		this.mc.on("rotatestart rotatemove rotateend", (ev) => {
			if(ev.type == 'pinchstart') {
				this.initScale = transform.scale || 1;
			}
			this.element.className = '';
			this.transform.scale = initScale * ev.scale;
			this.requestElementUpdate();	
		});
		this.mc.on("pinchstart pinchmove", (ev)=>{
			if(ev.type == 'rotatestart') {			    
				this.startRotateAngle =  ev.rotation ;			 
				this.tempAngleFlag = 0 ;
			}	
			if(ev.type == 'rotatemove'){
				if(this.tempAngleFlag == 0){
					this.preAngle = startRotateAngle;
					this.tempAngleFlag ++;
				}else{				
					this.deltaAngle = ev.rotation - this.preAngle;
					this.element.className = '';
					this.transform.rz = 1;  //非0  垂直xy轴
					this.transform.angle =this.initAngle + this.deltaAngle;									
					this.requestElementUpdate();	
				}
			}
				
			//旋转结束  记录当前图片角度	
			if(ev.type =='rotateend'){
				this.initAngle = this.transform.angle;
			}	
		});
   }
   init(x, y){
	this.element.className = 'animate';
	this.START_X =x ;  this.START_Y =y;

		this.transform = {
			translate: { x: this.START_X, y: this.START_Y },
			scale: 1,
			angle: 0,
			rx: 0,
			ry: 0,
			rz: 0
		};
		this.requestElementUpdate();
   }
	updateElementTransform() {
		var value = [
			'translate3d(' + this.transform.translate.x + 'px, ' + this.transform.translate.y + 'px, 0)',
			'scale(' + this.transform.scale + ', ' + this.transform.scale + ')',
			'rotate3d('+ this.transform.rx +','+ this.transform.ry +','+ this.transform.rz +','+  this.transform.angle + 'deg)'
		];
		value = value.join(" ");
		this.element.style.webkitTransform = value;  /*为Chrome/Safari*/
		this.element.style.mozTransform = value; /*为Firefox*/
		this.element.style.transform = value; /*IE Opera?*/
		this.ticking = false;
	}

	requestElementUpdate() {
		if(!this.ticking) {
			reqAnimationFrame(()=>this.updateElementTransform());
			this.ticking = true;
		}
	}
   resetElement() {
		this.element.className = 'animate';
		this.transform = {
			translate: { x: START_X, y: START_Y },
			scale: 1,
			angle: 0,
			rx: 0,
			ry: 0,
			rz: 0
		};
		requestElementUpdate();
	}
}
export default  hammer;