/*
 * JS.stringify v1.3
 * http://junk-box.appspot.com/bookmarklet/JS.stringify/index.html
 *
 * Copyright (C) 2013 S.Ishigaki
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: 2013-5-12
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

	count,

	_stringify = function(obj, depth, indent, fn) {
		count++;
		var ot = typeof(obj);
		if (ot != "object" && ot != "function") return ot == "string" ? "\"" + obj + "\"" : obj;
		if (depth == indent) return "{...}";
		var t, v, json = [], arr = (obj && obj.constructor == Array);
		for (var n in obj) {
			v = obj[n];
			t = typeof(v);
			if (Object.prototype.hasOwnProperty.call(obj, n)) {
				if (t == "function") {
					if (fn) continue;
					var f = String(v);
					v = f.substring(0, f.indexOf(")") + 1) + " {...}";
				}
				else if (t == "string") v = "\"" + v.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + "\"";
				else if (t == "object" &&  v != null) v = arguments.callee(v, depth, indent + 1, fn);
				else v = String(v);
				json.push((arr ? "" : "\"" + n + "\": ") + v);
				if (count > 1000) throw new Error("too big object.");
			}
		}
		return (arr ? "[" : "{") + "</span></div><div><span>" + toIndent(indent + 1) + json.join(",</span></div><div><span>" + toIndent(indent + 1)) + "</span></div><div><span>" + toIndent(indent) + (arr ? "]" : "}");
	},

	stringify = function() {
		try {
			count = 0;
			return "<div><span>" + _stringify(eval(input.value), isNaN(depth.innerHTML) ? 1000 : Number(depth.innerHTML), 0, fn.style.color == "rgb(82, 82, 82)") + "</span></div>";
		} catch (ex) {
			return ex.message;
		}
	},

	show = function() {
		if (view) body.removeChild(view);
		var select = document.createElement("a");
		select.style.cssText = toCssText([
			"color: #609",
			"background-color: #fffbf0",
			"font: normal 12px/1 sans-serif",
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
			"font: normal 12px/1 sans-serif",
			"border-width: 0px",
			"cursor: pointer"
		]);
		close.onclick = function() {
			body.removeChild(view);
			view = undefined;
		};

		var action = document.createElement("div");
		action.style.cssText = toCssText([
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
			"max-width: 80%",
			"max-height: 80%",
			"z-index: 2147483647",
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
			"position: relative",
			"top: 2px",
			"font: bold 19px/1.0 Comic Sans MS",
			"border: 1px solid #aaaaab",
			"border-right-width: 0px",
			"border-top-color: #969696",
			"border-top-left-radius: 0px",
			"border-bottom-left-radius: 0px",
			"border-top-right-radius: 0px",
			"border-bottom-right-radius: 0px",
			"padding: 1px 6px 2px 6px",
			"text-decoration: none",
			"background-color: #eeeeef",
			"color: rgb(82, 82, 82)",
			"text-shadow: rgb(255, 255, 255) 1px 1px 0px",
			"outline: none",
			"cursor: pointer",
			"display: inline-block"
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
			"font: bold 18px/1.0 Comic Sans MS",
			"border: 1px solid #aaaaab",
			"border-right-width: 0px",
			"border-top-color: #969696",
			"border-top-left-radius: 0px",
			"border-bottom-left-radius: 0px",
			"border-top-right-radius: 0px",
			"border-bottom-right-radius: 0px",
			"padding: 3px 5px 1px 5px",
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
					"position: relative",
					"top: 2px",
					"font: bold 18px/1.0 Comic Sans MS",
					"border: 1px solid #aaaaab",
					"border-right-width: 0px",
					"border-top-color: #969696",
					"border-top-left-radius: 0px",
					"border-bottom-left-radius: 0px",
					"border-top-right-radius: 0px",
					"border-bottom-right-radius: 0px",
					"padding: 3px 5px 1px 5px",
					"text-decoration: none",
					"background-color: #eeeeef",
					"color: rgb(82, 82, 82)",
					"text-shadow: rgb(255, 255, 255) 1px 1px 0px",
					"outline: none",
					"cursor: pointer",
					"display: inline-block"
				]);
			} else {
				this.innerHTML = "1";
				this.style.cssText = toCssText([
					"position: relative",
					"top: 1px",
					"font: bold 14px/1.0 Comic Sans MS",
					"border: 1px solid #aaaaab",
					"border-right-width: 0px",
					"border-top-color: #969696",
					"border-top-left-radius: 0px",
					"border-bottom-left-radius: 0px",
					"border-top-right-radius: 0px",
					"border-bottom-right-radius: 0px",
					"padding: 5px 8px 3px 8px",
					"text-decoration: none",
					"background-color: #eeeeef",
					"color: rgb(82, 82, 82)",
					"text-shadow: rgb(255, 255, 255) 1px 1px 0px",
					"outline: none",
					"cursor: pointer",
					"display: inline-block"
				]);
			}
		};
		return depth;
	})(),

	fn = (function() {
		var fn = document.createElement("div");
		fn.title = "include function";
		fn.innerHTML = "fn";
		fn.style.cssText = toCssText([
			"position: relative",
			"top: 1px",
			"font: bold 15px/1.0 Arial",
			"border: 1px solid #aaaaab",
			"border-right-width: 0px",
			"border-top-color: #969696",
			"border-top-left-radius: 0px",
			"border-bottom-left-radius: 0px",
			"border-top-right-radius: 0px",
			"border-bottom-right-radius: 0px",
			"padding: 5px 5px 2px 6px",
			"text-decoration: none",
			"background-color: #eeeeef",
			"color: rgb(82, 82, 82)",
			"text-shadow: rgb(255, 255, 255) 1px 1px 0px",
			"outline: none",
			"cursor: pointer",
			"display: inline-block",
		]);
		fn.onclick = function() {
			var status = this.style.color == "rgb(82, 82, 82)";
			this.title = status ? "exclude function" : "include function";
			this.style.cssText = toCssText([
				"position: relative",
				"top: 1px",
				"font: bold 15px/1.0 Arial",
				"border: 1px solid #aaaaab",
				"border-right-width: 0px",
				"border-top-color: #969696",
				"border-top-left-radius: 0px",
				"border-bottom-left-radius: 0px",
				"border-top-right-radius: 0px",
				"border-bottom-right-radius: 0px",
				"padding: 5px 5px 2px 6px",
				"text-decoration: none",
				"background-color: #eeeeef",
				"color: " + (status ? "rgb(66, 129, 235)" : "rgb(82, 82, 82)"),
				"text-shadow: " + (status ? "rgb(129, 169, 237) 0px 0px 1px" : "rgb(255, 255, 255) 1px 1px 0px"),
				"outline: none",
				"cursor: pointer",
				"display: inline-block"
			]);
		};
		return fn;
	})(),

	close = (function() {
		var close = document.createElement("div");
		close.title = "close";
		close.innerHTML = "&times;";
		close.style.cssText = toCssText([
			"position: relative",
			"top: 2px",
			"font: bold 17px/1.0 Impact",
			"border: 1px solid #aaaaab",
			"border-top-color: #969696",
			"border-top-left-radius: 0px",
			"border-bottom-left-radius: 0px",
			"border-top-right-radius: 3px",
			"border-bottom-right-radius: 3px",
			"padding: 3px 8px 2px 7px",
			"text-decoration: none",
			"background-color: #eeeeef",
			"color: #525252",
			"display: inline-block",
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
			"z-index: 2147483647",
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
