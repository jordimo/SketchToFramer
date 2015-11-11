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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9yZGkvRG9jdW1lbnRzL1RNQS9HSVRIVUIvU2tldGNoVG9GcmFtZXIvdGVzdC9zMmYuZnJhbWVyL21vZHVsZXMvQWN0aXZpdHlDYXJkLmNvZmZlZSIsIi9Vc2Vycy9qb3JkaS9Eb2N1bWVudHMvVE1BL0dJVEhVQi9Ta2V0Y2hUb0ZyYW1lci90ZXN0L3MyZi5mcmFtZXIvbW9kdWxlcy9TaWduSW4uY29mZmVlIiwiL1VzZXJzL2pvcmRpL0RvY3VtZW50cy9UTUEvR0lUSFVCL1NrZXRjaFRvRnJhbWVyL3Rlc3QvczJmLmZyYW1lci9tb2R1bGVzL1NrZXRjaEltcG9ydGVyLmNvZmZlZSIsIi9Vc2Vycy9qb3JkaS9Eb2N1bWVudHMvVE1BL0dJVEhVQi9Ta2V0Y2hUb0ZyYW1lci90ZXN0L3MyZi5mcmFtZXIvbW9kdWxlcy9Ub3BOYXYuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxjQUFBO0VBQUE7OztBQUFDLGlCQUFrQixPQUFBLENBQVEsZ0JBQVIsRUFBbEI7O0FBSUssT0FBTyxDQUFDOzs7RUFFRSxzQkFBQyxHQUFEOztNQUFDLE1BQU07O0lBR25CLDhDQUFNLEdBQU47SUFFQSxHQUFHLENBQUMsSUFBSixHQUFnQjtJQUNoQixHQUFHLENBQUMsSUFBSixHQUFnQjtJQUNoQixHQUFHLENBQUMsUUFBSixHQUFnQjtJQUVoQixJQUFDLENBQUEsT0FBRCxHQUFXLGNBQWMsQ0FBQyxRQUFELENBQWQsQ0FBc0IsR0FBdEIsRUFBMkIsSUFBM0I7SUFHWCxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBUSxDQUFDO0VBWm5COzs7O0dBRm1COzs7O0FDSm5DLElBQUEsY0FBQTtFQUFBOzs7QUFBQyxpQkFBa0IsT0FBQSxDQUFRLGdCQUFSLEVBQWxCOztBQUlLLE9BQU8sQ0FB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Ozs7RUFFRSxnQkFBQyxHQUFEOztNQUFDLE1BQU07O0lBR25CLHdDQUFNLEdBQU47SUFFQSxHQUFHLENBQUMsSUFBSixHQUFnQjtJQUNoQixHQUFHLENBQUMsSUFBSixHQUFnQjtJQUNoQixHQUFHLENBQUMsUUFBSixHQUFnQjtJQUVoQixJQUFDLENBQUEsT0FBRCxHQUFXLGNBQWMsQ0FBQyxRQUFELENBQWQsQ0FBc0IsR0FBdEIsRUFBMkIsSUFBM0I7RUFUQzs7OztHQUZhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIntTa2V0Y2hJbXBvcnRlcn0gPSByZXF1aXJlICdTa2V0Y2hJbXBvcnRlcidcblxuXG5cbmNsYXNzIGV4cG9ydHMuQWN0aXZpdHlDYXJkIGV4dGVuZHMgTGF5ZXJcblxuICBjb25zdHJ1Y3RvciA6IChvYmogPSB7fSkgLT5cblxuXG4gICAgc3VwZXIgb2JqXG5cbiAgICBvYmouZmlsZSAgICAgID0gJ2Zyb21Ta2V0Y2gvQWN0aXZpdHlDYXJkLmpzb24nXG4gICAgb2JqLnBhZ2UgICAgICA9ICdQYWdlIDEnXG4gICAgb2JqLmFydGJvYXJkICA9ICdhY3Rpdml0eUNhcmQnXG5cbiAgICBAY29udGVudCA9IFNrZXRjaEltcG9ydGVyLmltcG9ydCBvYmosIEBcblxuXG4gICAgQHRpdGxlX3R4dCA9IEBjb250ZW50Lm1vZF9pbmZvLnR4dF90aXRsZVxuICAgICMgXiB0aGlzIGlzIGEgc2hvcnRjdXQgdG8gY2hhbmdlIHRoZSB0aXRsZSB0ZXh0XG4gICAgIyB0aGUgb3JpZ2luYWwgdGV4dCBzdHlsZSBpcyBhcHBsaWVkIHRvIHRoZSBuZXcgaHRtbFxuICAgICNcbiAgICAjIEB0aXRsZV90eHQuaHRtbCA9IFwiQ2hhbmdlIFRoZSBUaXRsZVwiXG4gICAgIyBeIHdpbGwgY2hhbmdlIHRoZSBjb3B5IG9uIHRpdGxlX3R4dCBsYXllclxuIiwie1NrZXRjaEltcG9ydGVyfSA9IHJlcXVpcmUgJ1NrZXRjaEltcG9ydGVyJ1xuXG5cblxuY2xhc3MgZXhwb3J0cy5TaWduSW4gZXh0ZW5kcyBMYXllclxuXG4gIGNvbnN0cnVjdG9yIDogKG9iaiA9IHt9KSAtPlxuXG5cbiAgICBzdXBlciBvYmpcblxuICAgIG9iai5maWxlICAgICAgPSAnZnJvbVNrZXRjaC9BY3Rpdml0eUNhcmQuanNvbidcbiAgICBvYmoucGFnZSAgICAgID0gJ1BhZ2UgMSdcbiAgICBvYmouYXJ0Ym9hcmQgID0gJ1NpZ25fSW5fT25ib2FyZGluZ18xJ1xuXG4gICAgQGNvbnRlbnQgPSBTa2V0Y2hJbXBvcnRlci5pbXBvcnQgb2JqLCBAXG5cblxuICAgIGZvciBpIGluIEBjb250ZW50LnN1YkxheWVyc1xuICAgICAgaWYgaS5uYW1lLmluZGV4T2YoJ2NhcmRfJyk+LTFcbiAgICAgICAgaS5vbiBFdmVudHMuTW91c2VPdmVyLCAtPlxuICAgICAgICAgIEBhbmltYXRlXG4gICAgICAgICAgICBwcm9wZXJ0aWVzIDpcbiAgICAgICAgICAgICAgc2NhbGUgOiAxLjFcbiAgICAgICAgICAgIHRpbWUgOiAuMlxuXG4gICAgICAgIGkub24gRXZlbnRzLk1vdXNlT3V0LCAtPlxuICAgICAgICAgIEBhbmltYXRlXG4gICAgICAgICAgICBwcm9wZXJ0aWVzIDpcbiAgICAgICAgICAgICAgc2NhbGUgOiAxXG4gICAgICAgICAgICB0aW1lIDogLjFcbiIsImV4cG9ydHMuU2tldGNoSW1wb3J0ZXIgPVxuXG4gIEZJTEVTX0xPQURFRCA6IFtdXG5cbiAgQUxJR05NRU5UIDogW1xuICAgICdsZWZ0JyxcbiAgICAncmlnaHQnLFxuICAgICdjZW50ZXInLFxuICAgICdqdXN0aWZ5J1xuICBdXG5cbiAgQ1VSUkVOVF9BUlRCT0FSRF9KU09OIDoge31cblxuICBpbXBvcnQgOiAob2JqPXt9LCBwYXJlbnRMYXllcikgLT5cblxuICAgIHRocm93IG5ldyBFcnJvciBcIlNrZXRjaEltcG9ydGVyIDogTm8gJ2ZpbGUnIGRlZmluZWRcIiBpZiAhb2JqLmZpbGVcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJTa2V0Y2hJbXBvcnRlciA6IE5vICdwYWdlJyBkZWZpbmVkXCIgaWYgIW9iai5wYWdlXG4gICAgdGhyb3cgbmV3IEVycm9yIFwiU2tldGNoSW1wb3J0ZXIgOiBObyAnYXJ0Ym9hcmQnIGRlZmluZWRcIiBpZiAhb2JqLmFydGJvYXJkXG5cblxuICAgIEBGSUxFU19MT0FERURbb2JqLmZpbGVdID0ge30gaWYgIUBGSUxFU19MT0FERURbb2JqLmZpbGVdXG4gICAgQEZJTEVTX0xPQURFRFtvYmouZmlsZV0uc3JjID0gQGxvYWRGaWxlIG9iai5maWxlIGlmICFARklMRVNfTE9BREVEW29iai5maWxlXS5zcmNcblxuICAgIG5ld0xheWVyID0gQHJlY3JlYXRlQXJ0Qm9hcmQoQEZJTEVTX0xPQURFRFtvYmouZmlsZV0uc3JjLCBvYmoucGFnZSwgb2JqLmFydGJvYXJkKVxuXG4gICAgbmV3TGF5ZXIueCA9IG5ld0xheWVyLnkgPSAwXG4gICAgcGFyZW50TGF5ZXIud2lkdGggPSBuZXdMYXllci53aWR0aFxuICAgIHBhcmVudExheWVyLmhlaWdodCA9IG5ld0xheWVyLmhlaWdodFxuICAgIHBhcmVudExheWVyLmNsaXAgPSBmYWxzZVxuICAgIG5ld0xheWVyLnN1cGVyTGF5ZXIgPSBwYXJlbnRMYXllclxuICAgIG5ld0xheWVyLm5hbWUgPSAnY29udGVudCdcblxuICAgIHJldHVybiBuZXdMYXllclxuXG5cblxuXG4gIGxvYWRGaWxlIDogKGZpbGVOYW1lKSAtPlxuXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoVXRpbHMuZG9tTG9hZERhdGFTeW5jIGZpbGVOYW1lKVxuXG5cblxuXG4gIHJlY3JlYXRlQXJ0Qm9hcmQgOiAoanNvbkRhdGEsICRwYWdlLCAkYXJ0Ym9hcmQpIC0+XG5cbiAgICBfcGFnZXMgICAgPSBqc29uRGF0YS5wYWdlc1skcGFnZV07XG4gICAgX2FydGJvYXJkID0gX3BhZ2VzWyRhcnRib2FyZF1cblxuICAgIEBDVVJSRU5UX0FSVEJPQVJEX0pTT04gPSBfYXJ0Ym9hcmRcblxuICAgIG1haW5MYXllciA9IG5ldyBMYXllclxuICAgICAgbmFtZSAgICA6ICRhcnRib2FyZFxuICAgICAgd2lkdGggICA6IF9hcnRib2FyZC5mcmFtZS53aWR0aFxuICAgICAgaGVpZ2h0ICA6IF9hcnRib2FyZC5mcmFtZS5oZWlnaHRcbiAgICAgIGJhY2tncm91bmRDb2xvciA6IF9hcnRib2FyZC5iYWNrZ3JvdW5kQ29sb3IgfHwgJ3RyYW5zcGFyZW50J1xuICAgICAgY2xpcCA6IGZhbHNlXG5cbiAgICBmb3IgYyBvZiBfYXJ0Ym9hcmQuY2hpbGRyZW5cbiAgICAgIEByZWNyZWF0ZUxheWVycyBfYXJ0Ym9hcmQuY2hpbGRyZW5bY10sIG1haW5MYXllclxuXG4gICAgIyBjbGVhbiB1cCB0aGUgdGV4dCBsYXllcnNcbiAgICBAY2xlYW5VcExheWVycyBtYWluTGF5ZXJcblxuICAgIHJldHVybiBtYWluTGF5ZXJcblxuXG5cbiAgY2xlYW5VcExheWVycyA6ICh0aGVsYXllcikgLT5cblxuICAgIGlmIHRoZWxheWVyLnR5cGUgPT0gJ3RleHQnXG4gICAgICBpZiB0aGVsYXllci5zdXBlckxheWVyLm5hbWUuaW5kZXhPZigndHh0XycpPiAtMVxuICAgICAgICB0bXBMYXllciA9IHRoZWxheWVyLnN1cGVyTGF5ZXJcblxuICAgICAgICB0aGVsYXllci5zdXBlckxheWVyID0gdG1wTGF5ZXIuc3VwZXJMYXllclxuICAgICAgICB0aGVsYXllci5uYW1lICAgICAgID0gdG1wTGF5ZXIubmFtZVxuICAgICAgICB0aGVsYXllci5mcmFtZSAgICAgID0gdG1wTGF5ZXIuZnJhbWVcbiAgICAgICAgdGhlbGF5ZXIuc3VwZXJMYXllclt0aGVsYXllci5uYW1lXSA9IHRoZWxheWVyXG4gICAgICAgIHRtcExheWVyLmRlc3Ryb3koKVxuXG4gICAgZWxzZVxuICAgICAgZm9yIGMgaW4gdGhlbGF5ZXIuc3ViTGF5ZXJzXG4gICAgICAgIEBjbGVhblVwTGF5ZXJzIGNcblxuXG5cblxuXG5cbiAgcmVjcmVhdGVMYXllcnMgOiAoZ3JvdXAsIHBhcmVudCkgLT5cblxuICAgIGlmICFncm91cC5pZFxuICAgICAgcmV0dXJuXG5cbiAgICBpZiAhZ3JvdXAuZnJhbWVcbiAgICAgIGdyb3VwLmZyYW1lID0gcGFyZW50LmZyYW1lXG4gICAgICBncm91cC5mcmFtZS54ID0gMFxuICAgICAgZ3JvdXAuZnJhbWUueSA9IDBcblxuXG4gICAgbCA9IG5ldyBMYXllclxuICAgIGwuc3VwZXJMYXllciAgPSBwYXJlbnRcbiAgICBsLm5hbWUgICAgICAgID0gZ3JvdXAuaWRcbiAgICBsLndpZHRoICAgICAgID0gTnVtYmVyIGdyb3VwLmZyYW1lLndpZHRoXG4gICAgbC5oZWlnaHQgICAgICA9IE51bWJlciBncm91cC5mcmFtZS5oZWlnaHRcbiAgICBsLnggICAgICAgICAgID0gTnVtYmVyIGdyb3VwLmZyYW1lLnhcbiAgICBsLnkgICAgICAgICAgID0gTnVtYmVyIGdyb3VwLmZyYW1lLnlcbiAgICBsLmNsaXAgICAgICAgID0gZmFsc2VcbiAgICBsLmJhY2tncm91bmRDb2xvciA9IGdyb3VwLmJhY2tncm91bmRDb2xvciB8fCAndHJhbnNwYXJlbnQnXG5cblxuICAgICMgbC5vbiBFdmVudHMuQ2xpY2ssIC0+XG4gICAgIyAgICBwcmludCBAbmFtZSArIFwiIDpcIiArIEBodG1sXG5cbiAgICBwYXJlbnRbZ3JvdXAuaWRdID0gbFxuXG4gICAgbC50eXBlID0gZ3JvdXAudHlwZVxuXG5cblxuICAgIGlmIGdyb3VwLnN2Z0NvbnRlbnRcblxuXG4gICAgICBodG1sQyA9IFwiPHN2ZyBpZD0nI3tncm91cC5pZH0nIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnPjxnICBcIlxuICAgICAgaHRtbEMgKz0gXCIgc3Ryb2tlPScje2dyb3VwLmF0dHIuc3Ryb2tlfScgXCIgaWYgZ3JvdXAuYXR0ci5zdHJva2VcbiAgICAgIGh0bWxDICs9IFwiIHN0cm9rZS13aWR0aD0nI3tncm91cC5hdHRyWydzdHJva2Utd2lkdGgnXX0nIFwiIGlmIGdyb3VwLmF0dHJbJ3N0cm9rZS13aWR0aCddXG4gICAgICBodG1sQyArPSBcIiBzdHJva2UtbGluZWNhcD0nI3tncm91cC5hdHRyWydzdHJva2UtbGluZWNhcCddfScgXCIgaWYgZ3JvdXAuYXR0clsnc3Ryb2tlLWxpbmVjYXAnXVxuXG5cbiAgICAgIGlmIGdyb3VwLmF0dHIuZmlsbFxuICAgICAgICBodG1sQyArPSBcIiBmaWxsPScje2dyb3VwLmF0dHIuZmlsbH0nIFwiXG4gICAgICBlbHNlXG4gICAgICAgIGh0bWxDICs9IFwiIGZpbGw9J25vbmUnIFwiXG4gICAgICBodG1sQyArPSBcIj5cIlxuXG4gICAgICBodG1sQyArPSBcIiN7QFNWR0NvbnRlbnRUb0hUTUwgZ3JvdXAuc3ZnQ29udGVudH1cIlxuXG4gICAgICBodG1sQyArPSBcIjwvZz48L3N2Zz5cIlxuXG4gICAgICBsLmh0bWwgPSBodG1sQ1xuXG5cblxuICAgIGlmIGdyb3VwLnR5cGUgPT0gJ2ltYWdlJ1xuXG4gICAgICBpbWFnZVNyYyA9IGdyb3VwLmltYWdlLnNyY1xuXG4gICAgICBpZiBpbWFnZVNyYy5pbmRleE9mKFwiLmZyYW1lclwiKT4tMVxuICAgICAgICBpbWFnZVNyYyA9IGltYWdlU3JjLnN1YnN0cmluZyhpbWFnZVNyYy5pbmRleE9mKCdmcmFtZXInKSs3LCBpbWFnZVNyYy5sZW5ndGgpXG5cbiAgICAgIGxoID0gXCI8aW1nIHNyYz0nI3tpbWFnZVNyY30nIHdpZHRoPScje2dyb3VwLmltYWdlLmZyYW1lLndpZHRofScgaGVpZ2h0PScje2dyb3VwLmltYWdlLmZyYW1lLmhlaWdodH0nPjwvaW1nPlwiXG5cbiAgICAgIGwuaHRtbCA9IGxoXG5cblxuICAgIGlmIGdyb3VwLnR5cGUgPT0gJ3RleHQnXG5cbiAgICAgICMgZ28gb3ZlciB0aGUgcGFydHMgYW5kIHJlY3JlYXRlIHRoZSBjb250ZW50XG4gICAgICBtYWluQWxpZ25tZW50ID0gJydcbiAgICAgIGh0ID0gXCJcIlxuICAgICAgZm9yIHAgaW4gZ3JvdXAucGFydHNcbiAgICAgICAgbWFpbkFsaWdubWVudCA9IHAuYWxpZ25tZW50XG4gICAgICAgIGh0ICs9IFwiPHNwYW4gc3R5bGU9JyN7QGNvbnZlcnRUZXh0T2JqVG9TdHlsZSBwfSAnPlwiXG4gICAgICAgIGh0ICs9IHAudGV4dC5zcGxpdChcIiZuYnNwO1wiKS5qb2luKFwiIFwiKVxuICAgICAgICBodCArPVwiPC9zcGFuPlwiXG5cbiAgICAgIGh0Kz0gXCI8L3NwYW4+XCJcblxuXG4gICAgICBtYWluQWxpZ25tZW50ID0gQEFMSUdOTUVOVFttYWluQWxpZ25tZW50XVxuXG4gICAgICBwcmVIdCA9IFwiPGRpdiBzdHlsZT0ndGV4dC1hbGlnbjoje21haW5BbGlnbm1lbnR9OyB3aGl0ZS1zcGFjZTpwcmUtd3JhcDsnPlwiXG5cbiAgICAgIGh0ID0gcHJlSHQgKyBodCArICc8L2Rpdj4nXG5cbiAgICAgIGwuaHRtbCArPSBodFxuXG5cbiAgICAgICMgc2V0IGRlZmF1bHQgc3R5bGVcblxuICAgICAgZndlaWdodCA9ICdub3JtYWwnXG4gICAgICBmd2VpZ2h0ID0gJ2JvbGQnIGlmIGdyb3VwLnBhcnRzWzBdLmZvbnROYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignYm9sZCcpPi0xXG5cbiAgICAgIHRleHRDb2xvciA9ICBAcmdiVG9IZXggZ3JvdXAucGFydHNbMF0uY29sb3JcblxuICAgICAgaWYgIWdyb3VwLnBhcnRzWzBdLmxpbmVTcGFjaW5nIHx8IGdyb3VwLnBhcnRzWzBdLmxpbmVTcGFjaW5nPT0wXG4gICAgICAgIGZsaW5lU3BhY2luZz0nYXV0bydcbiAgICAgIGVsc2UgZmxpbmVTcGFjaW5nID0gZ3JvdXAucGFydHNbMF0ubGluZVNwYWNpbmcrJ3B4J1xuXG4gICAgICAjIGFzc2lnbiBiYXNpYyBzdHlsZSBmcm9tIHRoZSBmaXJzdCBwYXJ0IGZvciBmdXR1cmUgdXNlc1xuICAgICAgbC5zdHlsZSA9IGwuX2RlZmF1bHRTdHlsZSA9XG4gICAgICAgICAnY29sb3InIDogdGV4dENvbG9yXG4gICAgICAgICAnZm9udC1mYW1pbHknIDogZ3JvdXAucGFydHNbMF0uZm9udEZhbWlseVxuICAgICAgICAgJ2ZvbnQtc2l6ZScgOiBncm91cC5wYXJ0c1swXS5mb250U2l6ZSArIFwicHhcIlxuICAgICAgICAgJ2xpbmUtaGVpZ2h0JyA6IGZsaW5lU3BhY2luZ1xuICAgICAgICAgJ2ZvbnQtd2VpZ2h0JyA6IGZ3ZWlnaHRcblxuICAgIGlmIGdyb3VwLm1hc2tcbiAgICAgIEBhcHBseU1hc2tUb0xheWVyIGdyb3VwLm1hc2ssIGxcblxuXG5cblxuICAgICMgYXBwbHkgRlhcbiAgICBsLm9wYWNpdHkgPSBncm91cC5meC5vcGFjaXR5LnZhbHVlIGlmIGdyb3VwLmZ4Lm9wYWNpdHlcblxuXG5cbiAgICBpZiBncm91cC5meC5jb2xvckNvbnRyb2xzXG4gICAgICBsLmJyaWdodG5lc3MgKz0gMTAwMDAgKiBncm91cC5meC5jb2xvckNvbnRyb2xzLmJyaWdodG5lc3NcbiAgICAgIGwuY29udHJhc3QgPSBVdGlscy5tb2R1bGF0ZSggZ3JvdXAuZnguY29sb3JDb250cm9scy5jb250cmFzdCwgWzAsIDRdLCBbMCwgNDAwXSlcbiAgICAgIGwuaHVlUm90YXRlID0gVXRpbHMubW9kdWxhdGUoZ3JvdXAuZnguY29sb3JDb250cm9scy5odWUsIFstMy4xNDE1OTI2NTM1ODk3OTMsIDMuMTQxNTkyNjUzNTg5NzkzXSwgWy0xODAsIDE4MF0pXG4gICAgICBsLnNhdHVyYXRlID0gVXRpbHMubW9kdWxhdGUoIGdyb3VwLmZ4LmNvbG9yQ29udHJvbHMuc2F0dXJhdGlvbiwgWzAsIDJdLCBbMCwgMTAwXSlcblxuXG5cbiAgICBpZiBncm91cC5meC5zaGFkb3dzXG4gICAgICBjc3NTaGFkb3cgPSAnJ1xuICAgICAgZm9yIHMgaW4gZ3JvdXAuZnguc2hhZG93c1xuICAgICAgICBzd2l0Y2ggcy50eXBlXG4gICAgICAgICAgd2hlbiAnYm94LXNoYWRvdydcbiAgICAgICAgICAgIGwuc2hhZG93WCAgICAgPSBzLm9mZlhcbiAgICAgICAgICAgIGwuc2hhZG93WSAgICAgPSBzLm9mZllcbiAgICAgICAgICAgIGwuc2hhZG93Qmx1ciAgPSBzLmJsdXJSYWRpdXNcbiAgICAgICAgICAgIGwuc2hhZG93U3ByZWFkID0gcy5zcHJlYWRcbiAgICAgICAgICAgIGwuc2hhZG93Q29sb3IgPSBzLmNvbG9yXG5cbiAgICAgICAgICB3aGVuICd0ZXh0LXNoYWRvdydcbiAgICAgICAgICAgIGNzc1NoYWRvdyArPSBcIiN7cy5vZmZYfXB4ICN7cy5vZmZZfXB4ICN7cy5ibHVyUmFkaXVzfXB4ICN7cy5jb2xvcn0sXCJcblxuICAgICAgaWYgY3NzU2hhZG93Lmxlbmd0aCA+IDBcbiAgICAgICAgY3NzU2hhZG93ID0gY3NzU2hhZG93LnNsaWNlKDAsIC0xKVxuXG4gICAgICAgIGwuc3R5bGUgPVxuICAgICAgICAgIFwidGV4dC1zaGFkb3dcIiA6IGNzc1NoYWRvd1xuXG5cblxuXG4gICAgaWYgZ3JvdXAuZnguZmlsbHMgJiYgIWdyb3VwLnN2Z0NvbnRlbnRcbiAgICAgIGZvciBmIGluIGdyb3VwLmZ4LmZpbGxzXG4gICAgICAgIGwuc3R5bGUgPVxuICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiIDogZi5jb2xvclxuXG5cbiAgICBpZiBncm91cC5meC5ib3JkZXJzXG5cbiAgICAgIGZvciBiIGluIGdyb3VwLmZ4LmJvcmRlcnNcbiAgICAgICAgbC5ib3JkZXJXaWR0aCA9IGIudGhpY2tuZXNzXG4gICAgICAgIGwuYm9yZGVyQ29sb3IgPSBiLmNvbG9yXG4gICAgICAgIGwuYm9yZGVyUmFkaXVzID0gYi5yYWRpdXMrXCJweFwiXG5cbiAgICBjaGlsZHJlbiA9IGdyb3VwLmNoaWxkcmVuIHx8IFtdXG5cbiAgICBmb3IgYyBvZiBjaGlsZHJlblxuICAgICAgQHJlY3JlYXRlTGF5ZXJzIGNoaWxkcmVuW2NdLCBsXG5cblxuXG5cblxuXG4gIGNvbnZlcnRUZXh0T2JqVG9TdHlsZSA6IChvYmopIC0+XG5cbiAgICAjIHN0ID0gXCJkaXNwbGF5OmlubGluZS1ibG9jazsgXCJcbiAgICBzdCA9IFwiXCJcblxuICAgIHRleHRDb2xvciA9ICBAcmdiVG9IZXggb2JqLmNvbG9yXG4gICAgc3QgKz0gXCJjb2xvcjoje3RleHRDb2xvcn07IFwiXG5cbiAgICBvYmoud2VpZ2h0ID0gJ25vcm1hbCdcbiAgICBvYmoud2VpZ2h0ID0gJ2JvbGQnIGlmIG9iai5mb250TmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2JvbGQnKT4tMVxuXG4gICAgc3QgKz0gXCJmb250LXdlaWdodDoje29iai53ZWlnaHR9OyBcIlxuICAgIHN0ICs9IFwiZm9udC1mYW1pbHk6I3tvYmouZm9udEZhbWlseX07IFwiIGlmIG9iai5mb250RmFtaWx5XG4gICAgc3QgKz0gXCJmb250LXNpemU6I3tvYmouZm9udFNpemV9cHg7IFwiIGlmIG9iai5mb250U2l6ZVxuXG4gICAgaWYgIW9iai5saW5lU3BhY2luZyB8fCBvYmoubGluZVNwYWNpbmc9PTBcbiAgICAgIG9iai5saW5lU3BhY2luZz0nYXV0bydcbiAgICBlbHNlIG9iai5saW5lU3BhY2luZyArPSAncHgnXG4gICAgc3QgKz0gXCJsaW5lLWhlaWdodDoje29iai5saW5lU3BhY2luZ307IFwiXG5cbiAgICBvYmouYWxpZ25tZW50ID0gMCBpZiAhb2JqLmFsaWdubWVudFxuICAgIHN0ICs9IFwidGV4dC1hbGlnbjoje0BBTElHTk1FTlRbb2JqLmFsaWdubWVudF19O1wiXG5cbiAgICByZXR1cm4gc3RcblxuXG5cblxuXG5cbiAgYXBwbHlNYXNrVG9MYXllciA6IChtYXNrSW5mbywgbGF5ZXIpIC0+XG5cblxuICAgIGlmICFsYXllci5zdXBlckxheWVyLm1hc2tzXG4gICAgICBsYXllci5zdXBlckxheWVyLm1hc2tzID0gW11cblxuICAgIG1fdXNlID0gbWFza0luZm8udXNlXG5cbiAgICBpZiAhbGF5ZXIuc3VwZXJMYXllci5tYXNrc1ttX3VzZV1cbiAgICAgIGh0bWwgPSBcIjxzdmcgd2lkdGg9JzAnIGhlaWdodD0nMCc+XCJcblxuICAgICAgbV9kZWYgPSBAQ1VSUkVOVF9BUlRCT0FSRF9KU09OLmRlZnNbbV91c2VdXG4gICAgICBkZWxldGUgbV9kZWYuaWRcblxuICAgICAgbV9kZWZfY29udGVudCA9IEBTVkdDb250ZW50VG9IVE1MIFttX2RlZl1cblxuICAgICAgaHRtbCArPSBcIjxjbGlwUGF0aCBpZD0nI3ttX3VzZX0nPlwiICsgbV9kZWZfY29udGVudCArIFwiPC9jbGlwUGF0aD5cIlxuICAgICAgaHRtbCArPSBcIjwvc3ZnPlwiXG4gICAgICBsYXllci5zdXBlckxheWVyLmh0bWwgKz0gaHRtbFxuXG4gICAgICBjbGlwUHJvcCA9IFwidXJsKCcjI3ttX3VzZX0nKVwiXG5cblxuICAgICAgbGF5ZXIuc3VwZXJMYXllci5zdHlsZSA9XG4gICAgICAgICctd2Via2l0LWNsaXAtcGF0aCcgOiBjbGlwUHJvcFxuICAgICAgICAnY2xpcC1wYXRoJyA6IGNsaXBQcm9wXG5cbiAgICAgIGxheWVyLnN1cGVyTGF5ZXIubWFza3NbbV91c2VdID0gdHJ1ZVxuXG5cblxuICBTVkdDb250ZW50VG9IVE1MIDogKHN2Z0FycikgLT5cblxuICAgIGh0bWxTdHIgPSBcIlwiXG5cbiAgICBmb3Igb2JqIGluIHN2Z0FyclxuICAgICAgaHRtbFN0ciArPSBcIjwje29iai50eXBlfSBcIlxuICAgICAgZm9yIGF0IG9mIG9ialxuICAgICAgICBodG1sU3RyICs9IFwiICN7YXR9PScje29ialthdF19JyBcIlxuICAgICAgaHRtbFN0ciArPSBcIj48LyN7b2JqLnR5cGV9PlwiXG5cbiAgICBodG1sU3RyXG5cblxuXG5cbiAgcmdiVG9IZXggOiAociwgZywgYikgLT5cblxuICAgICAgaWYgIWdcbiAgICAgICAgcmdiU3RyID0gci5zdWJzdHJpbmcoci5pbmRleE9mKCcoJykrMSwgci5sYXN0SW5kZXhPZignKScpKVxuICAgICAgICByZ2JBcnIgPSByZ2JTdHIuc3BsaXQoJywnKVxuICAgICAgICByID0gcmdiQXJyWzBdXG4gICAgICAgIGcgPSByZ2JBcnJbMV1cbiAgICAgICAgYiA9IHJnYkFyclsyXVxuXG4gICAgICBcIiNcIisgKChiKjI1NSB8IGcgKiAyNTUgPDwgOCB8IHIgKjI1NSA8PCAxNikgLyAxNjc3NzIxNikudG9TdHJpbmcoMTYpLnN1YnN0cmluZygyKTtcbiIsIntTa2V0Y2hJbXBvcnRlcn0gPSByZXF1aXJlICdTa2V0Y2hJbXBvcnRlcidcblxuXG5cbmNsYXNzIGV4cG9ydHMuVG9wTmF2IGV4dGVuZHMgTGF5ZXJcblxuICBjb25zdHJ1Y3RvciA6IChvYmogPSB7fSkgLT5cblxuXG4gICAgc3VwZXIgb2JqXG5cbiAgICBvYmouZmlsZSAgICAgID0gJ2Zyb21Ta2V0Y2gvQWN0aXZpdHlDYXJkLmpzb24nXG4gICAgb2JqLnBhZ2UgICAgICA9ICdQYWdlIDEnXG4gICAgb2JqLmFydGJvYXJkICA9ICd0b3BOYXZfb24nXG5cbiAgICBAY29udGVudCA9IFNrZXRjaEltcG9ydGVyLmltcG9ydCBvYmosIEBcbiJdfQ==
