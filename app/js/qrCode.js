import QRCode from 'qrcode';

export default(domId) =>{
	let url = location.origin + location.pathname;
	QRCode.toDataURL(url + (url.indexOf('?')!=-1?'&':'?'))
	.then(url => {
	document.getElementById(`${domId}`).src = url;
	console.log(url);
	})
	.catch(err => {
	  console.error(err)
	})
}