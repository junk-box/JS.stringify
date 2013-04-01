/*
 * JS.stringify.js
 * http://junk-box.appspot.com/bookmarklet/JS.stringify/index.html
 * Copyright (C) 2013 S.Ishigaki
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
(function() {
	var imp = " !important;"
	var divRowtrl = document.createElement("div");
	divRowtrl.id = "JS.stringify_control";
	divRowtrl.style.cssText = "" +
		"position: fixed" + imp +
		"top: 0px" + imp +
		"right: 3px" + imp +
		"z-index: 2147483647" + imp +
		"padding: 3px" + imp +
		"padding-top: 1px" + imp +
		"background-color: #dfdfdf" + imp +
		"border: solid 1px #aaaaab" + imp +
		"border-top-width: 0px" + imp +
		"border-top-left-radius: 0px" + imp +
		"border-top-right-radius: 0px" + imp +
		"border-bottom-left-radius: 3px" + imp +
		"border-bottom-right-radius: 3px" + imp;
	divRowtrl.innerHTML = "" +
		"<input type='text' " +
			"style='" +
				"display: inline" + imp +
				"outline: none" + imp +
				"box-shadow: 0px 0px" + imp +
				"border: solid 1px #aaaaab" + imp +
				"border-top-color: #969696" + imp +
				"border-top-left-radius: 3px" + imp +
				"border-bottom-left-radius: 3px" + imp +
				"border-top-right-radius: 0px" + imp +
				"border-bottom-right-radius: 0px" + imp +
				"border-right-width: 0px" + imp +
				"line-height: 1" + imp +
				"width: 218px" + imp +
				"height: 100%" + imp +
				"min-height: 100%" + imp +
				"max-height: 100%" + imp +
				"margin: 0px" + imp +
				"vertical-align: baseline" + imp +
				"padding: 4px 6px 3px" + imp +
				"background-color: #ffffff" + imp +
				"color: #000" + imp +
				"font: 12px/1 Arial" + imp +
				"' " +
			"onkeyup='(function(val) {" +
				"var e = window.event || event;" +
				"if (e.keyCode != 13) return;" +
				"var dv = document.getElementById(\"JS.stringify_view\");" +
				"if (dv) document.body.removeChild(dv);" +
				"var select = document.createElement(\"a\");" +
				"select.style.cssText = \"" +
					"color: #609" + imp +
					"background-color: #fffbf0" + imp +
					"font: normal 12px/1 sans-serif" + imp +
					"cursor: pointer" + imp +
					"\";" +
				"select.innerHTML = \"select\";" +
				"select.onclick = function() {" +
					"var selection = document.getSelection();" +
					"var range = selection.getRangeAt(0);" +
					"range.selectNode(document.getElementById(\"JS.stringify_view\").children[1]);" +
					"selection.removeAllRanges();" +
					"selection.addRange(range);" +
				"};" +
				"var close = document.createElement(\"a\");" +
				"close.style.cssText = \"" +
					"margin-left: 8px" + imp +
					"color: #609" + imp +
					"background-color: #fffbf0" + imp +
					"font: normal 12px/1 sans-serif" + imp +
					"cursor: pointer" + imp +
					"\";" +
				"close.innerHTML = \"close\";" +
				"close.onclick = function() {" +
					"document.body.removeChild(document.getElementById(\"JS.stringify_view\"));" +
				"};" +
				"var divA = document.createElement(\"div\");" +
				"divA.style.cssText = \"" +
					"margin-top: 5px" + imp +
					"text-align: right" + imp +
					"\";" +
				"divA.appendChild(select);" +
				"divA.appendChild(close);" +
				"var count = 0;" +
				"var _stringify = function(obj, depth, indent, fn) {" +
					"count++;" +
					"var ot = typeof(obj);" +
					"if (ot != \"object\" && ot != \"function\")" +
						"return ot == \"string\" ? \"\\\"\" + obj + \"\\\"\" : obj;" +
					"var sp = function(len) {" +
						"var s = \"\";" +
						"var nbsp = String.fromCharCode(160);" +
						"for (var i = 0; i < len * 4; i++) s += nbsp;" +
						"return s;" +
					"};" +
					"if (depth == indent) return \"{...}\";" +
					"var t, v, json = [], arr = (obj && obj.constructor == Array);" +
					"for (var n in obj) {" +
						"v = obj[n];" +
						"t = typeof(v);" +
						"if (Object.prototype.hasOwnProperty.call(obj, n)) {" +
							"if (t == \"function\") {" +
								"if (fn) continue;" +
								"var f = String(v);" +
								"v = f.substring(0, f.indexOf(\")\") + 1) + \" {...}\";" +
							"}" +
							"else if (t == \"string\") v = \"\\\"\" + v.replace(/\\\"/g, \"\\\\\\\"\") + \"\\\"\";" +
							"else if (t == \"object\" &&  v != null) v = arguments.callee(v, depth, indent + 1, fn);" +
							"else v = String(v);" +
							"json.push((arr ? \"\" : \"\\\"\" + n + \"\\\": \") + v);" +
							"if (count > 1000) throw new Error(\"too big object.\");" +
						"}" +
					"}" +
					"return (arr ? \"[\" : \"{\") + \"</span></div>\\n<div><span>\" + sp(indent + 1) + json.join(\",</span></div>\\n<div><span>\" + sp(indent + 1)) + \"</span></div>\\n<div><span>\" + sp(indent) + (arr ? \"]\" : \"}\");" +
				"};" +
				"var stringify = function(txt) {" +
					"try {" +
						"var depth = document.getElementById(\"JS.stringify_control_depth\").innerHTML;" +
						"var fn = document.getElementById(\"JS.stringify_control_fn\").style.color;" +
						"return _stringify(eval(txt), isNaN(depth) ? 1000 : Number(depth), 0, fn == \"rgb(82, 82, 82)\");" +
					"} catch (ex) {" +
						"return ex.message;" +
					"}" +
				"};" +
				"var divRow = document.createElement(\"div\");" +
				"divRow.style.cssText = \"margin-top: 10px" + imp + "\";" +
				"divRow.innerHTML = \"<div><span>\" + stringify(val) + \"</span></div>\";" +
				"var divView = document.createElement(\"div\");" +
				"divView.id = \"JS.stringify_view\";" +
				"divView.style.cssText = \"" +
					"position: fixed" + imp +
					"top: 10%" + imp +
					"left: 10%" + imp +
					"max-width: 80%" + imp +
					"max-height: 80%" + imp +
					"z-index: 2147483647" + imp +
					"text-align: left" + imp +
					"border: solid 1px #666" + imp +
					"background-color: #fffbf0" + imp +
					"padding: 3px 8px 15px 15px" + imp +
					"\";" +
				"divView.appendChild(divA);" +
				"divView.appendChild(divRow);" +
				"document.body.appendChild(divView);" +
				"var rmPx = function(len) {return Number(len.substring(0, len.length - 2));};" +
				"divRow.style.cssText = \"" +
					"margin-top: 10px" + imp +
					"overflow: auto" + imp + 
					"max-width: \" + (Math.floor(window.innerWidth * 0.8) - rmPx(divView.style.paddingLeft) - rmPx(divView.style.paddingRight)) + \"px" + imp +
					"max-height: \" + (Math.floor(window.innerHeight * 0.8) - rmPx(divView.style.paddingTop) - divA.clientHeight - rmPx(divView.style.paddingBottom) - 20) + \"px" + imp +
					"padding-right: 40px" + imp +
					"padding-bottom: 5px" + imp +
					"color: #000" + imp +
					"background-color: #fffbf0" + imp +
					"text-align: left" + imp +
					"font: normal 12px/1 monospace" + imp +
					"white-space: nowrap" + imp +
					"\";" +
			"})(this.value)'" +
		">" +
		"<a id='JS.stringify_control_depth' " +
			"title='depth' " +
			"style='" +
				"position: relative" + imp+
				"top: 2px" + imp +
				"font: bold 18px/1.0 Comic Sans MS" + imp +
				"border: 1px solid #aaaaab" + imp +
				"border-right-width: 0px" + imp +
				"border-top-color: #969696" + imp +
				"border-top-left-radius: 0px" + imp +
				"border-bottom-left-radius: 0px" + imp +
				"border-top-right-radius: 0px" + imp +
				"border-bottom-right-radius: 0px" + imp +
				"padding: 3px 5px 1px 5px" + imp +
				"text-decoration: none" + imp +
				"background-color: #eeeeef" + imp +
				"color: rgb(82, 82, 82)" + imp +
				"text-shadow: rgb(255, 255, 255) 1px 1px 0px" + imp +
				"outline: none" + imp +
				"cursor: pointer" + imp +
				"display: inline-block" + imp +
				"' " +
			"onclick='(function() {" +
				"var depth = event ? event.target : window.event.srcElement;" +
				"if (depth.innerHTML == \"1\") {" +
					"depth.innerHTML = \"3\";" +
				"} else if (depth.innerHTML == \"3\") {" +
					"depth.innerHTML = \"5\";" +
				"} else if (depth.innerHTML == \"5\") {" +
					"depth.innerHTML = \"&infin;\";" +
					"depth.style.cssText = \"" +
						"position: relative" + imp +
						"top: 2px" + imp +
						"font: bold 18px/1.0 Comic Sans MS" + imp +
						"border: 1px solid #aaaaab" + imp +
						"border-right-width: 0px" + imp +
						"border-top-color: #969696" + imp +
						"border-top-left-radius: 0px" + imp +
						"border-bottom-left-radius: 0px" + imp +
						"border-top-right-radius: 0px" + imp +
						"border-bottom-right-radius: 0px" + imp +
						"padding: 3px 5px 1px 5px" + imp +
						"text-decoration: none" + imp +
						"background-color: #eeeeef" + imp +
						"color: rgb(82, 82, 82)" + imp +
						"text-shadow: rgb(255, 255, 255) 1px 1px 0px" + imp +
						"outline: none" + imp +
						"cursor: pointer" + imp +
						"display: inline-block" + imp +
					"\";" +
				"} else {" +
					"depth.innerHTML = \"1\";" +
					"depth.style.cssText = \"" +
						"position: relative" + imp +
						"top: 1px" + imp +
						"font: bold 14px/1.0 Comic Sans MS" + imp +
						"border: 1px solid #aaaaab" + imp +
						"border-right-width: 0px" + imp +
						"border-top-color: #969696" + imp +
						"border-top-left-radius: 0px" + imp +
						"border-bottom-left-radius: 0px" + imp +
						"border-top-right-radius: 0px" + imp +
						"border-bottom-right-radius: 0px" + imp +
						"padding: 5px 8px 3px 8px" + imp +
						"text-decoration: none" + imp +
						"background-color: #eeeeef" + imp +
						"color: rgb(82, 82, 82)" + imp +
						"text-shadow: rgb(255, 255, 255) 1px 1px 0px" + imp +
						"outline: none" + imp +
						"cursor: pointer" + imp +
						"display: inline-block" + imp +
					"\";" +
				"}" +
			"})()'" +
		">&infin;</a>" +
		"<a id='JS.stringify_control_fn' " +
			"title='include function' " +
			"style='" +
				"position: relative" + imp+
				"top: 1px" + imp +
				"font: bold 15px/1.0 Arial" + imp +
				"border: 1px solid #aaaaab" + imp +
				"border-right-width: 0px" + imp +
				"border-top-color: #969696" + imp +
				"border-top-left-radius: 0px" + imp +
				"border-bottom-left-radius: 0px" + imp +
				"border-top-right-radius: 0px" + imp +
				"border-bottom-right-radius: 0px" + imp +
				"padding: 5px 5px 2px 6px" + imp +
				"text-decoration: none" + imp +
				"background-color: #eeeeef" + imp +
				"color: rgb(82, 82, 82)" + imp +
				"text-shadow: rgb(255, 255, 255) 1px 1px 0px" + imp +
				"outline: none" + imp +
				"cursor: pointer" + imp +
				"display: inline-block" + imp +
				"' " +
			"onclick='(function() {" +
				"var fn = event ? event.target : window.event.srcElement;" +
				"var status = fn.style.color == \"rgb(82, 82, 82)\";" +
				"fn.title = status ? \"exclude function\" : \"include function\";" +
				"fn.style.cssText = \"" +
					"position: relative" + imp+
					"top: 1px" + imp +
					"font: bold 15px/1.0 Arial" + imp +
					"border: 1px solid #aaaaab" + imp +
					"border-right-width: 0px" + imp +
					"border-top-color: #969696" + imp +
					"border-top-left-radius: 0px" + imp +
					"border-bottom-left-radius: 0px" + imp +
					"border-top-right-radius: 0px" + imp +
					"border-bottom-right-radius: 0px" + imp +
					"padding: 5px 5px 2px 6px" + imp +
					"text-decoration: none" + imp +
					"background-color: #eeeeef" + imp +
					"color: \" + (status ? \"rgb(66, 129, 235)\" : \"rgb(82, 82, 82)\") + \"" + imp +
					"text-shadow: \" + (status ? \"rgb(129, 169, 237) 0px 0px 1px\" : \"rgb(255, 255, 255) 1px 1px 0px\") + \"" + imp +
					"outline: none" + imp +
					"cursor: pointer" + imp +
					"display: inline-block" + imp +
					"\";" +
			"})()'" +
		">fn</a>" +
		"<a " +
			"title='close'" +
			"style='" +
				"position: relative" + imp+
				"top: 2px" + imp +
				"font: bold 17px/1.0 Impact" + imp +
				"border: 1px solid #aaaaab" + imp +
				"border-top-color: #969696" + imp +
				"border-top-left-radius: 0px" + imp +
				"border-bottom-left-radius: 0px" + imp +
				"border-top-right-radius: 3px" + imp +
				"border-bottom-right-radius: 3px" + imp +
				"padding: 3px 8px 2px 7px" + imp +
				"text-decoration: none" + imp +
				"background-color: #eeeeef" + imp +
				"color: #525252" + imp +
				"display: inline-block" + imp +
				"text-shadow: 1px 1px 0px #ffffff" + imp +
				"outline: none" + imp +
				"cursor: pointer" + imp +
				"' " +
			"onclick='(function() {" +
				"var view = document.getElementById(\"JS.stringify_view\");" +
				"if (view) document.body.removeChild(view);" +
				"document.body.removeChild(document.getElementById(\"JS.stringify_control\"));" +
			"})()'" +
		">&times;</a>";
	document.body.appendChild(divRowtrl);
})();
