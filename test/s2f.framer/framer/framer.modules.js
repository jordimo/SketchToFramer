require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ActivityCard":[function(require,module,exports){
var SketchImporter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SketchImporter = require('SketchImporter').SketchImporter;

exports.ActivityCard = (function(superClass) {
  extend(ActivityCard, superClass);

  function ActivityCard(obj) {
    if (obj == null) {
      obj = {};
    }
    ActivityCard.__super__.constructor.call(this, obj);
    obj.file = 'fromSketch/ActivityCard.json';
    obj.page = 'Page-1';
    obj.artboard = 'activityCard';
    this.content = SketchImporter["import"](obj, this);
  }

  ActivityCard.prototype.title = function(txt) {
    if (!txt) {
      return this._titleTxt;
    }
  };

  return ActivityCard;

})(Layer);


},{"SketchImporter":"SketchImporter"}],"SketchImporter":[function(require,module,exports){
var sketchTextLayer;

sketchTextLayer = require('sketchTextLayer').sketchTextLayer;

exports.SketchImporter = {
  FILES_LOADED: [],
  ALIGNMENT: ['left', 'right', 'center', 'justify'],
  CURRENT_ARTBOARD_JSON: {},
  "import": function(obj, parentLayer) {
    var newLayer;
    if (obj == null) {
      obj = {};
    }
    if (!obj.file) {
      throw new Error("SketchImporter : No 'file' defined");
    }
    if (!obj.page) {
      throw new Error("SketchImporter : No 'page' defined");
    }
    if (!obj.artboard) {
      throw new Error("SketchImporter : No 'artboard' defined");
    }
    if (!this.FILES_LOADED[obj.file]) {
      this.FILES_LOADED[obj.file] = {};
    }
    if (!this.FILES_LOADED[obj.file].src) {
      this.FILES_LOADED[obj.file].src = this.loadFile(obj.file);
    }
    newLayer = this.recreateArtBoard(this.FILES_LOADED[obj.file].src, obj.page, obj.artboard);
    newLayer.x = newLayer.y = 0;
    parentLayer.width = newLayer.width;
    parentLayer.height = newLayer.height;
    parentLayer.clip = false;
    newLayer.superLayer = parentLayer;
    newLayer.name = 'content';
    return newLayer;
  },
  loadFile: function(fileName) {
    return JSON.parse(Utils.domLoadDataSync(fileName));
  },
  recreateArtBoard: function(jsonData, $page, $artboard) {
    var _artboard, _pages, c, mainLayer;
    _pages = jsonData.pages[$page];
    _artboard = _pages[$artboard];
    this.CURRENT_ARTBOARD_JSON = _artboard;
    mainLayer = new Layer({
      name: $artboard,
      width: _artboard.frame.width,
      height: _artboard.frame.height,
      backgroundColor: _artboard.backgroundColor || 'transparent',
      clip: false
    });
    for (c in _artboard.children) {
      this.recreateLayers(_artboard.children[c], mainLayer);
    }
    this.cleanUpLayers(mainLayer);
    return mainLayer;
  },
  cleanUpLayers: function(thelayer) {
    var c, i, len, ref, results, tmpLayer;
    if (thelayer.type === 'text') {
      if (thelayer.superLayer.name.indexOf('txt_') > -1) {
        tmpLayer = thelayer.superLayer;
        thelayer.superLayer = tmpLayer.superLayer;
        thelayer.name = tmpLayer.name;
        thelayer.frame = tmpLayer.frame;
        return tmpLayer.destroy();
      }
    } else {
      ref = thelayer.subLayers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        results.push(this.cleanUpLayers(c));
      }
      return results;
    }
  },
  recreateLayers: function(group, parent) {
    var b, c, children, cssShadow, f, flineSpacing, fweight, ht, htmlC, i, imageSrc, j, k, l, len, len1, len2, len3, lh, m, mainAlignment, p, preHt, ref, ref1, ref2, ref3, results, s, textColor;
    if (!group.id) {
      return;
    }
    if (!group.frame) {
      group.frame = parent.frame;
      group.frame.x = 0;
      group.frame.y = 0;
    }
    if (group.type === 'text') {
      l = new sketchTextLayer;
    } else {
      l = new Layer;
    }
    l.superLayer = parent;
    l.name = group.id;
    l.width = Number(group.frame.width);
    l.height = Number(group.frame.height);
    l.x = Number(group.frame.x);
    l.y = Number(group.frame.y);
    l.clip = false;
    l.backgroundColor = group.backgroundColor || 'transparent';
    parent[group.id] = l;
    l.type = group.type;
    if (group.svgContent) {
      htmlC = "<svg id='" + group.id + "' width='100%' height='100%'><g  ";
      if (group.attr.stroke) {
        htmlC += " stroke='" + group.attr.stroke + "' ";
      }
      if (group.attr['stroke-width']) {
        htmlC += " stroke-width='" + group.attr['stroke-width'] + "' ";
      }
      if (group.attr['stroke-linecap']) {
        htmlC += " stroke-linecap='" + group.attr['stroke-linecap'] + "' ";
      }
      if (group.attr.fill) {
        htmlC += " fill='" + group.attr.fill + "' ";
      } else {
        htmlC += " fill='none' ";
      }
      htmlC += ">";
      htmlC += "" + (this.SVGContentToHTML(group.svgContent));
      htmlC += "</g></svg>";
      l.html = htmlC;
    }
    if (group.type === 'image') {
      imageSrc = group.image.src;
      if (imageSrc.indexOf(".framer") > -1) {
        imageSrc = imageSrc.substring(imageSrc.indexOf('framer') + 7, imageSrc.length);
      }
      lh = "<img src='" + imageSrc + "' width='" + group.image.frame.width + "' height='" + group.image.frame.height + "'></img>";
      l.html = lh;
    }
    if (group.type === 'text') {
      mainAlignment = '';
      ht = "";
      ref = group.parts;
      for (i = 0, len = ref.length; i < len; i++) {
        p = ref[i];
        mainAlignment = p.alignment;
        ht += "<span style='" + (this.convertTextObjToStyle(p)) + "'>";
        ht += p.text.split("&nbsp;").join(" ");
        ht += "</span>";
      }
      ht += "</span>";
      mainAlignment = this.ALIGNMENT[mainAlignment];
      preHt = "<div style='text-align:" + mainAlignment + "'>";
      ht = preHt + ht + '</div>';
      l.html += ht;
      fweight = 'normal';
      if (group.parts[0].fontName.toLowerCase().indexOf('bold') > -1) {
        fweight = 'bold';
      }
      textColor = this.rgbToHex(group.parts[0].color);
      if (!group.parts[0].lineSpacing || group.parts[0].lineSpacing === 0) {
        flineSpacing = 'auto';
      } else {
        flineSpacing = group.parts[0].lineSpacing + 'px';
      }
      l.style = l._defaultStyle = {
        'color': textColor,
        'font-family': group.parts[0].fontFamily,
        'font-size': group.parts[0].fontSize + "px",
        'line-height': flineSpacing,
        'font-weight': fweight
      };
    }
    if (group.mask) {
      this.applyMaskToLayer(group.mask, l);
    }
    l.opacity = group.fx.opacity.value;
    if (group.fx.colorControls) {
      l.contrast = Utils.modulate(group.fx.colorControls.contrast, [0, 4], [0, 400]);
      l.hueRotate = Utils.modulate(group.fx.colorControls.hue, [-3.141592653589793, 3.141592653589793], [-180, 180]);
      l.saturate = Utils.modulate(group.fx.colorControls.saturation, [0, 2], [0, 100]);
    }
    if (group.fx.shadows) {
      cssShadow = '';
      ref1 = group.fx.shadows;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        s = ref1[j];
        switch (s.type) {
          case 'box-shadow':
            l.shadowX = s.offX;
            l.shadowY = s.offY;
            l.shadowBlur = s.blurRadius;
            l.shadowSpread = s.spread;
            l.shadowColor = s.color;
            break;
          case 'text-shadow':
            cssShadow += s.offX + "px " + s.offY + "px " + s.blurRadius + "px " + s.color + ",";
        }
      }
      if (cssShadow.length > 0) {
        cssShadow = cssShadow.slice(0, -1);
        l.style = {
          "text-shadow": cssShadow
        };
      }
    }
    if (group.fx.fills && !group.svgContent) {
      ref2 = group.fx.fills;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        f = ref2[k];
        l.style = {
          "background-color": f.color
        };
      }
    }
    if (group.fx.borders) {
      ref3 = group.fx.borders;
      for (m = 0, len3 = ref3.length; m < len3; m++) {
        b = ref3[m];
        l.borderWidth = b.thickness;
        l.borderColor = b.color;
        l.borderRadius = b.radius + "px";
        print(b);
      }
    }
    children = group.children || [];
    results = [];
    for (c in children) {
      results.push(this.recreateLayers(children[c], l));
    }
    return results;
  },
  convertTextObjToStyle: function(obj) {
    var st, textColor;
    st = "";
    textColor = this.rgbToHex(obj.color);
    st += "color:" + textColor + "; ";
    obj.weight = 'normal';
    if (obj.fontName.toLowerCase().indexOf('bold') > -1) {
      obj.weight = 'bold';
    }
    st += "font-weight:" + obj.weight + "; ";
    if (obj.fontFamily) {
      st += "font-family:" + obj.fontFamily + "; ";
    }
    if (obj.fontSize) {
      st += "font-size:" + obj.fontSize + "px; ";
    }
    if (!obj.lineSpacing || obj.lineSpacing === 0) {
      obj.lineSpacing = 'auto';
    } else {
      obj.lineSpacing += 'px';
    }
    st += "line-height:" + obj.lineSpacing + "; ";
    if (!obj.alignment) {
      obj.alignment = 0;
    }
    st += "text-align:" + this.ALIGNMENT[obj.alignment] + ";";
    return st;
  },
  applyMaskToLayer: function(maskInfo, layer) {
    var clipProp, html, m_def, m_def_content, m_use;
    if (!layer.superLayer.masks) {
      layer.superLayer.masks = [];
    }
    m_use = maskInfo.use;
    if (!layer.superLayer.masks[m_use]) {
      html = "<svg width='0' height='0'>";
      m_def = this.CURRENT_ARTBOARD_JSON.defs[m_use];
      delete m_def.id;
      m_def_content = this.SVGContentToHTML([m_def]);
      html += ("<clipPath id='" + m_use + "'>") + m_def_content + "</clipPath>";
      html += "</svg>";
      layer.superLayer.html += html;
      clipProp = "url('#" + m_use + "')";
      layer.superLayer.style = {
        '-webkit-clip-path': clipProp,
        'clip-path': clipProp
      };
      return layer.superLayer.masks[m_use] = true;
    }
  },
  SVGContentToHTML: function(svgArr) {
    var at, htmlStr, i, len, obj;
    htmlStr = "";
    for (i = 0, len = svgArr.length; i < len; i++) {
      obj = svgArr[i];
      htmlStr += "<" + obj.type + " ";
      for (at in obj) {
        htmlStr += " " + at + "='" + obj[at] + "' ";
      }
      htmlStr += "></" + obj.type + ">";
    }
    return htmlStr;
  },
  rgbToHex: function(r, g, b) {
    var rgbArr, rgbStr;
    if (!g) {
      rgbStr = r.substring(r.indexOf('(') + 1, r.lastIndexOf(')'));
      rgbArr = rgbStr.split(',');
      r = rgbArr[0];
      g = rgbArr[1];
      b = rgbArr[2];
    }
    return "#" + ((b * 255 | g * 255 << 8 | r * 255 << 16) / 16777216).toString(16).substring(2);
  }
};


},{"sketchTextLayer":"sketchTextLayer"}],"sketchTextLayer":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.sketchTextLayer = (function(superClass) {
  extend(sketchTextLayer, superClass);

  sketchTextLayer.define("text", {
    get: function() {
      return this._txt;
    },
    set: function(txt) {
      return this.write(txt);
    }
  });

  function sketchTextLayer(obj) {
    if (obj == null) {
      obj = {};
    }
    this._defaultStyle = {};
    sketchTextLayer.__super__.constructor.call(this, obj);
    this._txt = '';
  }

  sketchTextLayer.prototype.write = function(_txt) {
    this.html = _txt;
    return this.txt = _txt;
  };

  return sketchTextLayer;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9yZGkvRG9jdW1lbnRzL1RNQS9HSVRIVUIvU2tldGNoVG9GcmFtZXIvdGVzdC9zMmYuZnJhbWVyL21vZHVsZXMvQWN0aXZpdHlDYXJkLmNvZmZlZSIsIi9Vc2Vycy9qb3JkaS9Eb2N1bWVudHMvVE1BL0dJVEhVQi9Ta2V0Y2hUb0ZyYW1lci90ZXN0L3MyZi5mcmFtZXIvbW9kdWxlcy9Ta2V0Y2hJbXBvcnRlci5jb2ZmZWUiLCIvVXNlcnMvam9yZGkvRG9jdW1lbnRzL1RNQS9HSVRIVUIvU2tldGNoVG9GcmFtZXIvdGVzdC9zMmYuZnJhbWVyL21vZHVsZXMvc2tldGNoVGV4dExheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsY0FBQTtFQUFBOzs7QUFBQyxpQkFBa0IsT0FBQSxDQUFRLGdCQUFSLEVBQWxCOztBQUlLLE9BQU8sQ0FBQzs7O0VBRUUsc0JBQUMsR0FBRDs7TUFBQyxNQUFNOztJQUduQiw4Q0FBTSxHQUFOO0lBRUEsR0FBRyxDQUFDLElBQUosR0FBZ0I7SUFDaEIsR0FBRyxDQUFDLElBQUosR0FBZ0I7SUFDaEIsR0FBRyxDQUFDLFFBQUosR0FBZ0I7SUFFaEIsSUFBQyxDQUFBLE9BQUQsR0FBVyxjQUFjLENBQUMsUUFBRCxDQUFkLENBQXNCLEdBQXRCLEVBQTJCLElBQTNCO0VBVEM7O3lCQWFkLEtBQUEsR0FBUSxTQUFDLEdBQUQ7SUFFTixJQUFHLENBQUMsR0FBSjtBQUNFLGFBQU8sSUFBQyxDQUFBLFVBRFY7O0VBRk07Ozs7R0FmeUI7Ozs7QUNKbkMsSUFBQTs7QUFBQyxrQkFBbUIsT0FBQSxDQUFRLGlCQUFSLEVBQW5COztBQUVELE9BQU8sQ0FBQyxjQUFSLEdBRUU7RUFBQSxZQUFBLEVBQWUsRUFBZjtFQUVBLFNBQUEsRUFBWSxDQUNWLE1BRFUsRUFFVixPQUZVLEVB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RCxDQUErRCxDQUFDLFNBQWhFLENBQTBFLENBQTFFO0VBVEUsQ0E5VVg7Ozs7O0FDRkYsSUFBQTs7O0FBQU0sT0FBTyxDQUFDOzs7RUFFWixlQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFDRTtJQUFBLEdBQUEsRUFBTSxTQUFBO2FBQ0osSUFBQyxDQUFBO0lBREcsQ0FBTjtJQUdBLEdBQUEsRUFBTSxTQUFDLEdBQUQ7YUFDSixJQUFDLENBQUEsS0FBRCxDQUFPLEdBQVA7SUFESSxDQUhOO0dBREY7O0VBT2MseUJBQUMsR0FBRDs7TUFBQyxNQUFNOztJQUVuQixJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUVqQixpREFBTSxHQUFOO0lBRUEsSUFBQyxDQUFBLElBQUQsR0FBUTtFQU5JOzs0QkFTZCxLQUFBLEdBQVEsU0FBQyxJQUFEO0lBRU4sSUFBQyxDQUFBLElBQUQsR0FBUTtXQUNSLElBQUMsQ0FBQSxHQUFELEdBQU87RUFIRDs7OztHQWxCNEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwie1NrZXRjaEltcG9ydGVyfSA9IHJlcXVpcmUgJ1NrZXRjaEltcG9ydGVyJ1xuXG5cblxuY2xhc3MgZXhwb3J0cy5BY3Rpdml0eUNhcmQgZXh0ZW5kcyBMYXllclxuXG4gIGNvbnN0cnVjdG9yIDogKG9iaiA9IHt9KSAtPlxuXG5cbiAgICBzdXBlciBvYmpcblxuICAgIG9iai5maWxlICAgICAgPSAnZnJvbVNrZXRjaC9BY3Rpdml0eUNhcmQuanNvbidcbiAgICBvYmoucGFnZSAgICAgID0gJ1BhZ2UtMSdcbiAgICBvYmouYXJ0Ym9hcmQgID0gJ2FjdGl2aXR5Q2FyZCdcblxuICAgIEBjb250ZW50ID0gU2tldGNoSW1wb3J0ZXIuaW1wb3J0IG9iaiwgQFxuXG5cblxuICB0aXRsZSA6ICh0eHQpIC0+XG5cbiAgICBpZiAhdHh0XG4gICAgICByZXR1cm4gQF90aXRsZVR4dFxuICAgICAgXG4iLCJ7c2tldGNoVGV4dExheWVyfSA9IHJlcXVpcmUgJ3NrZXRjaFRleHRMYXllcidcblxuZXhwb3J0cy5Ta2V0Y2hJbXBvcnRlciA9XG5cbiAgRklMRVNfTE9BREVEIDogW11cblxuICBBTElHTk1FTlQgOiBbXG4gICAgJ2xlZnQnLFxuICAgICdyaWdodCcsXG4gICAgJ2NlbnRlcicsXG4gICAgJ2p1c3RpZnknXG4gIF1cblxuICBDVVJSRU5UX0FSVEJPQVJEX0pTT04gOiB7fVxuXG4gIGltcG9ydCA6IChvYmo9e30sIHBhcmVudExheWVyKSAtPlxuXG4gICAgdGhyb3cgbmV3IEVycm9yIFwiU2tldGNoSW1wb3J0ZXIgOiBObyAnZmlsZScgZGVmaW5lZFwiIGlmICFvYmouZmlsZVxuICAgIHRocm93IG5ldyBFcnJvciBcIlNrZXRjaEltcG9ydGVyIDogTm8gJ3BhZ2UnIGRlZmluZWRcIiBpZiAhb2JqLnBhZ2VcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJTa2V0Y2hJbXBvcnRlciA6IE5vICdhcnRib2FyZCcgZGVmaW5lZFwiIGlmICFvYmouYXJ0Ym9hcmRcblxuXG4gICAgQEZJTEVTX0xPQURFRFtvYmouZmlsZV0gPSB7fSBpZiAhQEZJTEVTX0xPQURFRFtvYmouZmlsZV1cbiAgICBARklMRVNfTE9BREVEW29iai5maWxlXS5zcmMgPSBAbG9hZEZpbGUgb2JqLmZpbGUgaWYgIUBGSUxFU19MT0FERURbb2JqLmZpbGVdLnNyY1xuXG4gICAgbmV3TGF5ZXIgPSBAcmVjcmVhdGVBcnRCb2FyZChARklMRVNfTE9BREVEW29iai5maWxlXS5zcmMsIG9iai5wYWdlLCBvYmouYXJ0Ym9hcmQpXG5cbiAgICBuZXdMYXllci54ID0gbmV3TGF5ZXIueSA9IDBcbiAgICBwYXJlbnRMYXllci53aWR0aCA9IG5ld0xheWVyLndpZHRoXG4gICAgcGFyZW50TGF5ZXIuaGVpZ2h0ID0gbmV3TGF5ZXIuaGVpZ2h0XG4gICAgcGFyZW50TGF5ZXIuY2xpcCA9IGZhbHNlXG4gICAgbmV3TGF5ZXIuc3VwZXJMYXllciA9IHBhcmVudExheWVyXG4gICAgbmV3TGF5ZXIubmFtZSA9ICdjb250ZW50J1xuXG4gICAgcmV0dXJuIG5ld0xheWVyXG5cblxuXG5cbiAgbG9hZEZpbGUgOiAoZmlsZU5hbWUpIC0+XG5cbiAgICByZXR1cm4gSlNPTi5wYXJzZShVdGlscy5kb21Mb2FkRGF0YVN5bmMgZmlsZU5hbWUpXG5cblxuXG5cbiAgcmVjcmVhdGVBcnRCb2FyZCA6IChqc29uRGF0YSwgJHBhZ2UsICRhcnRib2FyZCkgLT5cblxuICAgIF9wYWdlcyAgICA9IGpzb25EYXRhLnBhZ2VzWyRwYWdlXTtcbiAgICBfYXJ0Ym9hcmQgPSBfcGFnZXNbJGFydGJvYXJkXVxuXG4gICAgQENVUlJFTlRfQVJUQk9BUkRfSlNPTiA9IF9hcnRib2FyZFxuXG4gICAgbWFpbkxheWVyID0gbmV3IExheWVyXG4gICAgICBuYW1lICAgIDogJGFydGJvYXJkXG4gICAgICB3aWR0aCAgIDogX2FydGJvYXJkLmZyYW1lLndpZHRoXG4gICAgICBoZWlnaHQgIDogX2FydGJvYXJkLmZyYW1lLmhlaWdodFxuICAgICAgYmFja2dyb3VuZENvbG9yIDogX2FydGJvYXJkLmJhY2tncm91bmRDb2xvciB8fCAndHJhbnNwYXJlbnQnXG4gICAgICBjbGlwIDogZmFsc2VcblxuICAgIGZvciBjIG9mIF9hcnRib2FyZC5jaGlsZHJlblxuICAgICAgQHJlY3JlYXRlTGF5ZXJzIF9hcnRib2FyZC5jaGlsZHJlbltjXSwgbWFpbkxheWVyXG5cbiAgICAjIGNsZWFuIHVwIHRoZSB0ZXh0IGxheWVyc1xuICAgIEBjbGVhblVwTGF5ZXJzIG1haW5MYXllclxuXG4gICAgcmV0dXJuIG1haW5MYXllclxuXG5cblxuICBjbGVhblVwTGF5ZXJzIDogKHRoZWxheWVyKSAtPlxuXG4gICAgaWYgdGhlbGF5ZXIudHlwZSA9PSAndGV4dCdcbiAgICAgIGlmIHRoZWxheWVyLnN1cGVyTGF5ZXIubmFtZS5pbmRleE9mKCd0eHRfJyk+IC0xXG4gICAgICAgIHRtcExheWVyID0gdGhlbGF5ZXIuc3VwZXJMYXllclxuXG4gICAgICAgIHRoZWxheWVyLnN1cGVyTGF5ZXIgPSB0bXBMYXllci5zdXBlckxheWVyXG4gICAgICAgIHRoZWxheWVyLm5hbWUgICAgICAgPSB0bXBMYXllci5uYW1lXG4gICAgICAgIHRoZWxheWVyLmZyYW1lICAgICAgPSB0bXBMYXllci5mcmFtZVxuICAgICAgICB0bXBMYXllci5kZXN0cm95KClcblxuICAgIGVsc2VcbiAgICAgIGZvciBjIGluIHRoZWxheWVyLnN1YkxheWVyc1xuICAgICAgICBAY2xlYW5VcExheWVycyBjXG5cblxuXG5cblxuXG4gIHJlY3JlYXRlTGF5ZXJzIDogKGdyb3VwLCBwYXJlbnQpIC0+XG5cbiAgICBpZiAhZ3JvdXAuaWRcbiAgICAgIHJldHVyblxuXG4gICAgaWYgIWdyb3VwLmZyYW1lXG4gICAgICBncm91cC5mcmFtZSA9IHBhcmVudC5mcmFtZVxuICAgICAgZ3JvdXAuZnJhbWUueCA9IDBcbiAgICAgIGdyb3VwLmZyYW1lLnkgPSAwXG5cbiAgICBpZiBncm91cC50eXBlID09ICd0ZXh0J1xuICAgICAgbCA9IG5ldyBza2V0Y2hUZXh0TGF5ZXJcbiAgICBlbHNlXG4gICAgICBsID0gbmV3IExheWVyXG5cblxuXG4gICAgbC5zdXBlckxheWVyICA9IHBhcmVudFxuICAgIGwubmFtZSAgICAgICAgPSBncm91cC5pZFxuICAgIGwud2lkdGggICAgICAgPSBOdW1iZXIgZ3JvdXAuZnJhbWUud2lkdGhcbiAgICBsLmhlaWdodCAgICAgID0gTnVtYmVyIGdyb3VwLmZyYW1lLmhlaWdodFxuICAgIGwueCAgICAgICAgICAgPSBOdW1iZXIgZ3JvdXAuZnJhbWUueFxuICAgIGwueSAgICAgICAgICAgPSBOdW1iZXIgZ3JvdXAuZnJhbWUueVxuICAgIGwuY2xpcCAgICAgICAgPSBmYWxzZVxuICAgIGwuYmFja2dyb3VuZENvbG9yID0gZ3JvdXAuYmFja2dyb3VuZENvbG9yIHx8ICd0cmFuc3BhcmVudCdcblxuXG4gICAgIyBsLm9uIEV2ZW50cy5DbGljaywgLT5cbiAgICAjICAgcHJpbnQgQG5hbWUgKyBcIiA6XCIgKyBAYmFja2dyb3VuZENvbG9yXG5cbiAgICBwYXJlbnRbZ3JvdXAuaWRdID0gbFxuXG4gICAgbC50eXBlID0gZ3JvdXAudHlwZVxuXG5cblxuICAgIGlmIGdyb3VwLnN2Z0NvbnRlbnRcblxuXG4gICAgICBodG1sQyA9IFwiPHN2ZyBpZD0nI3tncm91cC5pZH0nIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnPjxnICBcIlxuICAgICAgaHRtbEMgKz0gXCIgc3Ryb2tlPScje2dyb3VwLmF0dHIuc3Ryb2tlfScgXCIgaWYgZ3JvdXAuYXR0ci5zdHJva2VcbiAgICAgIGh0bWxDICs9IFwiIHN0cm9rZS13aWR0aD0nI3tncm91cC5hdHRyWydzdHJva2Utd2lkdGgnXX0nIFwiIGlmIGdyb3VwLmF0dHJbJ3N0cm9rZS13aWR0aCddXG4gICAgICBodG1sQyArPSBcIiBzdHJva2UtbGluZWNhcD0nI3tncm91cC5hdHRyWydzdHJva2UtbGluZWNhcCddfScgXCIgaWYgZ3JvdXAuYXR0clsnc3Ryb2tlLWxpbmVjYXAnXVxuXG5cbiAgICAgIGlmIGdyb3VwLmF0dHIuZmlsbFxuICAgICAgICBodG1sQyArPSBcIiBmaWxsPScje2dyb3VwLmF0dHIuZmlsbH0nIFwiXG4gICAgICBlbHNlXG4gICAgICAgIGh0bWxDICs9IFwiIGZpbGw9J25vbmUnIFwiXG4gICAgICBodG1sQyArPSBcIj5cIlxuXG4gICAgICBodG1sQyArPSBcIiN7QFNWR0NvbnRlbnRUb0hUTUwgZ3JvdXAuc3ZnQ29udGVudH1cIlxuXG4gICAgICBodG1sQyArPSBcIjwvZz48L3N2Zz5cIlxuXG4gICAgICBsLmh0bWwgPSBodG1sQ1xuXG5cblxuICAgIGlmIGdyb3VwLnR5cGUgPT0gJ2ltYWdlJ1xuICAgICAgaW1hZ2VTcmMgPSBncm91cC5pbWFnZS5zcmNcblxuICAgICAgaWYgaW1hZ2VTcmMuaW5kZXhPZihcIi5mcmFtZXJcIik+LTFcbiAgICAgICAgaW1hZ2VTcmMgPSBpbWFnZVNyYy5zdWJzdHJpbmcoaW1hZ2VTcmMuaW5kZXhPZignZnJhbWVyJykrNywgaW1hZ2VTcmMubGVuZ3RoKVxuXG4gICAgICBsaCA9IFwiPGltZyBzcmM9JyN7aW1hZ2VTcmN9JyB3aWR0aD0nI3tncm91cC5pbWFnZS5mcmFtZS53aWR0aH0nIGhlaWdodD0nI3tncm91cC5pbWFnZS5mcmFtZS5oZWlnaHR9Jz48L2ltZz5cIlxuXG4gICAgICBsLmh0bWwgPSBsaFxuXG5cbiAgICBpZiBncm91cC50eXBlID09ICd0ZXh0J1xuXG4gICAgICAjIGdvIG92ZXIgdGhlIHBhcnRzIGFuZCByZWNyZWF0ZSB0aGUgY29udGVudFxuICAgICAgbWFpbkFsaWdubWVudCA9ICcnXG4gICAgICBodCA9IFwiXCJcbiAgICAgIGZvciBwIGluIGdyb3VwLnBhcnRzXG4gICAgICAgIG1haW5BbGlnbm1lbnQgPSBwLmFsaWdubWVudFxuICAgICAgICBodCArPSBcIjxzcGFuIHN0eWxlPScje0Bjb252ZXJ0VGV4dE9ialRvU3R5bGUgcH0nPlwiXG4gICAgICAgIGh0ICs9IHAudGV4dC5zcGxpdChcIiZuYnNwO1wiKS5qb2luKFwiIFwiKVxuICAgICAgICBodCArPVwiPC9zcGFuPlwiXG5cbiAgICAgIGh0Kz0gXCI8L3NwYW4+XCJcbiAgICAgIG1haW5BbGlnbm1lbnQgPSBAQUxJR05NRU5UW21haW5BbGlnbm1lbnRdXG5cbiAgICAgIHByZUh0ID0gXCI8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiN7bWFpbkFsaWdubWVudH0nPlwiXG5cbiAgICAgIGh0ID0gcHJlSHQgKyBodCArICc8L2Rpdj4nXG5cbiAgICAgIGwuaHRtbCArPSBodFxuXG5cbiAgICAgICMgc2V0IGRlZmF1bHQgc3R5bGVcblxuICAgICAgZndlaWdodCA9ICdub3JtYWwnXG4gICAgICBmd2VpZ2h0ID0gJ2JvbGQnIGlmIGdyb3VwLnBhcnRzWzBdLmZvbnROYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignYm9sZCcpPi0xXG5cbiAgICAgIHRleHRDb2xvciA9ICBAcmdiVG9IZXggZ3JvdXAucGFydHNbMF0uY29sb3JcblxuICAgICAgaWYgIWdyb3VwLnBhcnRzWzBdLmxpbmVTcGFjaW5nIHx8IGdyb3VwLnBhcnRzWzBdLmxpbmVTcGFjaW5nPT0wXG4gICAgICAgIGZsaW5lU3BhY2luZz0nYXV0bydcbiAgICAgIGVsc2UgZmxpbmVTcGFjaW5nID0gZ3JvdXAucGFydHNbMF0ubGluZVNwYWNpbmcrJ3B4J1xuXG4gICAgICAjIGFzc2lnbiBiYXNpYyBzdHlsZSBmcm9tIHRoZSBmaXJzdCBwYXJ0IGZvciBmdXR1cmUgdXNlc1xuICAgICAgbC5zdHlsZSA9IGwuX2RlZmF1bHRTdHlsZSA9XG4gICAgICAgICAnY29sb3InIDogdGV4dENvbG9yXG4gICAgICAgICAnZm9udC1mYW1pbHknIDogZ3JvdXAucGFydHNbMF0uZm9udEZhbWlseVxuICAgICAgICAgJ2ZvbnQtc2l6ZScgOiBncm91cC5wYXJ0c1swXS5mb250U2l6ZSArIFwicHhcIlxuICAgICAgICAgJ2xpbmUtaGVpZ2h0JyA6IGZsaW5lU3BhY2luZ1xuICAgICAgICAgJ2ZvbnQtd2VpZ2h0JyA6IGZ3ZWlnaHRcblxuICAgIGlmIGdyb3VwLm1hc2tcbiAgICAgIEBhcHBseU1hc2tUb0xheWVyIGdyb3VwLm1hc2ssIGxcblxuXG4gICAgIyBhcHBseSBGWFxuICAgIGwub3BhY2l0eSA9IGdyb3VwLmZ4Lm9wYWNpdHkudmFsdWVcblxuICAgIGlmIGdyb3VwLmZ4LmNvbG9yQ29udHJvbHNcbiAgICAgICMgbC5icmlnaHRuZXNzICs9IDEwMDAwICogZ3JvdXAuZnguY29sb3JDb250cm9scy5icmlnaHRuZXNzXG4gICAgICBsLmNvbnRyYXN0ID0gVXRpbHMubW9kdWxhdGUoIGdyb3VwLmZ4LmNvbG9yQ29udHJvbHMuY29udHJhc3QsIFswLCA0XSwgWzAsIDQwMF0pXG4gICAgICBsLmh1ZVJvdGF0ZSA9IFV0aWxzLm1vZHVsYXRlKGdyb3VwLmZ4LmNvbG9yQ29udHJvbHMuaHVlLCBbLTMuMTQxNTkyNjUzNTg5NzkzLCAzLjE0MTU5MjY1MzU4OTc5M10sIFstMTgwLCAxODBdKVxuICAgICAgbC5zYXR1cmF0ZSA9IFV0aWxzLm1vZHVsYXRlKCBncm91cC5meC5jb2xvckNvbnRyb2xzLnNhdHVyYXRpb24sIFswLCAyXSwgWzAsIDEwMF0pXG5cbiAgICBpZiBncm91cC5meC5zaGFkb3dzXG4gICAgICBjc3NTaGFkb3cgPSAnJ1xuICAgICAgZm9yIHMgaW4gZ3JvdXAuZnguc2hhZG93c1xuICAgICAgICBzd2l0Y2ggcy50eXBlXG4gICAgICAgICAgd2hlbiAnYm94LXNoYWRvdydcbiAgICAgICAgICAgIGwuc2hhZG93WCAgICAgPSBzLm9mZlhcbiAgICAgICAgICAgIGwuc2hhZG93WSAgICAgPSBzLm9mZllcbiAgICAgICAgICAgIGwuc2hhZG93Qmx1ciAgPSBzLmJsdXJSYWRpdXNcbiAgICAgICAgICAgIGwuc2hhZG93U3ByZWFkID0gcy5zcHJlYWRcbiAgICAgICAgICAgIGwuc2hhZG93Q29sb3IgPSBzLmNvbG9yXG5cbiAgICAgICAgICB3aGVuICd0ZXh0LXNoYWRvdydcbiAgICAgICAgICAgIGNzc1NoYWRvdyArPSBcIiN7cy5vZmZYfXB4ICN7cy5vZmZZfXB4ICN7cy5ibHVyUmFkaXVzfXB4ICN7cy5jb2xvcn0sXCJcblxuICAgICAgaWYgY3NzU2hhZG93Lmxlbmd0aCA+IDBcbiAgICAgICAgY3NzU2hhZG93ID0gY3NzU2hhZG93LnNsaWNlKDAsIC0xKVxuXG4gICAgICAgIGwuc3R5bGUgPVxuICAgICAgICAgIFwidGV4dC1zaGFkb3dcIiA6IGNzc1NoYWRvd1xuXG4gICAgaWYgZ3JvdXAuZnguZmlsbHMgJiYgIWdyb3VwLnN2Z0NvbnRlbnRcblxuICAgICAgZm9yIGYgaW4gZ3JvdXAuZnguZmlsbHNcbiAgICAgICAgbC5zdHlsZSA9XG4gICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIgOiBmLmNvbG9yXG5cblxuICAgIGlmIGdyb3VwLmZ4LmJvcmRlcnNcblxuICAgICAgZm9yIGIgaW4gZ3JvdXAuZnguYm9yZGVyc1xuICAgICAgICBsLmJvcmRlcldpZHRoID0gYi50aGlja25lc3NcbiAgICAgICAgbC5ib3JkZXJDb2xvciA9IGIuY29sb3JcbiAgICAgICAgbC5ib3JkZXJSYWRpdXMgPSBiLnJhZGl1cytcInB4XCJcblxuXG4gICAgICAgIHByaW50IGJcblxuXG5cbiAgICBjaGlsZHJlbiA9IGdyb3VwLmNoaWxkcmVuIHx8IFtdXG5cbiAgICBmb3IgYyBvZiBjaGlsZHJlblxuICAgICAgQHJlY3JlYXRlTGF5ZXJzIGNoaWxkcmVuW2NdLCBsXG5cblxuXG5cblxuXG4gIGNvbnZlcnRUZXh0T2JqVG9TdHlsZSA6IChvYmopIC0+XG5cbiAgICAjIHN0ID0gXCJkaXNwbGF5OmlubGluZS1ibG9jazsgXCJcbiAgICBzdCA9IFwiXCJcblxuICAgIHRleHRDb2xvciA9ICBAcmdiVG9IZXggb2JqLmNvbG9yXG4gICAgc3QgKz0gXCJjb2xvcjoje3RleHRDb2xvcn07IFwiXG5cbiAgICBvYmoud2VpZ2h0ID0gJ25vcm1hbCdcbiAgICBvYmoud2VpZ2h0ID0gJ2JvbGQnIGlmIG9iai5mb250TmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2JvbGQnKT4tMVxuXG4gICAgc3QgKz0gXCJmb250LXdlaWdodDoje29iai53ZWlnaHR9OyBcIlxuICAgIHN0ICs9IFwiZm9udC1mYW1pbHk6I3tvYmouZm9udEZhbWlseX07IFwiIGlmIG9iai5mb250RmFtaWx5XG4gICAgc3QgKz0gXCJmb250LXNpemU6I3tvYmouZm9udFNpemV9cHg7IFwiIGlmIG9iai5mb250U2l6ZVxuXG4gICAgaWYgIW9iai5saW5lU3BhY2luZyB8fCBvYmoubGluZVNwYWNpbmc9PTBcbiAgICAgIG9iai5saW5lU3BhY2luZz0nYXV0bydcbiAgICBlbHNlIG9iai5saW5lU3BhY2luZyArPSAncHgnXG4gICAgc3QgKz0gXCJsaW5lLWhlaWdodDoje29iai5saW5lU3BhY2luZ307IFwiXG5cbiAgICBvYmouYWxpZ25tZW50ID0gMCBpZiAhb2JqLmFsaWdubWVudFxuICAgIHN0ICs9IFwidGV4dC1hbGlnbjoje0BBTElHTk1FTlRbb2JqLmFsaWdubWVudF19O1wiXG5cbiAgICByZXR1cm4gc3RcblxuXG5cblxuXG5cbiAgYXBwbHlNYXNrVG9MYXllciA6IChtYXNrSW5mbywgbGF5ZXIpIC0+XG5cblxuICAgIGlmICFsYXllci5zdXBlckxheWVyLm1hc2tzXG4gICAgICBsYXllci5zdXBlckxheWVyLm1hc2tzID0gW11cblxuICAgIG1fdXNlID0gbWFza0luZm8udXNlXG5cbiAgICBpZiAhbGF5ZXIuc3VwZXJMYXllci5tYXNrc1ttX3VzZV1cbiAgICAgIGh0bWwgPSBcIjxzdmcgd2lkdGg9JzAnIGhlaWdodD0nMCc+XCJcblxuICAgICAgbV9kZWYgPSBAQ1VSUkVOVF9BUlRCT0FSRF9KU09OLmRlZnNbbV91c2VdXG4gICAgICBkZWxldGUgbV9kZWYuaWRcblxuICAgICAgbV9kZWZfY29udGVudCA9IEBTVkdDb250ZW50VG9IVE1MIFttX2RlZl1cblxuICAgICAgaHRtbCArPSBcIjxjbGlwUGF0aCBpZD0nI3ttX3VzZX0nPlwiICsgbV9kZWZfY29udGVudCArIFwiPC9jbGlwUGF0aD5cIlxuICAgICAgaHRtbCArPSBcIjwvc3ZnPlwiXG4gICAgICBsYXllci5zdXBlckxheWVyLmh0bWwgKz0gaHRtbFxuXG4gICAgICBjbGlwUHJvcCA9IFwidXJsKCcjI3ttX3VzZX0nKVwiXG5cblxuICAgICAgbGF5ZXIuc3VwZXJMYXllci5zdHlsZSA9XG4gICAgICAgICctd2Via2l0LWNsaXAtcGF0aCcgOiBjbGlwUHJvcFxuICAgICAgICAnY2xpcC1wYXRoJyA6IGNsaXBQcm9wXG5cbiAgICAgIGxheWVyLnN1cGVyTGF5ZXIubWFza3NbbV91c2VdID0gdHJ1ZVxuXG5cblxuICBTVkdDb250ZW50VG9IVE1MIDogKHN2Z0FycikgLT5cblxuICAgIGh0bWxTdHIgPSBcIlwiXG5cbiAgICBmb3Igb2JqIGluIHN2Z0FyclxuICAgICAgaHRtbFN0ciArPSBcIjwje29iai50eXBlfSBcIlxuICAgICAgZm9yIGF0IG9mIG9ialxuICAgICAgICBodG1sU3RyICs9IFwiICN7YXR9PScje29ialthdF19JyBcIlxuICAgICAgaHRtbFN0ciArPSBcIj48LyN7b2JqLnR5cGV9PlwiXG5cbiAgICBodG1sU3RyXG5cblxuXG5cbiAgcmdiVG9IZXggOiAociwgZywgYikgLT5cblxuICAgICAgaWYgIWdcbiAgICAgICAgcmdiU3RyID0gci5zdWJzdHJpbmcoci5pbmRleE9mKCcoJykrMSwgci5sYXN0SW5kZXhPZignKScpKVxuICAgICAgICByZ2JBcnIgPSByZ2JTdHIuc3BsaXQoJywnKVxuICAgICAgICByID0gcmdiQXJyWzBdXG4gICAgICAgIGcgPSByZ2JBcnJbMV1cbiAgICAgICAgYiA9IHJnYkFyclsyXVxuXG4gICAgICBcIiNcIisgKChiKjI1NSB8IGcgKiAyNTUgPDwgOCB8IHIgKjI1NSA8PCAxNikgLyAxNjc3NzIxNikudG9TdHJpbmcoMTYpLnN1YnN0cmluZygyKTtcbiIsIlxuXG5jbGFzcyBleHBvcnRzLnNrZXRjaFRleHRMYXllciBleHRlbmRzIExheWVyXG5cbiAgQGRlZmluZSBcInRleHRcIixcbiAgICBnZXQgOiAoKSAtPlxuICAgICAgQF90eHRcblxuICAgIHNldCA6ICh0eHQpIC0+XG4gICAgICBAd3JpdGUgdHh0XG5cbiAgY29uc3RydWN0b3IgOiAob2JqID0ge30pIC0+XG5cbiAgICBAX2RlZmF1bHRTdHlsZSA9IHt9XG4gICAgXG4gICAgc3VwZXIgb2JqXG5cbiAgICBAX3R4dCA9ICcnXG5cblxuICB3cml0ZSA6IChfdHh0KSAtPlxuXG4gICAgQGh0bWwgPSBfdHh0XG4gICAgQHR4dCA9IF90eHRcbiJdfQ==
