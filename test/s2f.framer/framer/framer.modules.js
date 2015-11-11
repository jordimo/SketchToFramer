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
    this.title_txt.on(Events.Click, function() {
      return this.html = Utils.randomChoice(["Save Rock Creek Park Trees", "Pick up river garbage", "Tennis classes for kids", "Museum visit for kids"]);
    });
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
        ht += "<span style='" + (this.convertTextObjToStyle(p)) + " '>";
        ht += p.text.split("&nbsp;").join(" ");
        ht += "</span>";
      }
      ht += "</span>";
      mainAlignment = this.ALIGNMENT[mainAlignment];
      preHt = "<div style='text-align:" + mainAlignment + "; white-space:pre-wrap;'>";
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
    if (group.fx.opacity) {
      l.opacity = group.fx.opacity.value;
    }
    if (group.fx.colorControls) {
      l.brightness += 10000 * group.fx.colorControls.brightness;
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


},{}],"TopNav":[function(require,module,exports){
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


},{"SketchImporter":"SketchImporter"}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9yZGkvRG9jdW1lbnRzL1RNQS9HSVRIVUIvU2tldGNoVG9GcmFtZXIvdGVzdC9zMmYuZnJhbWVyL21vZHVsZXMvQWN0aXZpdHlDYXJkLmNvZmZlZSIsIi9Vc2Vycy9qb3JkaS9Eb2N1bWVudHMvVE1BL0dJVEhVQi9Ta2V0Y2hUb0ZyYW1lci90ZXN0L3MyZi5mcmFtZXIvbW9kdWxlcy9TaWduSW4uY29mZmVlIiwiL1VzZXJzL2pvcmRpL0RvY3VtZW50cy9UTUEvR0lUSFVCL1NrZXRjaFRvRnJhbWVyL3Rlc3QvczJmLmZyYW1lci9tb2R1bGVzL1NrZXRjaEltcG9ydGVyLmNvZmZlZSIsIi9Vc2Vycy9qb3JkaS9Eb2N1bWVudHMvVE1BL0dJVEhVQi9Ta2V0Y2hUb0ZyYW1lci90ZXN0L3MyZi5mcmFtZXIvbW9kdWxlcy9Ub3BOYXYuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxjQUFBO0VBQUE7OztBQUFDLGlCQUFrQixPQUFBLENBQVEsZ0JBQVIsRUFBbEI7O0FBSUssT0FBTyxDQUFDOzs7RUFFRSxzQkFBQyxHQUFEOztNQUFDLE1BQU07O0lBR25CLDhDQUFNLEdBQU47SUFFQSxHQUFHLENBQUMsSUFBSixHQUFnQjtJQUNoQixHQUFHLENBQUMsSUFBSixHQUFnQjtJQUNoQixHQUFHLENBQUMsUUFBSixHQUFnQjtJQUVoQixJQUFDLENBQUEsT0FBRCxHQUFXLGNBQWMsQ0FBQyxRQUFELENBQWQsQ0FBc0IsR0FBdEIsRUFBMkIsSUFBM0I7SUFHWCxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBUSxDQUFDO0lBUS9CLElBQUMsQ0FBQSxTQUFTLENBQUMsRUFBWCxDQUFjLE1BQU0sQ0FBQyxLQUFyQixFQUE0QixTQUFBO2FBQzFCLElBQUMsQ0FBQSxJQUFELEdBQVEs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QUcsR0FBSCxJQUFVLEVBQWxDLENBQUEsR0FBd0MsUUFBekMsQ0FBa0QsQ0FBQyxRQUFuRCxDQUE0RCxFQUE1RCxDQUErRCxDQUFDLFNBQWhFLENBQTBFLENBQTFFO0VBVEUsQ0FoVlg7Ozs7O0FDRkYsSUFBQSxjQUFBO0VBQUE7OztBQUFDLGlCQUFrQixPQUFBLENBQVEsZ0JBQVIsRUFBbEI7O0FBSUssT0FBTyxDQUFDOzs7RUFFRSxnQkFBQyxHQUFEOztNQUFDLE1BQU07O0lBR25CLHdDQUFNLEdBQU47SUFFQSxHQUFHLENBQUMsSUFBSixHQUFnQjtJQUNoQixHQUFHLENBQUMsSUFBSixHQUFnQjtJQUNoQixHQUFHLENBQUMsUUFBSixHQUFnQjtJQUVoQixJQUFDLENBQUEsT0FBRCxHQUFXLGNBQWMsQ0FBQyxRQUFELENBQWQsQ0FBc0IsR0FBdEIsRUFBMkIsSUFBM0I7RUFUQzs7OztHQUZhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIntTa2V0Y2hJbXBvcnRlcn0gPSByZXF1aXJlICdTa2V0Y2hJbXBvcnRlcidcblxuXG5cbmNsYXNzIGV4cG9ydHMuQWN0aXZpdHlDYXJkIGV4dGVuZHMgTGF5ZXJcblxuICBjb25zdHJ1Y3RvciA6IChvYmogPSB7fSkgLT5cblxuXG4gICAgc3VwZXIgb2JqXG5cbiAgICBvYmouZmlsZSAgICAgID0gJ2Zyb21Ta2V0Y2gvQWN0aXZpdHlDYXJkLmpzb24nXG4gICAgb2JqLnBhZ2UgICAgICA9ICdQYWdlIDEnXG4gICAgb2JqLmFydGJvYXJkICA9ICdhY3Rpdml0eUNhcmQnXG5cbiAgICBAY29udGVudCA9IFNrZXRjaEltcG9ydGVyLmltcG9ydCBvYmosIEBcblxuXG4gICAgQHRpdGxlX3R4dCA9IEBjb250ZW50Lm1vZF9pbmZvLnR4dF90aXRsZVxuICAgICMgXiB0aGlzIGlzIGEgc2hvcnRjdXQgdG8gY2hhbmdlIHRoZSB0aXRsZSB0ZXh0XG4gICAgIyB0aGUgb3JpZ2luYWwgdGV4dCBzdHlsZSBpcyBhcHBsaWVkIHRvIHRoZSBuZXcgaHRtbFxuICAgICNcbiAgICAjIEB0aXRsZV90eHQuaHRtbCA9IFwiQ2hhbmdlIFRoZSBUaXRsZVwiXG4gICAgIyBeIHdpbGwgY2hhbmdlIHRoZSBjb3B5IG9uIHRpdGxlX3R4dCBsYXllclxuXG5cbiAgICBAdGl0bGVfdHh0Lm9uIEV2ZW50cy5DbGljaywgLT5cbiAgICAgIEBodG1sID0gVXRpbHMucmFuZG9tQ2hvaWNlIFtcbiAgICAgICAgXCJTYXZlIFJvY2sgQ3JlZWsgUGFyayBUcmVlc1wiLFxuICAgICAgICBcIlBpY2sgdXAgcml2ZXIgZ2FyYmFnZVwiLFxuICAgICAgICBcIlRlbm5pcyBjbGFzc2VzIGZvciBraWRzXCIsXG4gICAgICAgIFwiTXVzZXVtIHZpc2l0IGZvciBraWRzXCJcbiAgICAgIF1cbiIsIntTa2V0Y2hJbXBvcnRlcn0gPSByZXF1aXJlICdTa2V0Y2hJbXBvcnRlcidcblxuXG5cbmNsYXNzIGV4cG9ydHMuU2lnbkluIGV4dGVuZHMgTGF5ZXJcblxuICBjb25zdHJ1Y3RvciA6IChvYmogPSB7fSkgLT5cblxuXG4gICAgc3VwZXIgb2JqXG5cbiAgICBvYmouZmlsZSAgICAgID0gJ2Zyb21Ta2V0Y2gvQWN0aXZpdHlDYXJkLmpzb24nXG4gICAgb2JqLnBhZ2UgICAgICA9ICdQYWdlIDEnXG4gICAgb2JqLmFydGJvYXJkICA9ICdTaWduX0luX09uYm9hcmRpbmdfMSdcblxuICAgIEBjb250ZW50ID0gU2tldGNoSW1wb3J0ZXIuaW1wb3J0IG9iaiwgQFxuXG5cbiAgICBmb3IgaSBpbiBAY29udGVudC5zdWJMYXllcnNcbiAgICAgIGlmIGkubmFtZS5pbmRleE9mKCdjYXJkXycpPi0xXG4gICAgICAgIGkub24gRXZlbnRzLk1vdXNlT3ZlciwgLT5cbiAgICAgICAgICBAYW5pbWF0ZVxuICAgICAgICAgICAgcHJvcGVydGllcyA6XG4gICAgICAgICAgICAgIHNjYWxlIDogMS4xXG4gICAgICAgICAgICB0aW1lIDogLjJcblxuICAgICAgICBpLm9uIEV2ZW50cy5Nb3VzZU91dCwgLT5cbiAgICAgICAgICBAYW5pbWF0ZVxuICAgICAgICAgICAgcHJvcGVydGllcyA6XG4gICAgICAgICAgICAgIHNjYWxlIDogMVxuICAgICAgICAgICAgdGltZSA6IC4xXG4iLCJleHBvcnRzLlNrZXRjaEltcG9ydGVyID1cblxuICBGSUxFU19MT0FERUQgOiBbXVxuXG4gIEFMSUdOTUVOVCA6IFtcbiAgICAnbGVmdCcsXG4gICAgJ3JpZ2h0JyxcbiAgICAnY2VudGVyJyxcbiAgICAnanVzdGlmeSdcbiAgXVxuXG4gIENVUlJFTlRfQVJUQk9BUkRfSlNPTiA6IHt9XG5cbiAgaW1wb3J0IDogKG9iaj17fSwgcGFyZW50TGF5ZXIpIC0+XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJTa2V0Y2hJbXBvcnRlciA6IE5vICdmaWxlJyBkZWZpbmVkXCIgaWYgIW9iai5maWxlXG4gICAgdGhyb3cgbmV3IEVycm9yIFwiU2tldGNoSW1wb3J0ZXIgOiBObyAncGFnZScgZGVmaW5lZFwiIGlmICFvYmoucGFnZVxuICAgIHRocm93IG5ldyBFcnJvciBcIlNrZXRjaEltcG9ydGVyIDogTm8gJ2FydGJvYXJkJyBkZWZpbmVkXCIgaWYgIW9iai5hcnRib2FyZFxuXG5cbiAgICBARklMRVNfTE9BREVEW29iai5maWxlXSA9IHt9IGlmICFARklMRVNfTE9BREVEW29iai5maWxlXVxuICAgIEBGSUxFU19MT0FERURbb2JqLmZpbGVdLnNyYyA9IEBsb2FkRmlsZSBvYmouZmlsZSBpZiAhQEZJTEVTX0xPQURFRFtvYmouZmlsZV0uc3JjXG5cbiAgICBuZXdMYXllciA9IEByZWNyZWF0ZUFydEJvYXJkKEBGSUxFU19MT0FERURbb2JqLmZpbGVdLnNyYywgb2JqLnBhZ2UsIG9iai5hcnRib2FyZClcblxuICAgIG5ld0xheWVyLnggPSBuZXdMYXllci55ID0gMFxuICAgIHBhcmVudExheWVyLndpZHRoID0gbmV3TGF5ZXIud2lkdGhcbiAgICBwYXJlbnRMYXllci5oZWlnaHQgPSBuZXdMYXllci5oZWlnaHRcbiAgICBwYXJlbnRMYXllci5jbGlwID0gZmFsc2VcbiAgICBuZXdMYXllci5zdXBlckxheWVyID0gcGFyZW50TGF5ZXJcbiAgICBuZXdMYXllci5uYW1lID0gJ2NvbnRlbnQnXG5cbiAgICByZXR1cm4gbmV3TGF5ZXJcblxuXG5cblxuICBsb2FkRmlsZSA6IChmaWxlTmFtZSkgLT5cblxuICAgIHJldHVybiBKU09OLnBhcnNlKFV0aWxzLmRvbUxvYWREYXRhU3luYyBmaWxlTmFtZSlcblxuXG5cblxuICByZWNyZWF0ZUFydEJvYXJkIDogKGpzb25EYXRhLCAkcGFnZSwgJGFydGJvYXJkKSAtPlxuXG4gICAgX3BhZ2VzICAgID0ganNvbkRhdGEucGFnZXNbJHBhZ2VdO1xuICAgIF9hcnRib2FyZCA9IF9wYWdlc1skYXJ0Ym9hcmRdXG5cbiAgICBAQ1VSUkVOVF9BUlRCT0FSRF9KU09OID0gX2FydGJvYXJkXG5cbiAgICBtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcbiAgICAgIG5hbWUgICAgOiAkYXJ0Ym9hcmRcbiAgICAgIHdpZHRoICAgOiBfYXJ0Ym9hcmQuZnJhbWUud2lkdGhcbiAgICAgIGhlaWdodCAgOiBfYXJ0Ym9hcmQuZnJhbWUuaGVpZ2h0XG4gICAgICBiYWNrZ3JvdW5kQ29sb3IgOiBfYXJ0Ym9hcmQuYmFja2dyb3VuZENvbG9yIHx8ICd0cmFuc3BhcmVudCdcbiAgICAgIGNsaXAgOiBmYWxzZVxuXG4gICAgZm9yIGMgb2YgX2FydGJvYXJkLmNoaWxkcmVuXG4gICAgICBAcmVjcmVhdGVMYXllcnMgX2FydGJvYXJkLmNoaWxkcmVuW2NdLCBtYWluTGF5ZXJcblxuICAgICMgY2xlYW4gdXAgdGhlIHRleHQgbGF5ZXJzXG4gICAgQGNsZWFuVXBMYXllcnMgbWFpbkxheWVyXG5cbiAgICByZXR1cm4gbWFpbkxheWVyXG5cblxuXG4gIGNsZWFuVXBMYXllcnMgOiAodGhlbGF5ZXIpIC0+XG5cbiAgICBpZiB0aGVsYXllci50eXBlID09ICd0ZXh0J1xuICAgICAgaWYgdGhlbGF5ZXIuc3VwZXJMYXllci5uYW1lLmluZGV4T2YoJ3R4dF8nKT4gLTFcbiAgICAgICAgdG1wTGF5ZXIgPSB0aGVsYXllci5zdXBlckxheWVyXG5cbiAgICAgICAgdGhlbGF5ZXIuc3VwZXJMYXllciA9IHRtcExheWVyLnN1cGVyTGF5ZXJcbiAgICAgICAgdGhlbGF5ZXIubmFtZSAgICAgICA9IHRtcExheWVyLm5hbWVcbiAgICAgICAgdGhlbGF5ZXIuZnJhbWUgICAgICA9IHRtcExheWVyLmZyYW1lXG4gICAgICAgIHRoZWxheWVyLnN1cGVyTGF5ZXJbdGhlbGF5ZXIubmFtZV0gPSB0aGVsYXllclxuICAgICAgICB0bXBMYXllci5kZXN0cm95KClcblxuICAgIGVsc2VcbiAgICAgIGZvciBjIGluIHRoZWxheWVyLnN1YkxheWVyc1xuICAgICAgICBAY2xlYW5VcExheWVycyBjXG5cblxuXG5cblxuXG4gIHJlY3JlYXRlTGF5ZXJzIDogKGdyb3VwLCBwYXJlbnQpIC0+XG5cbiAgICBpZiAhZ3JvdXAuaWRcbiAgICAgIHJldHVyblxuXG4gICAgaWYgIWdyb3VwLmZyYW1lXG4gICAgICBncm91cC5mcmFtZSA9IHBhcmVudC5mcmFtZVxuICAgICAgZ3JvdXAuZnJhbWUueCA9IDBcbiAgICAgIGdyb3VwLmZyYW1lLnkgPSAwXG5cblxuICAgIGwgPSBuZXcgTGF5ZXJcbiAgICBsLnN1cGVyTGF5ZXIgID0gcGFyZW50XG4gICAgbC5uYW1lICAgICAgICA9IGdyb3VwLmlkXG4gICAgbC53aWR0aCAgICAgICA9IE51bWJlciBncm91cC5mcmFtZS53aWR0aFxuICAgIGwuaGVpZ2h0ICAgICAgPSBOdW1iZXIgZ3JvdXAuZnJhbWUuaGVpZ2h0XG4gICAgbC54ICAgICAgICAgICA9IE51bWJlciBncm91cC5mcmFtZS54XG4gICAgbC55ICAgICAgICAgICA9IE51bWJlciBncm91cC5mcmFtZS55XG4gICAgbC5jbGlwICAgICAgICA9IGZhbHNlXG4gICAgbC5iYWNrZ3JvdW5kQ29sb3IgPSBncm91cC5iYWNrZ3JvdW5kQ29sb3IgfHwgJ3RyYW5zcGFyZW50J1xuXG5cbiAgICAjIGwub24gRXZlbnRzLkNsaWNrLCAtPlxuICAgICMgICAgcHJpbnQgQG5hbWUgKyBcIiA6XCIgKyBAaHRtbFxuXG4gICAgcGFyZW50W2dyb3VwLmlkXSA9IGxcblxuICAgIGwudHlwZSA9IGdyb3VwLnR5cGVcblxuXG5cbiAgICBpZiBncm91cC5zdmdDb250ZW50XG5cblxuICAgICAgaHRtbEMgPSBcIjxzdmcgaWQ9JyN7Z3JvdXAuaWR9JyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJz48ZyAgXCJcbiAgICAgIGh0bWxDICs9IFwiIHN0cm9rZT0nI3tncm91cC5hdHRyLnN0cm9rZX0nIFwiIGlmIGdyb3VwLmF0dHIuc3Ryb2tlXG4gICAgICBodG1sQyArPSBcIiBzdHJva2Utd2lkdGg9JyN7Z3JvdXAuYXR0clsnc3Ryb2tlLXdpZHRoJ119JyBcIiBpZiBncm91cC5hdHRyWydzdHJva2Utd2lkdGgnXVxuICAgICAgaHRtbEMgKz0gXCIgc3Ryb2tlLWxpbmVjYXA9JyN7Z3JvdXAuYXR0clsnc3Ryb2tlLWxpbmVjYXAnXX0nIFwiIGlmIGdyb3VwLmF0dHJbJ3N0cm9rZS1saW5lY2FwJ11cblxuXG4gICAgICBpZiBncm91cC5hdHRyLmZpbGxcbiAgICAgICAgaHRtbEMgKz0gXCIgZmlsbD0nI3tncm91cC5hdHRyLmZpbGx9JyBcIlxuICAgICAgZWxzZVxuICAgICAgICBodG1sQyArPSBcIiBmaWxsPSdub25lJyBcIlxuICAgICAgaHRtbEMgKz0gXCI+XCJcblxuICAgICAgaHRtbEMgKz0gXCIje0BTVkdDb250ZW50VG9IVE1MIGdyb3VwLnN2Z0NvbnRlbnR9XCJcblxuICAgICAgaHRtbEMgKz0gXCI8L2c+PC9zdmc+XCJcblxuICAgICAgbC5odG1sID0gaHRtbENcblxuXG5cbiAgICBpZiBncm91cC50eXBlID09ICdpbWFnZSdcblxuICAgICAgaW1hZ2VTcmMgPSBncm91cC5pbWFnZS5zcmNcblxuICAgICAgaWYgaW1hZ2VTcmMuaW5kZXhPZihcIi5mcmFtZXJcIik+LTFcbiAgICAgICAgaW1hZ2VTcmMgPSBpbWFnZVNyYy5zdWJzdHJpbmcoaW1hZ2VTcmMuaW5kZXhPZignZnJhbWVyJykrNywgaW1hZ2VTcmMubGVuZ3RoKVxuXG4gICAgICBsaCA9IFwiPGltZyBzcmM9JyN7aW1hZ2VTcmN9JyB3aWR0aD0nI3tncm91cC5pbWFnZS5mcmFtZS53aWR0aH0nIGhlaWdodD0nI3tncm91cC5pbWFnZS5mcmFtZS5oZWlnaHR9Jz48L2ltZz5cIlxuXG4gICAgICBsLmh0bWwgPSBsaFxuXG5cbiAgICBpZiBncm91cC50eXBlID09ICd0ZXh0J1xuXG4gICAgICAjIGdvIG92ZXIgdGhlIHBhcnRzIGFuZCByZWNyZWF0ZSB0aGUgY29udGVudFxuICAgICAgbWFpbkFsaWdubWVudCA9ICcnXG4gICAgICBodCA9IFwiXCJcbiAgICAgIGZvciBwIGluIGdyb3VwLnBhcnRzXG4gICAgICAgIG1haW5BbGlnbm1lbnQgPSBwLmFsaWdubWVudFxuICAgICAgICBodCArPSBcIjxzcGFuIHN0eWxlPScje0Bjb252ZXJ0VGV4dE9ialRvU3R5bGUgcH0gJz5cIlxuICAgICAgICBodCArPSBwLnRleHQuc3BsaXQoXCImbmJzcDtcIikuam9pbihcIiBcIilcbiAgICAgICAgaHQgKz1cIjwvc3Bhbj5cIlxuXG4gICAgICBodCs9IFwiPC9zcGFuPlwiXG5cblxuICAgICAgbWFpbkFsaWdubWVudCA9IEBBTElHTk1FTlRbbWFpbkFsaWdubWVudF1cblxuICAgICAgcHJlSHQgPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246I3ttYWluQWxpZ25tZW50fTsgd2hpdGUtc3BhY2U6cHJlLXdyYXA7Jz5cIlxuXG4gICAgICBodCA9IHByZUh0ICsgaHQgKyAnPC9kaXY+J1xuXG4gICAgICBsLmh0bWwgKz0gaHRcblxuXG4gICAgICAjIHNldCBkZWZhdWx0IHN0eWxlXG5cbiAgICAgIGZ3ZWlnaHQgPSAnbm9ybWFsJ1xuICAgICAgZndlaWdodCA9ICdib2xkJyBpZiBncm91cC5wYXJ0c1swXS5mb250TmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2JvbGQnKT4tMVxuXG4gICAgICB0ZXh0Q29sb3IgPSAgQHJnYlRvSGV4IGdyb3VwLnBhcnRzWzBdLmNvbG9yXG5cbiAgICAgIGlmICFncm91cC5wYXJ0c1swXS5saW5lU3BhY2luZyB8fCBncm91cC5wYXJ0c1swXS5saW5lU3BhY2luZz09MFxuICAgICAgICBmbGluZVNwYWNpbmc9J2F1dG8nXG4gICAgICBlbHNlIGZsaW5lU3BhY2luZyA9IGdyb3VwLnBhcnRzWzBdLmxpbmVTcGFjaW5nKydweCdcblxuICAgICAgIyBhc3NpZ24gYmFzaWMgc3R5bGUgZnJvbSB0aGUgZmlyc3QgcGFydCBmb3IgZnV0dXJlIHVzZXNcbiAgICAgIGwuc3R5bGUgPSBsLl9kZWZhdWx0U3R5bGUgPVxuICAgICAgICAgJ2NvbG9yJyA6IHRleHRDb2xvclxuICAgICAgICAgJ2ZvbnQtZmFtaWx5JyA6IGdyb3VwLnBhcnRzWzBdLmZvbnRGYW1pbHlcbiAgICAgICAgICdmb250LXNpemUnIDogZ3JvdXAucGFydHNbMF0uZm9udFNpemUgKyBcInB4XCJcbiAgICAgICAgICdsaW5lLWhlaWdodCcgOiBmbGluZVNwYWNpbmdcbiAgICAgICAgICdmb250LXdlaWdodCcgOiBmd2VpZ2h0XG5cbiAgICBpZiBncm91cC5tYXNrXG4gICAgICBAYXBwbHlNYXNrVG9MYXllciBncm91cC5tYXNrLCBsXG5cblxuXG5cbiAgICAjIGFwcGx5IEZYXG4gICAgbC5vcGFjaXR5ID0gZ3JvdXAuZngub3BhY2l0eS52YWx1ZSBpZiBncm91cC5meC5vcGFjaXR5XG5cblxuXG4gICAgaWYgZ3JvdXAuZnguY29sb3JDb250cm9sc1xuICAgICAgbC5icmlnaHRuZXNzICs9IDEwMDAwICogZ3JvdXAuZnguY29sb3JDb250cm9scy5icmlnaHRuZXNzXG4gICAgICBsLmNvbnRyYXN0ID0gVXRpbHMubW9kdWxhdGUoIGdyb3VwLmZ4LmNvbG9yQ29udHJvbHMuY29udHJhc3QsIFswLCA0XSwgWzAsIDQwMF0pXG4gICAgICBsLmh1ZVJvdGF0ZSA9IFV0aWxzLm1vZHVsYXRlKGdyb3VwLmZ4LmNvbG9yQ29udHJvbHMuaHVlLCBbLTMuMTQxNTkyNjUzNTg5NzkzLCAzLjE0MTU5MjY1MzU4OTc5M10sIFstMTgwLCAxODBdKVxuICAgICAgbC5zYXR1cmF0ZSA9IFV0aWxzLm1vZHVsYXRlKCBncm91cC5meC5jb2xvckNvbnRyb2xzLnNhdHVyYXRpb24sIFswLCAyXSwgWzAsIDEwMF0pXG5cblxuXG4gICAgaWYgZ3JvdXAuZnguc2hhZG93c1xuICAgICAgY3NzU2hhZG93ID0gJydcbiAgICAgIGZvciBzIGluIGdyb3VwLmZ4LnNoYWRvd3NcbiAgICAgICAgc3dpdGNoIHMudHlwZVxuICAgICAgICAgIHdoZW4gJ2JveC1zaGFkb3cnXG4gICAgICAgICAgICBsLnNoYWRvd1ggICAgID0gcy5vZmZYXG4gICAgICAgICAgICBsLnNoYWRvd1kgICAgID0gcy5vZmZZXG4gICAgICAgICAgICBsLnNoYWRvd0JsdXIgID0gcy5ibHVyUmFkaXVzXG4gICAgICAgICAgICBsLnNoYWRvd1NwcmVhZCA9IHMuc3ByZWFkXG4gICAgICAgICAgICBsLnNoYWRvd0NvbG9yID0gcy5jb2xvclxuXG4gICAgICAgICAgd2hlbiAndGV4dC1zaGFkb3cnXG4gICAgICAgICAgICBjc3NTaGFkb3cgKz0gXCIje3Mub2ZmWH1weCAje3Mub2ZmWX1weCAje3MuYmx1clJhZGl1c31weCAje3MuY29sb3J9LFwiXG5cbiAgICAgIGlmIGNzc1NoYWRvdy5sZW5ndGggPiAwXG4gICAgICAgIGNzc1NoYWRvdyA9IGNzc1NoYWRvdy5zbGljZSgwLCAtMSlcblxuICAgICAgICBsLnN0eWxlID1cbiAgICAgICAgICBcInRleHQtc2hhZG93XCIgOiBjc3NTaGFkb3dcblxuXG5cblxuICAgIGlmIGdyb3VwLmZ4LmZpbGxzICYmICFncm91cC5zdmdDb250ZW50XG4gICAgICBmb3IgZiBpbiBncm91cC5meC5maWxsc1xuICAgICAgICBsLnN0eWxlID1cbiAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIiA6IGYuY29sb3JcblxuXG4gICAgaWYgZ3JvdXAuZnguYm9yZGVyc1xuXG4gICAgICBmb3IgYiBpbiBncm91cC5meC5ib3JkZXJzXG4gICAgICAgIGwuYm9yZGVyV2lkdGggPSBiLnRoaWNrbmVzc1xuICAgICAgICBsLmJvcmRlckNvbG9yID0gYi5jb2xvclxuICAgICAgICBsLmJvcmRlclJhZGl1cyA9IGIucmFkaXVzK1wicHhcIlxuXG4gICAgY2hpbGRyZW4gPSBncm91cC5jaGlsZHJlbiB8fCBbXVxuXG4gICAgZm9yIGMgb2YgY2hpbGRyZW5cbiAgICAgIEByZWNyZWF0ZUxheWVycyBjaGlsZHJlbltjXSwgbFxuXG5cblxuXG5cblxuICBjb252ZXJ0VGV4dE9ialRvU3R5bGUgOiAob2JqKSAtPlxuXG4gICAgIyBzdCA9IFwiZGlzcGxheTppbmxpbmUtYmxvY2s7IFwiXG4gICAgc3QgPSBcIlwiXG5cbiAgICB0ZXh0Q29sb3IgPSAgQHJnYlRvSGV4IG9iai5jb2xvclxuICAgIHN0ICs9IFwiY29sb3I6I3t0ZXh0Q29sb3J9OyBcIlxuXG4gICAgb2JqLndlaWdodCA9ICdub3JtYWwnXG4gICAgb2JqLndlaWdodCA9ICdib2xkJyBpZiBvYmouZm9udE5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdib2xkJyk+LTFcblxuICAgIHN0ICs9IFwiZm9udC13ZWlnaHQ6I3tvYmoud2VpZ2h0fTsgXCJcbiAgICBzdCArPSBcImZvbnQtZmFtaWx5OiN7b2JqLmZvbnRGYW1pbHl9OyBcIiBpZiBvYmouZm9udEZhbWlseVxuICAgIHN0ICs9IFwiZm9udC1zaXplOiN7b2JqLmZvbnRTaXplfXB4OyBcIiBpZiBvYmouZm9udFNpemVcblxuICAgIGlmICFvYmoubGluZVNwYWNpbmcgfHwgb2JqLmxpbmVTcGFjaW5nPT0wXG4gICAgICBvYmoubGluZVNwYWNpbmc9J2F1dG8nXG4gICAgZWxzZSBvYmoubGluZVNwYWNpbmcgKz0gJ3B4J1xuICAgIHN0ICs9IFwibGluZS1oZWlnaHQ6I3tvYmoubGluZVNwYWNpbmd9OyBcIlxuXG4gICAgb2JqLmFsaWdubWVudCA9IDAgaWYgIW9iai5hbGlnbm1lbnRcbiAgICBzdCArPSBcInRleHQtYWxpZ246I3tAQUxJR05NRU5UW29iai5hbGlnbm1lbnRdfTtcIlxuXG4gICAgcmV0dXJuIHN0XG5cblxuXG5cblxuXG4gIGFwcGx5TWFza1RvTGF5ZXIgOiAobWFza0luZm8sIGxheWVyKSAtPlxuXG5cbiAgICBpZiAhbGF5ZXIuc3VwZXJMYXllci5tYXNrc1xuICAgICAgbGF5ZXIuc3VwZXJMYXllci5tYXNrcyA9IFtdXG5cbiAgICBtX3VzZSA9IG1hc2tJbmZvLnVzZVxuXG4gICAgaWYgIWxheWVyLnN1cGVyTGF5ZXIubWFza3NbbV91c2VdXG4gICAgICBodG1sID0gXCI8c3ZnIHdpZHRoPScwJyBoZWlnaHQ9JzAnPlwiXG5cbiAgICAgIG1fZGVmID0gQENVUlJFTlRfQVJUQk9BUkRfSlNPTi5kZWZzW21fdXNlXVxuICAgICAgZGVsZXRlIG1fZGVmLmlkXG5cbiAgICAgIG1fZGVmX2NvbnRlbnQgPSBAU1ZHQ29udGVudFRvSFRNTCBbbV9kZWZdXG5cbiAgICAgIGh0bWwgKz0gXCI8Y2xpcFBhdGggaWQ9JyN7bV91c2V9Jz5cIiArIG1fZGVmX2NvbnRlbnQgKyBcIjwvY2xpcFBhdGg+XCJcbiAgICAgIGh0bWwgKz0gXCI8L3N2Zz5cIlxuICAgICAgbGF5ZXIuc3VwZXJMYXllci5odG1sICs9IGh0bWxcblxuICAgICAgY2xpcFByb3AgPSBcInVybCgnIyN7bV91c2V9JylcIlxuXG5cbiAgICAgIGxheWVyLnN1cGVyTGF5ZXIuc3R5bGUgPVxuICAgICAgICAnLXdlYmtpdC1jbGlwLXBhdGgnIDogY2xpcFByb3BcbiAgICAgICAgJ2NsaXAtcGF0aCcgOiBjbGlwUHJvcFxuXG4gICAgICBsYXllci5zdXBlckxheWVyLm1hc2tzW21fdXNlXSA9IHRydWVcblxuXG5cbiAgU1ZHQ29udGVudFRvSFRNTCA6IChzdmdBcnIpIC0+XG5cbiAgICBodG1sU3RyID0gXCJcIlxuXG4gICAgZm9yIG9iaiBpbiBzdmdBcnJcbiAgICAgIGh0bWxTdHIgKz0gXCI8I3tvYmoudHlwZX0gXCJcbiAgICAgIGZvciBhdCBvZiBvYmpcbiAgICAgICAgaHRtbFN0ciArPSBcIiAje2F0fT0nI3tvYmpbYXRdfScgXCJcbiAgICAgIGh0bWxTdHIgKz0gXCI+PC8je29iai50eXBlfT5cIlxuXG4gICAgaHRtbFN0clxuXG5cblxuXG4gIHJnYlRvSGV4IDogKHIsIGcsIGIpIC0+XG5cbiAgICAgIGlmICFnXG4gICAgICAgIHJnYlN0ciA9IHIuc3Vic3RyaW5nKHIuaW5kZXhPZignKCcpKzEsIHIubGFzdEluZGV4T2YoJyknKSlcbiAgICAgICAgcmdiQXJyID0gcmdiU3RyLnNwbGl0KCcsJylcbiAgICAgICAgciA9IHJnYkFyclswXVxuICAgICAgICBnID0gcmdiQXJyWzFdXG4gICAgICAgIGIgPSByZ2JBcnJbMl1cblxuICAgICAgXCIjXCIrICgoYioyNTUgfCBnICogMjU1IDw8IDggfCByICoyNTUgPDwgMTYpIC8gMTY3NzcyMTYpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMik7XG4iLCJ7U2tldGNoSW1wb3J0ZXJ9ID0gcmVxdWlyZSAnU2tldGNoSW1wb3J0ZXInXG5cblxuXG5jbGFzcyBleHBvcnRzLlRvcE5hdiBleHRlbmRzIExheWVyXG5cbiAgY29uc3RydWN0b3IgOiAob2JqID0ge30pIC0+XG5cblxuICAgIHN1cGVyIG9ialxuXG4gICAgb2JqLmZpbGUgICAgICA9ICdmcm9tU2tldGNoL0FjdGl2aXR5Q2FyZC5qc29uJ1xuICAgIG9iai5wYWdlICAgICAgPSAnUGFnZSAxJ1xuICAgIG9iai5hcnRib2FyZCAgPSAndG9wTmF2X29uJ1xuXG4gICAgQGNvbnRlbnQgPSBTa2V0Y2hJbXBvcnRlci5pbXBvcnQgb2JqLCBAXG4iXX0=
