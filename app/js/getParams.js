export default() =>{
	// var target;
	// target = location.href;
	
	// var i = target.indexOf('?');
	// if(i == -1) return {};
	// var u = target.substring(i + 1), p = new RegExp('([_a-z][_a-z0-9]*)=([^&]*)','ig'), m, r = {};
	// while((m = p.exec(u)) != null){
	// 	r[m[1]] = m[2];
	// }
	// return r;
	var url = window.location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		let strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}