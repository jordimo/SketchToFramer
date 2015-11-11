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
    obj.page = 'Page 1';
    obj.artboard = 'activityCard';
    this.content = SketchImporter["import"](obj, this);
    this.title_txt = this.content.mod_info.txt_title;
    this.title_txt.html = "Change The Title";
  }

  return ActivityCard;

})(Layer);


},{"SketchImporter":"SketchImporter"}],"SignIn":[function(require,module,exports){
var SketchImporter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SketchImporter = require('SketchImporter').SketchImporter;

exports.SignIn = (function(superClass) {
  extend(SignIn, superClass);

  function SignIn(obj) {
    var i, j, len, ref;
    if (obj == null) {
      obj = {};
    }
    SignIn.__super__.constructor.call(this, obj);
    obj.file = 'fromSketch/ActivityCard.json';
    obj.page = 'Page 1';
    obj.artboard = 'Sign_In_Onboarding_1';
    this.content = SketchImporter["import"](obj, this);
    ref = this.content.subLayers;
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      if (i.name.indexOf('card_') > -1) {
        i.on(Events.MouseOver, function() {
          return this.animate({
            properties: {
              scale: 1.1
            },
            time: .2
          });
        });
        i.on(Events.MouseOut, function() {
          return this.animate({
            properties: {
              scale: 1
            },
            time: .1
          });
        });
      }
    }
  }

  return SignIn;

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
        thelayer.superLayer[thelayer.name] = thelayer;
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
    l = new Layer;
    l.superLayer = parent;
    l.name = group.id;
    l.width = Number(group.frame.width);
    l.height = Number(group.frame.height);
    l.x = Number(group.frame.x);
    l.y = Number(group.frame.y);
    l.clip = false;
    l.backgroundColor = group.backgroundColor || 'transparent';
    l.on(Events.Click, function() {
      return print(this.name + " :" + this.html);
    });
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


},{"sketchTextLayer":"sketchTextLayer"}],"TopNav":[function(require,module,exports){
var SketchImporter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SketchImporter = require('SketchImporter').SketchImporter;

exports.TopNav = (function(superClass) {
  extend(TopNav, superClass);

  function TopNav(obj) {
    if (obj == null) {
      obj = {};
    }
    TopNav.__super__.constructor.call(this, obj);
    obj.file = 'fromSketch/ActivityCard.json';
    obj.page = 'Page 1';
    obj.artboard = 'topNav_on';
    this.content = SketchImporter["import"](obj, this);
  }

  return TopNav;

})(Layer);


},{"SketchImporter":"SketchImporter"}],"sketchTextLayer":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9yZGkvRG9jdW1lbnRzL1RNQS9HSVRIVUIvU2tldGNoVG9GcmFtZXIvdGVzdC9zMmYuZnJhbWVyL21vZHVsZXMvQWN0aXZpdHlDYXJkLmNvZmZlZSIsIi9Vc2Vycy9qb3JkaS9Eb2N1bWVudHMvVE1BL0dJVEhVQi9Ta2V0Y2hUb0ZyYW1lci90ZXN0L3MyZi5mcmFtZXIvbW9kdWxlcy9TaWduSW4uY29mZmVlIiwiL1VzZXJzL2pvcmRpL0RvY3VtZW50cy9UTUEvR0lUSFVCL1NrZXRjaFRvRnJhbWVyL3Rlc3QvczJmLmZyYW1lci9tb2R1bGVzL1NrZXRjaEltcG9ydGVyLmNvZmZlZSIsIi9Vc2Vycy9qb3JkaS9Eb2N1bWVudHMvVE1BL0dJVEhVQi9Ta2V0Y2hUb0ZyYW1lci90ZXN0L3MyZi5mcmFtZXIvbW9kdWxlcy9Ub3BOYXYuY29mZmVlIiwiL1VzZXJzL2pvcmRpL0RvY3VtZW50cy9UTUEvR0lUSFVCL1NrZXRjaFRvRnJhbWVyL3Rlc3QvczJmLmZyYW1lci9tb2R1bGVzL3NrZXRjaFRleHRMYXllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLGNBQUE7RUFBQTs7O0FBQUMsaUJBQWtCLE9BQUEsQ0FBUSxnQkFBUixFQUFsQjs7QUFJSyxPQUFPLENBQUM7OztFQUVFLHNCQUFDLEdBQUQ7O01BQUMsTUFBTTs7SUFHbkIsOENBQU0sR0FBTjtJQUVBLEdBQUcsQ0FBQyxJQUFKLEdBQWdCO0lBQ2hCLEdBQUcsQ0FBQyxJQUFKLEdBQWdCO0lBQ2hCLEdBQUcsQ0FBQyxRQUFKLEdBQWdCO0lBRWhCLElBQUMsQ0FBQSxPQUFELEdBQVcsY0FBYyxDQUFDLFFBQUQsQ0FBZCxDQUFzQixHQUF0QixFQUEyQixJQUEzQjtJQUdYLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxR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QixHQUF1QixDQUFBLEdBQUcsR0FBSCxJQUFVLEVBQWxDLENBQUEsR0FBd0MsUUFBekMsQ0FBa0QsQ0FBQyxRQUFuRCxDQUE0RCxFQUE1RCxDQUErRCxDQUFDLFNBQWhFLENBQTBFLENBQTFFO0VBVEUsQ0FsVlg7Ozs7O0FDSkYsSUFBQSxjQUFBO0VBQUE7OztBQUFDLGlCQUFrQixPQUFBLENBQVEsZ0JBQVIsRUFBbEI7O0FBSUssT0FBTyxDQUFDOzs7RUFFRSxnQkFBQyxHQUFEOztNQUFDLE1BQU07O0lBR25CLHdDQUFNLEdBQU47SUFFQSxHQUFHLENBQUMsSUFBSixHQUFnQjtJQUNoQixHQUFHLENBQUMsSUFBSixHQUFnQjtJQUNoQixHQUFHLENBQUMsUUFBSixHQUFnQjtJQUVoQixJQUFDLENBQUEsT0FBRCxHQUFXLGNBQWMsQ0FBQyxRQUFELENBQWQsQ0FBc0IsR0FBdEIsRUFBMkIsSUFBM0I7RUFUQzs7OztHQUZhOzs7O0FDRjdCLElBQUE7OztBQUFNLE9BQU8sQ0FBQzs7O0VBRVosZUFBQyxDQUFBLE1BQUQsQ0FBUSxNQUFSLEVBQ0U7SUFBQSxHQUFBLEVBQU0sU0FBQTthQUNKLElBQUMsQ0FBQTtJQURHLENBQU47SUFHQSxHQUFBLEVBQU0sU0FBQyxHQUFEO2FBQ0osSUFBQyxDQUFBLEtBQUQsQ0FBTyxHQUFQO0lBREksQ0FITjtHQURGOztFQU9jLHlCQUFDLEdBQUQ7O01BQUMsTUFBTTs7SUFFbkIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFFakIsaURBQU0sR0FBTjtJQUVBLElBQUMsQ0FBQSxJQUFELEdBQVE7RUFOSTs7NEJBU2QsS0FBQSxHQUFRLFNBQUMsSUFBRDtJQUVOLElBQUMsQ0FBQSxJQUFELEdBQVE7V0FDUixJQUFDLENBQUEsR0FBRCxHQUFPO0VBSEQ7Ozs7R0FsQjRCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIntTa2V0Y2hJbXBvcnRlcn0gPSByZXF1aXJlICdTa2V0Y2hJbXBvcnRlcidcblxuXG5cbmNsYXNzIGV4cG9ydHMuQWN0aXZpdHlDYXJkIGV4dGVuZHMgTGF5ZXJcblxuICBjb25zdHJ1Y3RvciA6IChvYmogPSB7fSkgLT5cblxuXG4gICAgc3VwZXIgb2JqXG5cbiAgICBvYmouZmlsZSAgICAgID0gJ2Zyb21Ta2V0Y2gvQWN0aXZpdHlDYXJkLmpzb24nXG4gICAgb2JqLnBhZ2UgICAgICA9ICdQYWdlIDEnXG4gICAgb2JqLmFydGJvYXJkICA9ICdhY3Rpdml0eUNhcmQnXG5cbiAgICBAY29udGVudCA9IFNrZXRjaEltcG9ydGVyLmltcG9ydCBvYmosIEBcblxuXG4gICAgQHRpdGxlX3R4dCA9IEBjb250ZW50Lm1vZF9pbmZvLnR4dF90aXRsZVxuXG4gICAgQHRpdGxlX3R4dC5odG1sID0gXCJDaGFuZ2UgVGhlIFRpdGxlXCJcbiIsIntTa2V0Y2hJbXBvcnRlcn0gPSByZXF1aXJlICdTa2V0Y2hJbXBvcnRlcidcblxuXG5cbmNsYXNzIGV4cG9ydHMuU2lnbkluIGV4dGVuZHMgTGF5ZXJcblxuICBjb25zdHJ1Y3RvciA6IChvYmogPSB7fSkgLT5cblxuXG4gICAgc3VwZXIgb2JqXG5cbiAgICBvYmouZmlsZSAgICAgID0gJ2Zyb21Ta2V0Y2gvQWN0aXZpdHlDYXJkLmpzb24nXG4gICAgb2JqLnBhZ2UgICAgICA9ICdQYWdlIDEnXG4gICAgb2JqLmFydGJvYXJkICA9ICdTaWduX0luX09uYm9hcmRpbmdfMSdcblxuICAgIEBjb250ZW50ID0gU2tldGNoSW1wb3J0ZXIuaW1wb3J0IG9iaiwgQFxuXG5cbiAgICBmb3IgaSBpbiBAY29udGVudC5zdWJMYXllcnNcbiAgICAgIGlmIGkubmFtZS5pbmRleE9mKCdjYXJkXycpPi0xXG4gICAgICAgIGkub24gRXZlbnRzLk1vdXNlT3ZlciwgLT5cbiAgICAgICAgICBAYW5pbWF0ZVxuICAgICAgICAgICAgcHJvcGVydGllcyA6XG4gICAgICAgICAgICAgIHNjYWxlIDogMS4xXG4gICAgICAgICAgICB0aW1lIDogLjJcblxuICAgICAgICBpLm9uIEV2ZW50cy5Nb3VzZU91dCwgLT5cbiAgICAgICAgICBAYW5pbWF0ZVxuICAgICAgICAgICAgcHJvcGVydGllcyA6XG4gICAgICAgICAgICAgIHNjYWxlIDogMVxuICAgICAgICAgICAgdGltZSA6IC4xXG4iLCJ7c2tldGNoVGV4dExheWVyfSA9IHJlcXVpcmUgJ3NrZXRjaFRleHRMYXllcidcblxuZXhwb3J0cy5Ta2V0Y2hJbXBvcnRlciA9XG5cbiAgRklMRVNfTE9BREVEIDogW11cblxuICBBTElHTk1FTlQgOiBbXG4gICAgJ2xlZnQnLFxuICAgICdyaWdodCcsXG4gICAgJ2NlbnRlcicsXG4gICAgJ2p1c3RpZnknXG4gIF1cblxuICBDVVJSRU5UX0FSVEJPQVJEX0pTT04gOiB7fVxuXG4gIGltcG9ydCA6IChvYmo9e30sIHBhcmVudExheWVyKSAtPlxuXG4gICAgdGhyb3cgbmV3IEVycm9yIFwiU2tldGNoSW1wb3J0ZXIgOiBObyAnZmlsZScgZGVmaW5lZFwiIGlmICFvYmouZmlsZVxuICAgIHRocm93IG5ldyBFcnJvciBcIlNrZXRjaEltcG9ydGVyIDogTm8gJ3BhZ2UnIGRlZmluZWRcIiBpZiAhb2JqLnBhZ2VcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJTa2V0Y2hJbXBvcnRlciA6IE5vICdhcnRib2FyZCcgZGVmaW5lZFwiIGlmICFvYmouYXJ0Ym9hcmRcblxuXG4gICAgQEZJTEVTX0xPQURFRFtvYmouZmlsZV0gPSB7fSBpZiAhQEZJTEVTX0xPQURFRFtvYmouZmlsZV1cbiAgICBARklMRVNfTE9BREVEW29iai5maWxlXS5zcmMgPSBAbG9hZEZpbGUgb2JqLmZpbGUgaWYgIUBGSUxFU19MT0FERURbb2JqLmZpbGVdLnNyY1xuXG4gICAgbmV3TGF5ZXIgPSBAcmVjcmVhdGVBcnRCb2FyZChARklMRVNfTE9BREVEW29iai5maWxlXS5zcmMsIG9iai5wYWdlLCBvYmouYXJ0Ym9hcmQpXG5cbiAgICBuZXdMYXllci54ID0gbmV3TGF5ZXIueSA9IDBcbiAgICBwYXJlbnRMYXllci53aWR0aCA9IG5ld0xheWVyLndpZHRoXG4gICAgcGFyZW50TGF5ZXIuaGVpZ2h0ID0gbmV3TGF5ZXIuaGVpZ2h0XG4gICAgcGFyZW50TGF5ZXIuY2xpcCA9IGZhbHNlXG4gICAgbmV3TGF5ZXIuc3VwZXJMYXllciA9IHBhcmVudExheWVyXG4gICAgbmV3TGF5ZXIubmFtZSA9ICdjb250ZW50J1xuXG4gICAgcmV0dXJuIG5ld0xheWVyXG5cblxuXG5cbiAgbG9hZEZpbGUgOiAoZmlsZU5hbWUpIC0+XG5cbiAgICByZXR1cm4gSlNPTi5wYXJzZShVdGlscy5kb21Mb2FkRGF0YVN5bmMgZmlsZU5hbWUpXG5cblxuXG5cbiAgcmVjcmVhdGVBcnRCb2FyZCA6IChqc29uRGF0YSwgJHBhZ2UsICRhcnRib2FyZCkgLT5cblxuICAgIF9wYWdlcyAgICA9IGpzb25EYXRhLnBhZ2VzWyRwYWdlXTtcbiAgICBfYXJ0Ym9hcmQgPSBfcGFnZXNbJGFydGJvYXJkXVxuXG4gICAgQENVUlJFTlRfQVJUQk9BUkRfSlNPTiA9IF9hcnRib2FyZFxuXG4gICAgbWFpbkxheWVyID0gbmV3IExheWVyXG4gICAgICBuYW1lICAgIDogJGFydGJvYXJkXG4gICAgICB3aWR0aCAgIDogX2FydGJvYXJkLmZyYW1lLndpZHRoXG4gICAgICBoZWlnaHQgIDogX2FydGJvYXJkLmZyYW1lLmhlaWdodFxuICAgICAgYmFja2dyb3VuZENvbG9yIDogX2FydGJvYXJkLmJhY2tncm91bmRDb2xvciB8fCAndHJhbnNwYXJlbnQnXG4gICAgICBjbGlwIDogZmFsc2VcblxuICAgIGZvciBjIG9mIF9hcnRib2FyZC5jaGlsZHJlblxuICAgICAgQHJlY3JlYXRlTGF5ZXJzIF9hcnRib2FyZC5jaGlsZHJlbltjXSwgbWFpbkxheWVyXG5cbiAgICAjIGNsZWFuIHVwIHRoZSB0ZXh0IGxheWVyc1xuICAgIEBjbGVhblVwTGF5ZXJzIG1haW5MYXllclxuXG4gICAgcmV0dXJuIG1haW5MYXllclxuXG5cblxuICBjbGVhblVwTGF5ZXJzIDogKHRoZWxheWVyKSAtPlxuXG4gICAgaWYgdGhlbGF5ZXIudHlwZSA9PSAndGV4dCdcbiAgICAgIGlmIHRoZWxheWVyLnN1cGVyTGF5ZXIubmFtZS5pbmRleE9mKCd0eHRfJyk+IC0xXG4gICAgICAgIHRtcExheWVyID0gdGhlbGF5ZXIuc3VwZXJMYXllclxuXG4gICAgICAgIHRoZWxheWVyLnN1cGVyTGF5ZXIgPSB0bXBMYXllci5zdXBlckxheWVyXG4gICAgICAgIHRoZWxheWVyLm5hbWUgICAgICAgPSB0bXBMYXllci5uYW1lXG4gICAgICAgIHRoZWxheWVyLmZyYW1lICAgICAgPSB0bXBMYXllci5mcmFtZVxuICAgICAgICB0aGVsYXllci5zdXBlckxheWVyW3RoZWxheWVyLm5hbWVdID0gdGhlbGF5ZXJcbiAgICAgICAgdG1wTGF5ZXIuZGVzdHJveSgpXG5cbiAgICBlbHNlXG4gICAgICBmb3IgYyBpbiB0aGVsYXllci5zdWJMYXllcnNcbiAgICAgICAgQGNsZWFuVXBMYXllcnMgY1xuXG5cblxuXG5cblxuICByZWNyZWF0ZUxheWVycyA6IChncm91cCwgcGFyZW50KSAtPlxuXG4gICAgaWYgIWdyb3VwLmlkXG4gICAgICByZXR1cm5cblxuICAgIGlmICFncm91cC5mcmFtZVxuICAgICAgZ3JvdXAuZnJhbWUgPSBwYXJlbnQuZnJhbWVcbiAgICAgIGdyb3VwLmZyYW1lLnggPSAwXG4gICAgICBncm91cC5mcmFtZS55ID0gMFxuXG4gICAgIyBpZiBncm91cC50eXBlID09ICd0ZXh0J1xuICAgICMgICBsID0gbmV3IHNrZXRjaFRleHRMYXllclxuICAgICMgZWxzZVxuICAgIGwgPSBuZXcgTGF5ZXJcblxuXG5cbiAgICBsLnN1cGVyTGF5ZXIgID0gcGFyZW50XG4gICAgbC5uYW1lICAgICAgICA9IGdyb3VwLmlkXG4gICAgbC53aWR0aCAgICAgICA9IE51bWJlciBncm91cC5mcmFtZS53aWR0aFxuICAgIGwuaGVpZ2h0ICAgICAgPSBOdW1iZXIgZ3JvdXAuZnJhbWUuaGVpZ2h0XG4gICAgbC54ICAgICAgICAgICA9IE51bWJlciBncm91cC5mcmFtZS54XG4gICAgbC55ICAgICAgICAgICA9IE51bWJlciBncm91cC5mcmFtZS55XG4gICAgbC5jbGlwICAgICAgICA9IGZhbHNlXG4gICAgbC5iYWNrZ3JvdW5kQ29sb3IgPSBncm91cC5iYWNrZ3JvdW5kQ29sb3IgfHwgJ3RyYW5zcGFyZW50J1xuXG5cbiAgICBsLm9uIEV2ZW50cy5DbGljaywgLT5cbiAgICAgICBwcmludCBAbmFtZSArIFwiIDpcIiArIEBodG1sXG5cbiAgICBwYXJlbnRbZ3JvdXAuaWRdID0gbFxuXG4gICAgbC50eXBlID0gZ3JvdXAudHlwZVxuXG5cblxuICAgIGlmIGdyb3VwLnN2Z0NvbnRlbnRcblxuXG4gICAgICBodG1sQyA9IFwiPHN2ZyBpZD0nI3tncm91cC5pZH0nIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnPjxnICBcIlxuICAgICAgaHRtbEMgKz0gXCIgc3Ryb2tlPScje2dyb3VwLmF0dHIuc3Ryb2tlfScgXCIgaWYgZ3JvdXAuYXR0ci5zdHJva2VcbiAgICAgIGh0bWxDICs9IFwiIHN0cm9rZS13aWR0aD0nI3tncm91cC5hdHRyWydzdHJva2Utd2lkdGgnXX0nIFwiIGlmIGdyb3VwLmF0dHJbJ3N0cm9rZS13aWR0aCddXG4gICAgICBodG1sQyArPSBcIiBzdHJva2UtbGluZWNhcD0nI3tncm91cC5hdHRyWydzdHJva2UtbGluZWNhcCddfScgXCIgaWYgZ3JvdXAuYXR0clsnc3Ryb2tlLWxpbmVjYXAnXVxuXG5cbiAgICAgIGlmIGdyb3VwLmF0dHIuZmlsbFxuICAgICAgICBodG1sQyArPSBcIiBmaWxsPScje2dyb3VwLmF0dHIuZmlsbH0nIFwiXG4gICAgICBlbHNlXG4gICAgICAgIGh0bWxDICs9IFwiIGZpbGw9J25vbmUnIFwiXG4gICAgICBodG1sQyArPSBcIj5cIlxuXG4gICAgICBodG1sQyArPSBcIiN7QFNWR0NvbnRlbnRUb0hUTUwgZ3JvdXAuc3ZnQ29udGVudH1cIlxuXG4gICAgICBodG1sQyArPSBcIjwvZz48L3N2Zz5cIlxuXG4gICAgICBsLmh0bWwgPSBodG1sQ1xuXG5cblxuICAgIGlmIGdyb3VwLnR5cGUgPT0gJ2ltYWdlJ1xuICAgICAgaW1hZ2VTcmMgPSBncm91cC5pbWFnZS5zcmNcblxuICAgICAgaWYgaW1hZ2VTcmMuaW5kZXhPZihcIi5mcmFtZXJcIik+LTFcbiAgICAgICAgaW1hZ2VTcmMgPSBpbWFnZVNyYy5zdWJzdHJpbmcoaW1hZ2VTcmMuaW5kZXhPZignZnJhbWVyJykrNywgaW1hZ2VTcmMubGVuZ3RoKVxuXG4gICAgICBsaCA9IFwiPGltZyBzcmM9JyN7aW1hZ2VTcmN9JyB3aWR0aD0nI3tncm91cC5pbWFnZS5mcmFtZS53aWR0aH0nIGhlaWdodD0nI3tncm91cC5pbWFnZS5mcmFtZS5oZWlnaHR9Jz48L2ltZz5cIlxuXG4gICAgICBsLmh0bWwgPSBsaFxuXG5cbiAgICBpZiBncm91cC50eXBlID09ICd0ZXh0J1xuXG4gICAgICAjIGdvIG92ZXIgdGhlIHBhcnRzIGFuZCByZWNyZWF0ZSB0aGUgY29udGVudFxuICAgICAgbWFpbkFsaWdubWVudCA9ICcnXG4gICAgICBodCA9IFwiXCJcbiAgICAgIGZvciBwIGluIGdyb3VwLnBhcnRzXG4gICAgICAgIG1haW5BbGlnbm1lbnQgPSBwLmFsaWdubWVudFxuICAgICAgICBodCArPSBcIjxzcGFuIHN0eWxlPScje0Bjb252ZXJ0VGV4dE9ialRvU3R5bGUgcH0nPlwiXG4gICAgICAgIGh0ICs9IHAudGV4dC5zcGxpdChcIiZuYnNwO1wiKS5qb2luKFwiIFwiKVxuICAgICAgICBodCArPVwiPC9zcGFuPlwiXG5cbiAgICAgIGh0Kz0gXCI8L3NwYW4+XCJcbiAgICAgIG1haW5BbGlnbm1lbnQgPSBAQUxJR05NRU5UW21haW5BbGlnbm1lbnRdXG5cbiAgICAgIHByZUh0ID0gXCI8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiN7bWFpbkFsaWdubWVudH0nPlwiXG5cbiAgICAgIGh0ID0gcHJlSHQgKyBodCArICc8L2Rpdj4nXG5cbiAgICAgIGwuaHRtbCArPSBodFxuXG5cbiAgICAgICMgc2V0IGRlZmF1bHQgc3R5bGVcblxuICAgICAgZndlaWdodCA9ICdub3JtYWwnXG4gICAgICBmd2VpZ2h0ID0gJ2JvbGQnIGlmIGdyb3VwLnBhcnRzWzBdLmZvbnROYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignYm9sZCcpPi0xXG5cbiAgICAgIHRleHRDb2xvciA9ICBAcmdiVG9IZXggZ3JvdXAucGFydHNbMF0uY29sb3JcblxuICAgICAgaWYgIWdyb3VwLnBhcnRzWzBdLmxpbmVTcGFjaW5nIHx8IGdyb3VwLnBhcnRzWzBdLmxpbmVTcGFjaW5nPT0wXG4gICAgICAgIGZsaW5lU3BhY2luZz0nYXV0bydcbiAgICAgIGVsc2UgZmxpbmVTcGFjaW5nID0gZ3JvdXAucGFydHNbMF0ubGluZVNwYWNpbmcrJ3B4J1xuXG4gICAgICAjIGFzc2lnbiBiYXNpYyBzdHlsZSBmcm9tIHRoZSBmaXJzdCBwYXJ0IGZvciBmdXR1cmUgdXNlc1xuICAgICAgbC5zdHlsZSA9IGwuX2RlZmF1bHRTdHlsZSA9XG4gICAgICAgICAnY29sb3InIDogdGV4dENvbG9yXG4gICAgICAgICAnZm9udC1mYW1pbHknIDogZ3JvdXAucGFydHNbMF0uZm9udEZhbWlseVxuICAgICAgICAgJ2ZvbnQtc2l6ZScgOiBncm91cC5wYXJ0c1swXS5mb250U2l6ZSArIFwicHhcIlxuICAgICAgICAgJ2xpbmUtaGVpZ2h0JyA6IGZsaW5lU3BhY2luZ1xuICAgICAgICAgJ2ZvbnQtd2VpZ2h0JyA6IGZ3ZWlnaHRcblxuICAgIGlmIGdyb3VwLm1hc2tcbiAgICAgIEBhcHBseU1hc2tUb0xheWVyIGdyb3VwLm1hc2ssIGxcblxuXG5cblxuICAgICMgYXBwbHkgRlhcbiAgICBsLm9wYWNpdHkgPSBncm91cC5meC5vcGFjaXR5LnZhbHVlXG5cblxuXG4gICAgaWYgZ3JvdXAuZnguY29sb3JDb250cm9sc1xuICAgICAgIyBsLmJyaWdodG5lc3MgKz0gMTAwMDAgKiBncm91cC5meC5jb2xvckNvbnRyb2xzLmJyaWdodG5lc3NcbiAgICAgIGwuY29udHJhc3QgPSBVdGlscy5tb2R1bGF0ZSggZ3JvdXAuZnguY29sb3JDb250cm9scy5jb250cmFzdCwgWzAsIDRdLCBbMCwgNDAwXSlcbiAgICAgIGwuaHVlUm90YXRlID0gVXRpbHMubW9kdWxhdGUoZ3JvdXAuZnguY29sb3JDb250cm9scy5odWUsIFstMy4xNDE1OTI2NTM1ODk3OTMsIDMuMTQxNTkyNjUzNTg5NzkzXSwgWy0xODAsIDE4MF0pXG4gICAgICBsLnNhdHVyYXRlID0gVXRpbHMubW9kdWxhdGUoIGdyb3VwLmZ4LmNvbG9yQ29udHJvbHMuc2F0dXJhdGlvbiwgWzAsIDJdLCBbMCwgMTAwXSlcblxuXG5cbiAgICBpZiBncm91cC5meC5zaGFkb3dzXG4gICAgICBjc3NTaGFkb3cgPSAnJ1xuICAgICAgZm9yIHMgaW4gZ3JvdXAuZnguc2hhZG93c1xuICAgICAgICBzd2l0Y2ggcy50eXBlXG4gICAgICAgICAgd2hlbiAnYm94LXNoYWRvdydcbiAgICAgICAgICAgIGwuc2hhZG93WCAgICAgPSBzLm9mZlhcbiAgICAgICAgICAgIGwuc2hhZG93WSAgICAgPSBzLm9mZllcbiAgICAgICAgICAgIGwuc2hhZG93Qmx1ciAgPSBzLmJsdXJSYWRpdXNcbiAgICAgICAgICAgIGwuc2hhZG93U3ByZWFkID0gcy5zcHJlYWRcbiAgICAgICAgICAgIGwuc2hhZG93Q29sb3IgPSBzLmNvbG9yXG5cbiAgICAgICAgICB3aGVuICd0ZXh0LXNoYWRvdydcbiAgICAgICAgICAgIGNzc1NoYWRvdyArPSBcIiN7cy5vZmZYfXB4ICN7cy5vZmZZfXB4ICN7cy5ibHVyUmFkaXVzfXB4ICN7cy5jb2xvcn0sXCJcblxuICAgICAgaWYgY3NzU2hhZG93Lmxlbmd0aCA+IDBcbiAgICAgICAgY3NzU2hhZG93ID0gY3NzU2hhZG93LnNsaWNlKDAsIC0xKVxuXG4gICAgICAgIGwuc3R5bGUgPVxuICAgICAgICAgIFwidGV4dC1zaGFkb3dcIiA6IGNzc1NoYWRvd1xuXG5cblxuXG4gICAgaWYgZ3JvdXAuZnguZmlsbHMgJiYgIWdyb3VwLnN2Z0NvbnRlbnRcbiAgICAgIGZvciBmIGluIGdyb3VwLmZ4LmZpbGxzXG4gICAgICAgIGwuc3R5bGUgPVxuICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiIDogZi5jb2xvclxuXG5cbiAgICBpZiBncm91cC5meC5ib3JkZXJzXG5cbiAgICAgIGZvciBiIGluIGdyb3VwLmZ4LmJvcmRlcnNcbiAgICAgICAgbC5ib3JkZXJXaWR0aCA9IGIudGhpY2tuZXNzXG4gICAgICAgIGwuYm9yZGVyQ29sb3IgPSBiLmNvbG9yXG4gICAgICAgIGwuYm9yZGVyUmFkaXVzID0gYi5yYWRpdXMrXCJweFwiXG5cbiAgICBjaGlsZHJlbiA9IGdyb3VwLmNoaWxkcmVuIHx8IFtdXG5cbiAgICBmb3IgYyBvZiBjaGlsZHJlblxuICAgICAgQHJlY3JlYXRlTGF5ZXJzIGNoaWxkcmVuW2NdLCBsXG5cblxuXG5cblxuXG4gIGNvbnZlcnRUZXh0T2JqVG9TdHlsZSA6IChvYmopIC0+XG5cbiAgICAjIHN0ID0gXCJkaXNwbGF5OmlubGluZS1ibG9jazsgXCJcbiAgICBzdCA9IFwiXCJcblxuICAgIHRleHRDb2xvciA9ICBAcmdiVG9IZXggb2JqLmNvbG9yXG4gICAgc3QgKz0gXCJjb2xvcjoje3RleHRDb2xvcn07IFwiXG5cbiAgICBvYmoud2VpZ2h0ID0gJ25vcm1hbCdcbiAgICBvYmoud2VpZ2h0ID0gJ2JvbGQnIGlmIG9iai5mb250TmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2JvbGQnKT4tMVxuXG4gICAgc3QgKz0gXCJmb250LXdlaWdodDoje29iai53ZWlnaHR9OyBcIlxuICAgIHN0ICs9IFwiZm9udC1mYW1pbHk6I3tvYmouZm9udEZhbWlseX07IFwiIGlmIG9iai5mb250RmFtaWx5XG4gICAgc3QgKz0gXCJmb250LXNpemU6I3tvYmouZm9udFNpemV9cHg7IFwiIGlmIG9iai5mb250U2l6ZVxuXG4gICAgaWYgIW9iai5saW5lU3BhY2luZyB8fCBvYmoubGluZVNwYWNpbmc9PTBcbiAgICAgIG9iai5saW5lU3BhY2luZz0nYXV0bydcbiAgICBlbHNlIG9iai5saW5lU3BhY2luZyArPSAncHgnXG4gICAgc3QgKz0gXCJsaW5lLWhlaWdodDoje29iai5saW5lU3BhY2luZ307IFwiXG5cbiAgICBvYmouYWxpZ25tZW50ID0gMCBpZiAhb2JqLmFsaWdubWVudFxuICAgIHN0ICs9IFwidGV4dC1hbGlnbjoje0BBTElHTk1FTlRbb2JqLmFsaWdubWVudF19O1wiXG5cbiAgICByZXR1cm4gc3RcblxuXG5cblxuXG5cbiAgYXBwbHlNYXNrVG9MYXllciA6IChtYXNrSW5mbywgbGF5ZXIpIC0+XG5cblxuICAgIGlmICFsYXllci5zdXBlckxheWVyLm1hc2tzXG4gICAgICBsYXllci5zdXBlckxheWVyLm1hc2tzID0gW11cblxuICAgIG1fdXNlID0gbWFza0luZm8udXNlXG5cbiAgICBpZiAhbGF5ZXIuc3VwZXJMYXllci5tYXNrc1ttX3VzZV1cbiAgICAgIGh0bWwgPSBcIjxzdmcgd2lkdGg9JzAnIGhlaWdodD0nMCc+XCJcblxuICAgICAgbV9kZWYgPSBAQ1VSUkVOVF9BUlRCT0FSRF9KU09OLmRlZnNbbV91c2VdXG4gICAgICBkZWxldGUgbV9kZWYuaWRcblxuICAgICAgbV9kZWZfY29udGVudCA9IEBTVkdDb250ZW50VG9IVE1MIFttX2RlZl1cblxuICAgICAgaHRtbCArPSBcIjxjbGlwUGF0aCBpZD0nI3ttX3VzZX0nPlwiICsgbV9kZWZfY29udGVudCArIFwiPC9jbGlwUGF0aD5cIlxuICAgICAgaHRtbCArPSBcIjwvc3ZnPlwiXG4gICAgICBsYXllci5zdXBlckxheWVyLmh0bWwgKz0gaHRtbFxuXG4gICAgICBjbGlwUHJvcCA9IFwidXJsKCcjI3ttX3VzZX0nKVwiXG5cblxuICAgICAgbGF5ZXIuc3VwZXJMYXllci5zdHlsZSA9XG4gICAgICAgICctd2Via2l0LWNsaXAtcGF0aCcgOiBjbGlwUHJvcFxuICAgICAgICAnY2xpcC1wYXRoJyA6IGNsaXBQcm9wXG5cbiAgICAgIGxheWVyLnN1cGVyTGF5ZXIubWFza3NbbV91c2VdID0gdHJ1ZVxuXG5cblxuICBTVkdDb250ZW50VG9IVE1MIDogKHN2Z0FycikgLT5cblxuICAgIGh0bWxTdHIgPSBcIlwiXG5cbiAgICBmb3Igb2JqIGluIHN2Z0FyclxuICAgICAgaHRtbFN0ciArPSBcIjwje29iai50eXBlfSBcIlxuICAgICAgZm9yIGF0IG9mIG9ialxuICAgICAgICBodG1sU3RyICs9IFwiICN7YXR9PScje29ialthdF19JyBcIlxuICAgICAgaHRtbFN0ciArPSBcIj48LyN7b2JqLnR5cGV9PlwiXG5cbiAgICBodG1sU3RyXG5cblxuXG5cbiAgcmdiVG9IZXggOiAociwgZywgYikgLT5cblxuICAgICAgaWYgIWdcbiAgICAgICAgcmdiU3RyID0gci5zdWJzdHJpbmcoci5pbmRleE9mKCcoJykrMSwgci5sYXN0SW5kZXhPZignKScpKVxuICAgICAgICByZ2JBcnIgPSByZ2JTdHIuc3BsaXQoJywnKVxuICAgICAgICByID0gcmdiQXJyWzBdXG4gICAgICAgIGcgPSByZ2JBcnJbMV1cbiAgICAgICAgYiA9IHJnYkFyclsyXVxuXG4gICAgICBcIiNcIisgKChiKjI1NSB8IGcgKiAyNTUgPDwgOCB8IHIgKjI1NSA8PCAxNikgLyAxNjc3NzIxNikudG9TdHJpbmcoMTYpLnN1YnN0cmluZygyKTtcbiIsIntTa2V0Y2hJbXBvcnRlcn0gPSByZXF1aXJlICdTa2V0Y2hJbXBvcnRlcidcblxuXG5cbmNsYXNzIGV4cG9ydHMuVG9wTmF2IGV4dGVuZHMgTGF5ZXJcblxuICBjb25zdHJ1Y3RvciA6IChvYmogPSB7fSkgLT5cblxuXG4gICAgc3VwZXIgb2JqXG5cbiAgICBvYmouZmlsZSAgICAgID0gJ2Zyb21Ta2V0Y2gvQWN0aXZpdHlDYXJkLmpzb24nXG4gICAgb2JqLnBhZ2UgICAgICA9ICdQYWdlIDEnXG4gICAgb2JqLmFydGJvYXJkICA9ICd0b3BOYXZfb24nXG5cbiAgICBAY29udGVudCA9IFNrZXRjaEltcG9ydGVyLmltcG9ydCBvYmosIEBcbiIsIlxuXG5jbGFzcyBleHBvcnRzLnNrZXRjaFRleHRMYXllciBleHRlbmRzIExheWVyXG5cbiAgQGRlZmluZSBcInRleHRcIixcbiAgICBnZXQgOiAoKSAtPlxuICAgICAgQF90eHRcblxuICAgIHNldCA6ICh0eHQpIC0+XG4gICAgICBAd3JpdGUgdHh0XG5cbiAgY29uc3RydWN0b3IgOiAob2JqID0ge30pIC0+XG5cbiAgICBAX2RlZmF1bHRTdHlsZSA9IHt9XG4gICAgXG4gICAgc3VwZXIgb2JqXG5cbiAgICBAX3R4dCA9ICcnXG5cblxuICB3cml0ZSA6IChfdHh0KSAtPlxuXG4gICAgQGh0bWwgPSBfdHh0XG4gICAgQHR4dCA9IF90eHRcbiJdfQ==
