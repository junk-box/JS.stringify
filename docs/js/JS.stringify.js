/*
 * JS.stringify v1.7
 * https://junk-box.github.io/JS.stringify/index.html
 *
 * Copyright (C) 2014 S.Ishigaki
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: 2014-12-06
 */
(function() {

var
	body = (function() {
		if (document.body.localName != "frameset") return document.body;
		return (function(f) {
			if (f.localName == "frame") return f.contentDocument;
			return arguments.callee(f.children[f.cols.split(",").length - 1]);
		})(document.body).body;
	})(),

	toCssText = function(props) {
		var cssText = "";
		for (var i = 0; i < props.length; i++) cssText += props[i] + " !important;";
		return cssText;
	},

	view,

	toIndent = function(n) {
		var s = "";
		for (var i = 0; i < n * 4; i++) s += String.fromCharCode(160);
		return s;
	},

	viewFont = "normal 12px/1 sans-serif",

	viewTag = "<div style=\"margin: 0px;\"><span style=\"font: " + viewFont + ";\">",

	count,

	stringEscape = function(s) {
		return s
			.replace(/\\/g, "\\\\")
			.replace(/\"/g, "\\\"")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	},

	_stringify = function(obj, depth, indent, fn) {
		count++;
		var ot = typeof(obj);
		if (ot != "object" && ot != "function") return ot == "string" ? "\"" + stringEscape(obj) + "\"" : obj;
		if (depth == indent) return "{...}";
		var t, v, json = [], isArray = (obj && obj.constructor == Array);
		for (var n in obj) {
			v = obj[n];
			t = typeof(v);
			if (Object.prototype.hasOwnProperty.call(obj, n)) {
				if (t == "function") {
					if (fn) continue;
					var f = String(v);
					v = f.substring(0, f.indexOf(")") + 1) + " {...}";
				}
				else if (t == "string") v = "\"" + stringEscape(v) + "\"";
				else if (t == "object" &&  v != null) v = arguments.callee(v, depth, indent + 1, fn);
				else v = String(v);
				json.push((isArray ? "" : "\"" + stringEscape(n) + "\": ") + v);
				if (count > 1000) throw new Error("too big object.");
			}
		}
		var s = "</span></div>" + viewTag;
		return (isArray ? "[" : "{") + s + toIndent(indent + 1) + json.join("," + s + toIndent(indent + 1)) + s + toIndent(indent) + (isArray ? "]" : "}");
	},

	stringify = function() {
		try {
			count = 0;
			var obj = (function() {
				var o, props = input.value.split(".");
				try {
					o = (function(obj, index) {
						return props.length == index ? obj : arguments.callee(obj[props[index]], index + 1);
					})(window[props[0]], 1);
				} catch(_ex) {}
				return o == undefined ? eval(input.value) : o;
			})();
			return viewTag + _stringify(obj, isNaN(depth.innerHTML) ? 1000 : Number(depth.innerHTML), 0, fn.style.color == "rgb(82, 82, 82)") + "</span></div>";
		} catch (ex) {
			return ex.message;
		}
	},

	show = function() {
		if (input.value == "") return;
		if (view) body.removeChild(view);
		var select = document.createElement("a");
		select.style.cssText = toCssText([
			"color: #609",
			"background-color: #fffbf0",
			"font: " + viewFont,
			"border-width: 0px",
			"cursor: pointer"
		]);
		select.innerHTML = "select";
		select.onclick = function() {
			var range = document.createRange();
			range.selectNode(view.children[1]);
			var selection = document.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
		};
		var close = document.createElement("a");
		close.innerHTML = "close";
		close.style.cssText = toCssText([
			"margin-left: 8px",
			"color: #609",
			"background-color: #fffbf0",
			"font: " + viewFont,
			"border-width: 0px",
			"cursor: pointer"
		]);
		close.onclick = function() {
			body.removeChild(view);
			view = undefined;
		};

		var action = document.createElement("div");
		action.style.cssText = toCssText([
			"margin: 0px",
			"margin-top: 5px",
			"text-align: right"
		]);
		action.appendChild(select);
		action.appendChild(close);

		var str = document.createElement("div");
		str.innerHTML = stringify();
		str.style.cssText = toCssText(["margin-top: 10px"]);

		view = document.createElement("div");
		view.style.cssText = toCssText([
			"position: fixed",
			"top: 10%",
			"left: 10%",
			"margin: 0px",
			"z-index: 2147483647",
			"width: auto",
			"height: auto",
			"max-width: 80%",
			"max-height: 80%",
			"text-align: left",
			"border: solid 1px #666",
			"background-color: #fffbf0",
			"padding: 3px 8px 15px 15px"
		]);
		view.appendChild(action);
		view.appendChild(str);
		body.appendChild(view);

		var rmPx = function(len) {return Number(len.substring(0, len.length - 2));};
		str.style.cssText = toCssText([
			"margin: 0px",
			"margin-top: 10px",
			"overflow: auto",
			"max-width: " + (Math.floor(window.innerWidth * 0.8) - rmPx(view.style.paddingLeft) - rmPx(view.style.paddingRight)) + "px",
			"max-height: " + (Math.floor(window.innerHeight * 0.8) - rmPx(view.style.paddingTop) - action.clientHeight - rmPx(view.style.paddingBottom) - 20) + "px",
			"padding-right: 40px",
			"padding-bottom: 5px",
			"color: #000",
			"background-color: #fffbf0",
			"text-align: left",
			"font: normal 12px/1 monospace",
			"white-space: nowrap"
		]);
	},

	input = (function() {
		var input = document.createElement("input");
		input.type = "text";
		input.spellcheck = false;
		input.style.cssText = toCssText([
			"display: inline",
			"outline: none",
			"box-shadow: 0px 0px",
			"border: solid 1px #aaaaab",
			"border-top-color: #969696",
			"border-top-left-radius: 3px",
			"border-bottom-left-radius: 3px",
			"border-top-right-radius: 0px",
			"border-bottom-right-radius: 0px",
			"border-right-width: 0px",
			"line-height: 1",
			"width: 218px",
			"height: 100%",
			"min-height: 100%",
			"max-height: 100%",
			"margin: 0px",
			"vertical-align: baseline",
			"padding: 4px 6px 3px",
			"background-color: #ffffff",
			"color: #000",
			"font: 12px/1 Arial"
		]);
		input.onkeyup = function(e) {
			if ((e || event).keyCode == 13) show();
		};
		return input;
	})(),

	watch = (function() {
		var watch = document.createElement("div");
		watch.title = "watch";
		watch.innerHTML = "=";
		watch.style.cssText = toCssText([
			"display: inline-block",
			"position: relative",
			"top: 2px",
			"margin: 0px",
			"font: bold 19px/1.0 Comic Sans MS",
			"border: 1px solid #aaaaab",
			"border-right-width: 0px",
			"border-top-color: #969696",
			"border-top-left-radius: 0px",
			"border-bottom-left-radius: 0px",
			"border-top-right-radius: 0px",
			"border-bottom-right-radius: 0px",
			"padding: 0px 6px 2px 6px",
			"text-decoration: none",
			"background-color: #eeeeef",
			"color: rgb(82, 82, 82)",
			"text-shadow: rgb(255, 255, 255) 1px 1px 0px",
			"outline: none",
			"cursor: pointer"
		]);
		watch.onclick = function() {
			show();
		};
		return watch;
	})(),

	depth = (function() {
		var depth = document.createElement("div");
		depth.title = "depth";
		depth.innerHTML = "&infin;";
		depth.style.cssText = toCssText([
			"position: relative",
			"top: 2px",
			"margin: 0px",
			"font: bold 18px/1.0 Comic Sans MS",
			"border: 1px solid #aaaaab",
			"border-right-width: 0px",
			"border-top-color: #969696",
			"border-top-left-radius: 0px",
			"border-bottom-left-radius: 0px",
			"border-top-right-radius: 0px",
			"border-bottom-right-radius: 0px",
			"padding: 1px 5px 2px 5px",
			"text-decoration: none",
			"background-color: #eeeeef",
			"color: rgb(82, 82, 82)",
			"text-shadow: rgb(255, 255, 255) 1px 1px 0px",
			"outline: none",
			"cursor: pointer",
			"display: inline-block"
		]);
		depth.onclick = function() {
			if (this.innerHTML == "1") this.innerHTML = "3";
			else if (this.innerHTML == "3") this.innerHTML = "5";
			else if (this.innerHTML == "5") {
				this.innerHTML = "&infin;";
				this.style.cssText = toCssText([
					"display: inline-block",
					"position: relative",
					"top: 2px",
					"margin: 0px",
					"font: bold 18px/1.0 Comic Sans MS",
					"border: 1px solid #aaaaab",
					"border-right-width: 0px",
					"border-top-color: #969696",
					"border-top-left-radius: 0px",
					"border-bottom-left-radius: 0px",
					"border-top-right-radius: 0px",
					"border-bottom-right-radius: 0px",
					"padding: 1px 5px 2px 5px",
					"text-decoration: none",
					"background-color: #eeeeef",
					"color: rgb(82, 82, 82)",
					"text-shadow: rgb(255, 255, 255) 1px 1px 0px",
					"outline: none",
					"cursor: pointer"
				]);
			} else {
				this.innerHTML = "1";
				this.style.cssText = toCssText([
					"display: inline-block",
					"position: relative",
					"top: 1px",
					"margin: 0px",
					"font: bold 14px/1.0 Comic Sans MS",
					"border: 1px solid #aaaaab",
					"border-right-width: 0px",
					"border-top-color: #969696",
					"border-top-left-radius: 0px",
					"border-bottom-left-radius: 0px",
					"border-top-right-radius: 0px",
					"border-bottom-right-radius: 0px",
					"padding: 4px 8px 3px 8px",
					"text-decoration: none",
					"background-color: #eeeeef",
					"color: rgb(82, 82, 82)",
					"text-shadow: rgb(255, 255, 255) 1px 1px 0px",
					"outline: none",
					"cursor: pointer"
				]);
			}
			show();
		};
		return depth;
	})(),

	fn = (function() {
		var fn = document.createElement("div");
		fn.title = "include function";
		fn.innerHTML = "fn";
		fn.style.cssText = toCssText([
			"display: inline-block",
			"position: relative",
			"top: 1px",
			"margin: 0px",
			"font: bold 15px/1.0 Arial",
			"border: 1px solid #aaaaab",
			"border-right-width: 0px",
			"border-top-color: #969696",
			"border-top-left-radius: 0px",
			"border-bottom-left-radius: 0px",
			"border-top-right-radius: 0px",
			"border-bottom-right-radius: 0px",
			"padding: 3px 5px 3px 6px",
			"text-decoration: none",
			"background-color: #eeeeef",
			"color: rgb(82, 82, 82)",
			"text-shadow: rgb(255, 255, 255) 1px 1px 0px",
			"outline: none",
			"cursor: pointer"
		]);
		fn.onclick = function() {
			var status = this.style.color == "rgb(82, 82, 82)";
			this.title = status ? "exclude function" : "include function";
			this.style.cssText = toCssText([
				"display: inline-block",
				"position: relative",
				"top: 1px",
				"margin: 0px",
				"font: bold 15px/1.0 Arial",
				"border: 1px solid #aaaaab",
				"border-right-width: 0px",
				"border-top-color: #969696",
				"border-top-left-radius: 0px",
				"border-bottom-left-radius: 0px",
				"border-top-right-radius: 0px",
				"border-bottom-right-radius: 0px",
				"padding: 3px 5px 3px 6px",
				"text-decoration: none",
				"background-color: #eeeeef",
				"color: " + (status ? "rgb(66, 129, 235)" : "rgb(82, 82, 82)"),
				"text-shadow: " + (status ? "rgb(129, 169, 237) 0px 0px 1px" : "rgb(255, 255, 255) 1px 1px 0px"),
				"outline: none",
				"cursor: pointer"
			]);
			show();
		};
		return fn;
	})(),

	close = (function() {
		var close = document.createElement("div");
		close.title = "close";
		close.innerHTML = "&times;";
		close.style.cssText = toCssText([
			"display: inline-block",
			"position: relative",
			"top: 2px",
			"margin: 0px",
			"font: bold 17px/1.0 Impact",
			"border: 1px solid #aaaaab",
			"border-top-color: #969696",
			"border-top-left-radius: 0px",
			"border-bottom-left-radius: 0px",
			"border-top-right-radius: 3px",
			"border-bottom-right-radius: 3px",
			"padding: 2px 8px 2px 7px",
			"text-decoration: none",
			"background-color: #eeeeef",
			"color: #525252",
			"text-shadow: 1px 1px 0px #ffffff",
			"outline: none",
			"cursor: pointer"
		]);
		close.onclick = function() {
			if (view) body.removeChild(view);
			body.removeChild(ctrl);
		};
		return close;
	})(),

	ctrl = (function() {
		var ctrl = document.createElement("div");
		ctrl.style.cssText = toCssText([
			"position: fixed",
			"top: 0px",
			"right: 3px",
			"margin: 0px",
			"z-index: 2147483647",
			"width: auto",
			"height: auto",
			"padding: 3px",
			"padding-top: 1px",
			"white-space: nowrap",
			"background-color: #dfdfdf",
			"border: solid 1px #aaaaab",
			"border-top-width: 0px",
			"border-top-left-radius: 0px",
			"border-top-right-radius: 0px",
			"border-bottom-left-radius: 4px",
			"border-bottom-right-radius: 4px"
		]);
		ctrl.appendChild(input);
		ctrl.appendChild(watch);
		ctrl.appendChild(depth);
		ctrl.appendChild(fn);
		ctrl.appendChild(close);
		return ctrl;
	})();

	body.appendChild(ctrl);

	input.focus();

})();
