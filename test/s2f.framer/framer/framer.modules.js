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
    var c, children, flineSpacing, fweight, ht, htmlC, i, imageSrc, l, len, lh, mainAlignment, p, preHt, ref, results, textColor;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9yZGkvRG9jdW1lbnRzL1RNQS9HSVRIVUIvU2tldGNoVG9GcmFtZXIvdGVzdC9zMmYuZnJhbWVyL21vZHVsZXMvQWN0aXZpdHlDYXJkLmNvZmZlZSIsIi9Vc2Vycy9qb3JkaS9Eb2N1bWVudHMvVE1BL0dJVEhVQi9Ta2V0Y2hUb0ZyYW1lci90ZXN0L3MyZi5mcmFtZXIvbW9kdWxlcy9Ta2V0Y2hJbXBvcnRlci5jb2ZmZWUiLCIvVXNlcnMvam9yZGkvRG9jdW1lbnRzL1RNQS9HSVRIVUIvU2tldGNoVG9GcmFtZXIvdGVzdC9zMmYuZnJhbWVyL21vZHVsZXMvc2tldGNoVGV4dExheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsY0FBQTtFQUFBOzs7QUFBQyxpQkFBa0IsT0FBQSxDQUFRLGdCQUFSLEVBQWxCOztBQUlLLE9BQU8sQ0FBQzs7O0VBRUUsc0JBQUMsR0FBRDs7TUFBQyxNQUFNOztJQUduQiw4Q0FBTSxHQUFOO0lBRUEsR0FBRyxDQUFDLElBQUosR0FBZ0I7SUFDaEIsR0FBRyxDQUFDLElBQUosR0FBZ0I7SUFDaEIsR0FBRyxDQUFDLFFBQUosR0FBZ0I7SUFFaEIsSUFBQyxDQUFBLE9BQUQsR0FBVyxjQUFjLENBQUMsUUFBRCxDQUFkLENBQXNCLEdBQXRCLEVBQTJCLElBQTNCO0VBVEM7O3lCQWFkLEtBQUEsR0FBUSxTQUFDLEdBQUQ7SUFFTixJQUFHLENBQUMsR0FBSjtBQUNFLGFBQU8sSUFBQyxDQUFBLFVBRFY7O0VBRk07Ozs7R0FmeUI7Ozs7QUNKbkMsSUFBQTs7QUFBQyxrQkFBbUIsT0FBQSxDQUFRLGlCQUFSLEVBQW5COztBQUVELE9BQU8sQ0FBQyxjQUFSLEdBRUU7RUFBQSxZQUFBLEVBQWUsRUFBZjtFQUVBLFNBQUEsRUFBWSxDQUNWLE1BRFUsRUFFVixPQUZVLEVB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QVMsTUFBTSxDQUFDLEtBQVAsQ0FBYSxHQUFiO01BQ1QsQ0FBQSxHQUFJLE1BQU8sQ0FBQSxDQUFBO01BQ1gsQ0FBQSxHQUFJLE1BQU8sQ0FBQSxDQUFBO01BQ1gsQ0FBQSxHQUFJLE1BQU8sQ0FBQSxDQUFBLEVBTGI7O1dBT0EsR0FBQSxHQUFLLENBQUMsQ0FBQyxDQUFBLEdBQUUsR0FBRixHQUFRLENBQUEsR0FBSSxHQUFKLElBQVcsQ0FBbkIsR0FBdUIsQ0FBQSxHQUFHLEdBQUgsSUFBVSxFQUFsQyxDQUFBLEdBQXdDLFFBQXpDLENBQWtELENBQUMsUUFBbkQsQ0FBNEQsRUFBNUQsQ0FBK0QsQ0FBQyxTQUFoRSxDQUEwRSxDQUExRTtFQVRFLENBNVJYOzs7OztBQ0ZGLElBQUE7OztBQUFNLE9BQU8sQ0FBQzs7O0VBRVosZUFBQyxDQUFBLE1BQUQsQ0FBUSxNQUFSLEVBQ0U7SUFBQSxHQUFBLEVBQU0sU0FBQTthQUNKLElBQUMsQ0FBQTtJQURHLENBQU47SUFHQSxHQUFBLEVBQU0sU0FBQyxHQUFEO2FBQ0osSUFBQyxDQUFBLEtBQUQsQ0FBTyxHQUFQO0lBREksQ0FITjtHQURGOztFQU9jLHlCQUFDLEdBQUQ7O01BQUMsTUFBTTs7SUFFbkIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFFakIsaURBQU0sR0FBTjtJQUVBLElBQUMsQ0FBQSxJQUFELEdBQVE7RUFOSTs7NEJBU2QsS0FBQSxHQUFRLFNBQUMsSUFBRDtJQUVOLElBQUMsQ0FBQSxJQUFELEdBQVE7V0FDUixJQUFDLENBQUEsR0FBRCxHQUFPO0VBSEQ7Ozs7R0FsQjRCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIntTa2V0Y2hJbXBvcnRlcn0gPSByZXF1aXJlICdTa2V0Y2hJbXBvcnRlcidcblxuXG5cbmNsYXNzIGV4cG9ydHMuQWN0aXZpdHlDYXJkIGV4dGVuZHMgTGF5ZXJcblxuICBjb25zdHJ1Y3RvciA6IChvYmogPSB7fSkgLT5cblxuXG4gICAgc3VwZXIgb2JqXG5cbiAgICBvYmouZmlsZSAgICAgID0gJ2Zyb21Ta2V0Y2gvQWN0aXZpdHlDYXJkLmpzb24nXG4gICAgb2JqLnBhZ2UgICAgICA9ICdQYWdlLTEnXG4gICAgb2JqLmFydGJvYXJkICA9ICdhY3Rpdml0eUNhcmQnXG5cbiAgICBAY29udGVudCA9IFNrZXRjaEltcG9ydGVyLmltcG9ydCBvYmosIEBcblxuXG5cbiAgdGl0bGUgOiAodHh0KSAtPlxuXG4gICAgaWYgIXR4dFxuICAgICAgcmV0dXJuIEBfdGl0bGVUeHRcbiAgICAgIFxuIiwie3NrZXRjaFRleHRMYXllcn0gPSByZXF1aXJlICdza2V0Y2hUZXh0TGF5ZXInXG5cbmV4cG9ydHMuU2tldGNoSW1wb3J0ZXIgPVxuXG4gIEZJTEVTX0xPQURFRCA6IFtdXG5cbiAgQUxJR05NRU5UIDogW1xuICAgICdsZWZ0JyxcbiAgICAncmlnaHQnLFxuICAgICdjZW50ZXInLFxuICAgICdqdXN0aWZ5J1xuICBdXG5cbiAgQ1VSUkVOVF9BUlRCT0FSRF9KU09OIDoge31cblxuICBpbXBvcnQgOiAob2JqPXt9LCBwYXJlbnRMYXllcikgLT5cblxuICAgIHRocm93IG5ldyBFcnJvciBcIlNrZXRjaEltcG9ydGVyIDogTm8gJ2ZpbGUnIGRlZmluZWRcIiBpZiAhb2JqLmZpbGVcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJTa2V0Y2hJbXBvcnRlciA6IE5vICdwYWdlJyBkZWZpbmVkXCIgaWYgIW9iai5wYWdlXG4gICAgdGhyb3cgbmV3IEVycm9yIFwiU2tldGNoSW1wb3J0ZXIgOiBObyAnYXJ0Ym9hcmQnIGRlZmluZWRcIiBpZiAhb2JqLmFydGJvYXJkXG5cblxuICAgIEBGSUxFU19MT0FERURbb2JqLmZpbGVdID0ge30gaWYgIUBGSUxFU19MT0FERURbb2JqLmZpbGVdXG4gICAgQEZJTEVTX0xPQURFRFtvYmouZmlsZV0uc3JjID0gQGxvYWRGaWxlIG9iai5maWxlIGlmICFARklMRVNfTE9BREVEW29iai5maWxlXS5zcmNcblxuICAgIG5ld0xheWVyID0gQHJlY3JlYXRlQXJ0Qm9hcmQoQEZJTEVTX0xPQURFRFtvYmouZmlsZV0uc3JjLCBvYmoucGFnZSwgb2JqLmFydGJvYXJkKVxuXG4gICAgbmV3TGF5ZXIueCA9IG5ld0xheWVyLnkgPSAwXG4gICAgcGFyZW50TGF5ZXIud2lkdGggPSBuZXdMYXllci53aWR0aFxuICAgIHBhcmVudExheWVyLmhlaWdodCA9IG5ld0xheWVyLmhlaWdodFxuICAgIHBhcmVudExheWVyLmNsaXAgPSBmYWxzZVxuICAgIG5ld0xheWVyLnN1cGVyTGF5ZXIgPSBwYXJlbnRMYXllclxuICAgIG5ld0xheWVyLm5hbWUgPSAnY29udGVudCdcblxuICAgIHJldHVybiBuZXdMYXllclxuXG5cblxuXG4gIGxvYWRGaWxlIDogKGZpbGVOYW1lKSAtPlxuXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoVXRpbHMuZG9tTG9hZERhdGFTeW5jIGZpbGVOYW1lKVxuXG5cblxuXG4gIHJlY3JlYXRlQXJ0Qm9hcmQgOiAoanNvbkRhdGEsICRwYWdlLCAkYXJ0Ym9hcmQpIC0+XG5cbiAgICBfcGFnZXMgICAgPSBqc29uRGF0YS5wYWdlc1skcGFnZV07XG4gICAgX2FydGJvYXJkID0gX3BhZ2VzWyRhcnRib2FyZF1cblxuICAgIEBDVVJSRU5UX0FSVEJPQVJEX0pTT04gPSBfYXJ0Ym9hcmRcblxuICAgIG1haW5MYXllciA9IG5ldyBMYXllclxuICAgICAgbmFtZSAgICA6ICRhcnRib2FyZFxuICAgICAgd2lkdGggICA6IF9hcnRib2FyZC5mcmFtZS53aWR0aFxuICAgICAgaGVpZ2h0ICA6IF9hcnRib2FyZC5mcmFtZS5oZWlnaHRcbiAgICAgIGJhY2tncm91bmRDb2xvciA6IF9hcnRib2FyZC5iYWNrZ3JvdW5kQ29sb3IgfHwgJ3RyYW5zcGFyZW50J1xuICAgICAgY2xpcCA6IGZhbHNlXG5cbiAgICBmb3IgYyBvZiBfYXJ0Ym9hcmQuY2hpbGRyZW5cbiAgICAgIEByZWNyZWF0ZUxheWVycyBfYXJ0Ym9hcmQuY2hpbGRyZW5bY10sIG1haW5MYXllclxuXG4gICAgIyBjbGVhbiB1cCB0aGUgdGV4dCBsYXllcnNcbiAgICBAY2xlYW5VcExheWVycyBtYWluTGF5ZXJcblxuICAgIHJldHVybiBtYWluTGF5ZXJcblxuXG5cbiAgY2xlYW5VcExheWVycyA6ICh0aGVsYXllcikgLT5cblxuICAgIGlmIHRoZWxheWVyLnR5cGUgPT0gJ3RleHQnXG4gICAgICBpZiB0aGVsYXllci5zdXBlckxheWVyLm5hbWUuaW5kZXhPZigndHh0XycpPiAtMVxuICAgICAgICB0bXBMYXllciA9IHRoZWxheWVyLnN1cGVyTGF5ZXJcblxuICAgICAgICB0aGVsYXllci5zdXBlckxheWVyID0gdG1wTGF5ZXIuc3VwZXJMYXllclxuICAgICAgICB0aGVsYXllci5uYW1lICAgICAgID0gdG1wTGF5ZXIubmFtZVxuICAgICAgICB0aGVsYXllci5mcmFtZSAgICAgID0gdG1wTGF5ZXIuZnJhbWVcbiAgICAgICAgdG1wTGF5ZXIuZGVzdHJveSgpXG5cbiAgICBlbHNlXG4gICAgICBmb3IgYyBpbiB0aGVsYXllci5zdWJMYXllcnNcbiAgICAgICAgQGNsZWFuVXBMYXllcnMgY1xuXG5cblxuXG5cblxuICByZWNyZWF0ZUxheWVycyA6IChncm91cCwgcGFyZW50KSAtPlxuXG4gICAgaWYgIWdyb3VwLmlkXG4gICAgICByZXR1cm5cblxuICAgIGlmICFncm91cC5mcmFtZVxuICAgICAgZ3JvdXAuZnJhbWUgPSBwYXJlbnQuZnJhbWVcbiAgICAgIGdyb3VwLmZyYW1lLnggPSAwXG4gICAgICBncm91cC5mcmFtZS55ID0gMFxuXG4gICAgaWYgZ3JvdXAudHlwZSA9PSAndGV4dCdcbiAgICAgIGwgPSBuZXcgc2tldGNoVGV4dExheWVyXG4gICAgZWxzZVxuICAgICAgbCA9IG5ldyBMYXllclxuXG5cblxuICAgIGwuc3VwZXJMYXllciAgPSBwYXJlbnRcbiAgICBsLm5hbWUgICAgICAgID0gZ3JvdXAuaWRcbiAgICBsLndpZHRoICAgICAgID0gTnVtYmVyIGdyb3VwLmZyYW1lLndpZHRoXG4gICAgbC5oZWlnaHQgICAgICA9IE51bWJlciBncm91cC5mcmFtZS5oZWlnaHRcbiAgICBsLnggICAgICAgICAgID0gTnVtYmVyIGdyb3VwLmZyYW1lLnhcbiAgICBsLnkgICAgICAgICAgID0gTnVtYmVyIGdyb3VwLmZyYW1lLnlcbiAgICBsLmNsaXAgICAgICAgID0gZmFsc2VcbiAgICBsLmJhY2tncm91bmRDb2xvciA9IGdyb3VwLmJhY2tncm91bmRDb2xvciB8fCAndHJhbnNwYXJlbnQnXG5cblxuICAgICMgbC5vbiBFdmVudHMuQ2xpY2ssIC0+XG4gICAgIyAgIHByaW50IEBuYW1lICsgXCIgOlwiICsgQGJhY2tncm91bmRDb2xvclxuXG4gICAgcGFyZW50W2dyb3VwLmlkXSA9IGxcblxuICAgIGwudHlwZSA9IGdyb3VwLnR5cGVcblxuXG4gICAgaWYgZ3JvdXAuc3ZnQ29udGVudFxuXG5cbiAgICAgIGh0bWxDID0gXCI8c3ZnIGlkPScje2dyb3VwLmlkfScgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJSc+PGcgIFwiXG4gICAgICBodG1sQyArPSBcIiBzdHJva2U9JyN7Z3JvdXAuYXR0ci5zdHJva2V9JyBcIiBpZiBncm91cC5hdHRyLnN0cm9rZVxuICAgICAgaHRtbEMgKz0gXCIgc3Ryb2tlLXdpZHRoPScje2dyb3VwLmF0dHJbJ3N0cm9rZS13aWR0aCddfScgXCIgaWYgZ3JvdXAuYXR0clsnc3Ryb2tlLXdpZHRoJ11cbiAgICAgIGh0bWxDICs9IFwiIHN0cm9rZS1saW5lY2FwPScje2dyb3VwLmF0dHJbJ3N0cm9rZS1saW5lY2FwJ119JyBcIiBpZiBncm91cC5hdHRyWydzdHJva2UtbGluZWNhcCddXG5cblxuICAgICAgaWYgZ3JvdXAuYXR0ci5maWxsXG4gICAgICAgIGh0bWxDICs9IFwiIGZpbGw9JyN7Z3JvdXAuYXR0ci5maWxsfScgXCJcbiAgICAgIGVsc2VcbiAgICAgICAgaHRtbEMgKz0gXCIgZmlsbD0nbm9uZScgXCJcbiAgICAgIGh0bWxDICs9IFwiPlwiXG5cbiAgICAgIGh0bWxDICs9IFwiI3tAU1ZHQ29udGVudFRvSFRNTCBncm91cC5zdmdDb250ZW50fVwiXG5cbiAgICAgIGh0bWxDICs9IFwiPC9nPjwvc3ZnPlwiXG5cbiAgICAgIGwuaHRtbCA9IGh0bWxDXG5cblxuXG4gICAgaWYgZ3JvdXAudHlwZSA9PSAnaW1hZ2UnXG4gICAgICBpbWFnZVNyYyA9IGdyb3VwLmltYWdlLnNyY1xuXG4gICAgICBpZiBpbWFnZVNyYy5pbmRleE9mKFwiLmZyYW1lclwiKT4tMVxuICAgICAgICBpbWFnZVNyYyA9IGltYWdlU3JjLnN1YnN0cmluZyhpbWFnZVNyYy5pbmRleE9mKCdmcmFtZXInKSs3LCBpbWFnZVNyYy5sZW5ndGgpXG5cbiAgICAgIGxoID0gXCI8aW1nIHNyYz0nI3tpbWFnZVNyY30nIHdpZHRoPScje2dyb3VwLmltYWdlLmZyYW1lLndpZHRofScgaGVpZ2h0PScje2dyb3VwLmltYWdlLmZyYW1lLmhlaWdodH0nPjwvaW1nPlwiXG4gICAgICBcbiAgICAgIGwuaHRtbCA9IGxoXG5cblxuICAgIGlmIGdyb3VwLnR5cGUgPT0gJ3RleHQnXG5cbiAgICAgICMgZ28gb3ZlciB0aGUgcGFydHMgYW5kIHJlY3JlYXRlIHRoZSBjb250ZW50XG4gICAgICBtYWluQWxpZ25tZW50ID0gJydcbiAgICAgIGh0ID0gXCJcIlxuICAgICAgZm9yIHAgaW4gZ3JvdXAucGFydHNcbiAgICAgICAgbWFpbkFsaWdubWVudCA9IHAuYWxpZ25tZW50XG4gICAgICAgIGh0ICs9IFwiPHNwYW4gc3R5bGU9JyN7QGNvbnZlcnRUZXh0T2JqVG9TdHlsZSBwfSc+XCJcbiAgICAgICAgaHQgKz0gcC50ZXh0LnNwbGl0KFwiJm5ic3A7XCIpLmpvaW4oXCIgXCIpXG4gICAgICAgIGh0ICs9XCI8L3NwYW4+XCJcblxuICAgICAgaHQrPSBcIjwvc3Bhbj5cIlxuICAgICAgbWFpbkFsaWdubWVudCA9IEBBTElHTk1FTlRbbWFpbkFsaWdubWVudF1cblxuICAgICAgcHJlSHQgPSBcIjxkaXYgc3R5bGU9J3RleHQtYWxpZ246I3ttYWluQWxpZ25tZW50fSc+XCJcblxuICAgICAgaHQgPSBwcmVIdCArIGh0ICsgJzwvZGl2PidcblxuICAgICAgbC5odG1sICs9IGh0XG5cblxuICAgICAgIyBzZXQgZGVmYXVsdCBzdHlsZVxuXG4gICAgICBmd2VpZ2h0ID0gJ25vcm1hbCdcbiAgICAgIGZ3ZWlnaHQgPSAnYm9sZCcgaWYgZ3JvdXAucGFydHNbMF0uZm9udE5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdib2xkJyk+LTFcblxuICAgICAgdGV4dENvbG9yID0gIEByZ2JUb0hleCBncm91cC5wYXJ0c1swXS5jb2xvclxuXG4gICAgICBpZiAhZ3JvdXAucGFydHNbMF0ubGluZVNwYWNpbmcgfHwgZ3JvdXAucGFydHNbMF0ubGluZVNwYWNpbmc9PTBcbiAgICAgICAgZmxpbmVTcGFjaW5nPSdhdXRvJ1xuICAgICAgZWxzZSBmbGluZVNwYWNpbmcgPSBncm91cC5wYXJ0c1swXS5saW5lU3BhY2luZysncHgnXG5cbiAgICAgICMgYXNzaWduIGJhc2ljIHN0eWxlIGZyb20gdGhlIGZpcnN0IHBhcnQgZm9yIGZ1dHVyZSB1c2VzXG4gICAgICBsLnN0eWxlID0gbC5fZGVmYXVsdFN0eWxlID1cbiAgICAgICAgICdjb2xvcicgOiB0ZXh0Q29sb3JcbiAgICAgICAgICdmb250LWZhbWlseScgOiBncm91cC5wYXJ0c1swXS5mb250RmFtaWx5XG4gICAgICAgICAnZm9udC1zaXplJyA6IGdyb3VwLnBhcnRzWzBdLmZvbnRTaXplICsgXCJweFwiXG4gICAgICAgICAnbGluZS1oZWlnaHQnIDogZmxpbmVTcGFjaW5nXG4gICAgICAgICAnZm9udC13ZWlnaHQnIDogZndlaWdodFxuXG4gICAgaWYgZ3JvdXAubWFza1xuICAgICAgQGFwcGx5TWFza1RvTGF5ZXIgZ3JvdXAubWFzaywgbFxuXG4gICAgY2hpbGRyZW4gPSBncm91cC5jaGlsZHJlbiB8fCBbXVxuXG4gICAgZm9yIGMgb2YgY2hpbGRyZW5cbiAgICAgIEByZWNyZWF0ZUxheWVycyBjaGlsZHJlbltjXSwgbFxuXG5cblxuXG5cblxuICBjb252ZXJ0VGV4dE9ialRvU3R5bGUgOiAob2JqKSAtPlxuXG4gICAgIyBzdCA9IFwiZGlzcGxheTppbmxpbmUtYmxvY2s7IFwiXG4gICAgc3QgPSBcIlwiXG5cbiAgICB0ZXh0Q29sb3IgPSAgQHJnYlRvSGV4IG9iai5jb2xvclxuICAgIHN0ICs9IFwiY29sb3I6I3t0ZXh0Q29sb3J9OyBcIlxuXG4gICAgb2JqLndlaWdodCA9ICdub3JtYWwnXG4gICAgb2JqLndlaWdodCA9ICdib2xkJyBpZiBvYmouZm9udE5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdib2xkJyk+LTFcblxuICAgIHN0ICs9IFwiZm9udC13ZWlnaHQ6I3tvYmoud2VpZ2h0fTsgXCJcbiAgICBzdCArPSBcImZvbnQtZmFtaWx5OiN7b2JqLmZvbnRGYW1pbHl9OyBcIiBpZiBvYmouZm9udEZhbWlseVxuICAgIHN0ICs9IFwiZm9udC1zaXplOiN7b2JqLmZvbnRTaXplfXB4OyBcIiBpZiBvYmouZm9udFNpemVcblxuICAgIGlmICFvYmoubGluZVNwYWNpbmcgfHwgb2JqLmxpbmVTcGFjaW5nPT0wXG4gICAgICBvYmoubGluZVNwYWNpbmc9J2F1dG8nXG4gICAgZWxzZSBvYmoubGluZVNwYWNpbmcgKz0gJ3B4J1xuICAgIHN0ICs9IFwibGluZS1oZWlnaHQ6I3tvYmoubGluZVNwYWNpbmd9OyBcIlxuXG4gICAgb2JqLmFsaWdubWVudCA9IDAgaWYgIW9iai5hbGlnbm1lbnRcbiAgICBzdCArPSBcInRleHQtYWxpZ246I3tAQUxJR05NRU5UW29iai5hbGlnbm1lbnRdfTtcIlxuXG4gICAgcmV0dXJuIHN0XG5cblxuXG5cblxuXG4gIGFwcGx5TWFza1RvTGF5ZXIgOiAobWFza0luZm8sIGxheWVyKSAtPlxuXG5cbiAgICBpZiAhbGF5ZXIuc3VwZXJMYXllci5tYXNrc1xuICAgICAgbGF5ZXIuc3VwZXJMYXllci5tYXNrcyA9IFtdXG5cbiAgICBtX3VzZSA9IG1hc2tJbmZvLnVzZVxuXG4gICAgaWYgIWxheWVyLnN1cGVyTGF5ZXIubWFza3NbbV91c2VdXG4gICAgICBodG1sID0gXCI8c3ZnIHdpZHRoPScwJyBoZWlnaHQ9JzAnPlwiXG5cbiAgICAgIG1fZGVmID0gQENVUlJFTlRfQVJUQk9BUkRfSlNPTi5kZWZzW21fdXNlXVxuICAgICAgZGVsZXRlIG1fZGVmLmlkXG5cbiAgICAgIG1fZGVmX2NvbnRlbnQgPSBAU1ZHQ29udGVudFRvSFRNTCBbbV9kZWZdXG5cbiAgICAgIGh0bWwgKz0gXCI8Y2xpcFBhdGggaWQ9JyN7bV91c2V9Jz5cIiArIG1fZGVmX2NvbnRlbnQgKyBcIjwvY2xpcFBhdGg+XCJcbiAgICAgIGh0bWwgKz0gXCI8L3N2Zz5cIlxuICAgICAgbGF5ZXIuc3VwZXJMYXllci5odG1sICs9IGh0bWxcblxuICAgICAgY2xpcFByb3AgPSBcInVybCgnIyN7bV91c2V9JylcIlxuXG5cbiAgICAgIGxheWVyLnN1cGVyTGF5ZXIuc3R5bGUgPVxuICAgICAgICAnLXdlYmtpdC1jbGlwLXBhdGgnIDogY2xpcFByb3BcbiAgICAgICAgJ2NsaXAtcGF0aCcgOiBjbGlwUHJvcFxuXG4gICAgICBsYXllci5zdXBlckxheWVyLm1hc2tzW21fdXNlXSA9IHRydWVcblxuXG5cbiAgU1ZHQ29udGVudFRvSFRNTCA6IChzdmdBcnIpIC0+XG5cbiAgICBodG1sU3RyID0gXCJcIlxuXG4gICAgZm9yIG9iaiBpbiBzdmdBcnJcbiAgICAgIGh0bWxTdHIgKz0gXCI8I3tvYmoudHlwZX0gXCJcbiAgICAgIGZvciBhdCBvZiBvYmpcbiAgICAgICAgaHRtbFN0ciArPSBcIiAje2F0fT0nI3tvYmpbYXRdfScgXCJcbiAgICAgIGh0bWxTdHIgKz0gXCI+PC8je29iai50eXBlfT5cIlxuXG4gICAgaHRtbFN0clxuXG5cblxuXG4gIHJnYlRvSGV4IDogKHIsIGcsIGIpIC0+XG5cbiAgICAgIGlmICFnXG4gICAgICAgIHJnYlN0ciA9IHIuc3Vic3RyaW5nKHIuaW5kZXhPZignKCcpKzEsIHIubGFzdEluZGV4T2YoJyknKSlcbiAgICAgICAgcmdiQXJyID0gcmdiU3RyLnNwbGl0KCcsJylcbiAgICAgICAgciA9IHJnYkFyclswXVxuICAgICAgICBnID0gcmdiQXJyWzFdXG4gICAgICAgIGIgPSByZ2JBcnJbMl1cblxuICAgICAgXCIjXCIrICgoYioyNTUgfCBnICogMjU1IDw8IDggfCByICoyNTUgPDwgMTYpIC8gMTY3NzcyMTYpLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMik7XG4iLCJcblxuY2xhc3MgZXhwb3J0cy5za2V0Y2hUZXh0TGF5ZXIgZXh0ZW5kcyBMYXllclxuXG4gIEBkZWZpbmUgXCJ0ZXh0XCIsXG4gICAgZ2V0IDogKCkgLT5cbiAgICAgIEBfdHh0XG5cbiAgICBzZXQgOiAodHh0KSAtPlxuICAgICAgQHdyaXRlIHR4dFxuXG4gIGNvbnN0cnVjdG9yIDogKG9iaiA9IHt9KSAtPlxuXG4gICAgQF9kZWZhdWx0U3R5bGUgPSB7fVxuICAgIFxuICAgIHN1cGVyIG9ialxuXG4gICAgQF90eHQgPSAnJ1xuXG5cbiAgd3JpdGUgOiAoX3R4dCkgLT5cblxuICAgIEBodG1sID0gX3R4dFxuICAgIEB0eHQgPSBfdHh0XG4iXX0=
