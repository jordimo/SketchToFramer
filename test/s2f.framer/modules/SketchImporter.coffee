{sketchTextLayer} = require 'sketchTextLayer'

exports.SketchImporter =

  FILES_LOADED : []

  ALIGNMENT : [
    'left',
    'right',
    'center',
    'justify'
  ]

  CURRENT_ARTBOARD_JSON : {}

  import : (obj={}, parentLayer) ->

    throw new Error "SketchImporter : No 'file' defined" if !obj.file
    throw new Error "SketchImporter : No 'page' defined" if !obj.page
    throw new Error "SketchImporter : No 'artboard' defined" if !obj.artboard


    @FILES_LOADED[obj.file] = {} if !@FILES_LOADED[obj.file]
    @FILES_LOADED[obj.file].src = @loadFile obj.file if !@FILES_LOADED[obj.file].src

    newLayer = @recreateArtBoard(@FILES_LOADED[obj.file].src, obj.page, obj.artboard)

    newLayer.x = newLayer.y = 0
    parentLayer.width = newLayer.width
    parentLayer.height = newLayer.height
    parentLayer.clip = false
    newLayer.superLayer = parentLayer
    newLayer.name = 'content'

    return newLayer




  loadFile : (fileName) ->

    return JSON.parse(Utils.domLoadDataSync fileName)




  recreateArtBoard : (jsonData, $page, $artboard) ->

    _pages    = jsonData.pages[$page];
    _artboard = _pages[$artboard]

    @CURRENT_ARTBOARD_JSON = _artboard

    mainLayer = new Layer
      name    : $artboard
      width   : _artboard.frame.width
      height  : _artboard.frame.height
      backgroundColor : _artboard.backgroundColor || 'transparent'
      clip : false

    for c of _artboard.children
      @recreateLayers _artboard.children[c], mainLayer

    # clean up the text layers
    @cleanUpLayers mainLayer

    return mainLayer



  cleanUpLayers : (thelayer) ->

    if thelayer.type == 'text'
      if thelayer.superLayer.name.indexOf('txt_')> -1
        tmpLayer = thelayer.superLayer

        thelayer.superLayer = tmpLayer.superLayer
        thelayer.name       = tmpLayer.name
        thelayer.frame      = tmpLayer.frame
        tmpLayer.destroy()

    else
      for c in thelayer.subLayers
        @cleanUpLayers c






  recreateLayers : (group, parent) ->

    if !group.id
      return

    if !group.frame
      group.frame = parent.frame
      group.frame.x = 0
      group.frame.y = 0

    if group.type == 'text'
      l = new sketchTextLayer
    else
      l = new Layer



    l.superLayer  = parent
    l.name        = group.id
    l.width       = Number group.frame.width
    l.height      = Number group.frame.height
    l.x           = Number group.frame.x
    l.y           = Number group.frame.y
    l.clip        = false
    l.backgroundColor = group.backgroundColor || 'transparent'


    # l.on Events.Click, ->
    #   print @name + " :" + @backgroundColor

    parent[group.id] = l

    l.type = group.type


    if group.svgContent


      htmlC = "<svg id='#{group.id}' width='100%' height='100%'><g  "
      htmlC += " stroke='#{group.attr.stroke}' " if group.attr.stroke
      htmlC += " stroke-width='#{group.attr['stroke-width']}' " if group.attr['stroke-width']
      htmlC += " stroke-linecap='#{group.attr['stroke-linecap']}' " if group.attr['stroke-linecap']


      if group.attr.fill
        htmlC += " fill='#{group.attr.fill}' "
      else
        htmlC += " fill='none' "
      htmlC += ">"

      htmlC += "#{@SVGContentToHTML group.svgContent}"

      htmlC += "</g></svg>"

      l.html = htmlC



    if group.type == 'image'
      imageSrc = group.image.src

      if imageSrc.indexOf(".framer")>-1
        imageSrc = imageSrc.substring(imageSrc.indexOf('framer')+7, imageSrc.length)

      lh = "<img src='#{imageSrc}' width='#{group.image.frame.width}' height='#{group.image.frame.height}'></img>"
      
      l.html = lh


    if group.type == 'text'

      # go over the parts and recreate the content
      mainAlignment = ''
      ht = ""
      for p in group.parts
        mainAlignment = p.alignment
        ht += "<span style='#{@convertTextObjToStyle p}'>"
        ht += p.text.split("&nbsp;").join(" ")
        ht +="</span>"

      ht+= "</span>"
      mainAlignment = @ALIGNMENT[mainAlignment]

      preHt = "<div style='text-align:#{mainAlignment}'>"

      ht = preHt + ht + '</div>'

      l.html += ht


      # set default style

      fweight = 'normal'
      fweight = 'bold' if group.parts[0].fontName.toLowerCase().indexOf('bold')>-1

      textColor =  @rgbToHex group.parts[0].color

      if !group.parts[0].lineSpacing || group.parts[0].lineSpacing==0
        flineSpacing='auto'
      else flineSpacing = group.parts[0].lineSpacing+'px'

      # assign basic style from the first part for future uses
      l.style = l._defaultStyle =
         'color' : textColor
         'font-family' : group.parts[0].fontFamily
         'font-size' : group.parts[0].fontSize + "px"
         'line-height' : flineSpacing
         'font-weight' : fweight

    if group.mask
      @applyMaskToLayer group.mask, l

    children = group.children || []

    for c of children
      @recreateLayers children[c], l






  convertTextObjToStyle : (obj) ->

    # st = "display:inline-block; "
    st = ""

    textColor =  @rgbToHex obj.color
    st += "color:#{textColor}; "

    obj.weight = 'normal'
    obj.weight = 'bold' if obj.fontName.toLowerCase().indexOf('bold')>-1

    st += "font-weight:#{obj.weight}; "
    st += "font-family:#{obj.fontFamily}; " if obj.fontFamily
    st += "font-size:#{obj.fontSize}px; " if obj.fontSize

    if !obj.lineSpacing || obj.lineSpacing==0
      obj.lineSpacing='auto'
    else obj.lineSpacing += 'px'
    st += "line-height:#{obj.lineSpacing}; "

    obj.alignment = 0 if !obj.alignment
    st += "text-align:#{@ALIGNMENT[obj.alignment]};"

    return st






  applyMaskToLayer : (maskInfo, layer) ->


    if !layer.superLayer.masks
      layer.superLayer.masks = []

    m_use = maskInfo.use

    if !layer.superLayer.masks[m_use]
      html = "<svg width='0' height='0'>"

      m_def = @CURRENT_ARTBOARD_JSON.defs[m_use]
      delete m_def.id

      m_def_content = @SVGContentToHTML [m_def]

      html += "<clipPath id='#{m_use}'>" + m_def_content + "</clipPath>"
      html += "</svg>"
      layer.superLayer.html += html

      clipProp = "url('##{m_use}')"


      layer.superLayer.style =
        '-webkit-clip-path' : clipProp
        'clip-path' : clipProp

      layer.superLayer.masks[m_use] = true



  SVGContentToHTML : (svgArr) ->

    htmlStr = ""

    for obj in svgArr
      htmlStr += "<#{obj.type} "
      for at of obj
        htmlStr += " #{at}='#{obj[at]}' "
      htmlStr += "></#{obj.type}>"

    htmlStr




  rgbToHex : (r, g, b) ->

      if !g
        rgbStr = r.substring(r.indexOf('(')+1, r.lastIndexOf(')'))
        rgbArr = rgbStr.split(',')
        r = rgbArr[0]
        g = rgbArr[1]
        b = rgbArr[2]

      "#"+ ((b*255 | g * 255 << 8 | r *255 << 16) / 16777216).toString(16).substring(2);
