'use strict';

if (typeof(require) === typeof(undefined)) window.require = function(){return null;};


/** 
* Based on
* https://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/
*/
var getViaStandardHTTP = function(src, cb) {
	if(XMLHttpRequest) {
		var request = new XMLHttpRequest();
		if("withCredentials" in request) {
			// Firefox 3.5 and Safari 4
			request.onreadystatechange = function(httpRequest){
				var err = null;
				var val = null;
				if (request.readyState === 4) {
					if (request.status === 200) {
						val = request.responseText;
					} else {
						err = request.status;
					}
					if (err) println("AJAX: '" + err + "', '" + val + "'");
					if (cb) cb(err, val);
				}
			};
			request.open('GET', src, true);
			request.send();
		} else if (XDomainRequest) {
			// IE8
			var xdr = new XDomainRequest();
			var errFunc = function(){
				if (cb) cb("Couldn't load", null);
			};
			xdr.error = errFunc;
			xdr.ontimeout = errFunc;
			xdr.onload = function(){
				if (cb) cb(null, xdr.responseText);
			};
			xdr.open("get", src);
			xdr.send();
		} else {
			println("Can't initialize.");
		}
	} else {
		println("No ajax!");
		if (cb) cb("No ajax.", null);
	}
};



var loadURLToElement = function(src, cb) {
	var obj = document.createElement('object');
	obj.setAttribute('width', 0);
	obj.setAttribute('height', 0);
	obj.addEventListener('load', function(e) {
		var el = obj.contentDocument
					.documentElement
					.innerHTML/*
					.getElementById('res')*/;
		obj.parentElement.removeChild(obj);
		if (cb) cb(el);
	});
	obj.setAttribute('data', src);
	document.body.appendChild(obj);
};

var PutStuffHereAjax = {
	getViaStandardHTTP: getViaStandardHTTP,
	loadURLToElement: loadURLToElement,
};

if (typeof(module) === typeof(undefined)) window.module = {};

module.exports = PutStuffHereAjax;