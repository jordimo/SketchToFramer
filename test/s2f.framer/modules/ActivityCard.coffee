{SketchImporter} = require 'SketchImporter'



class exports.ActivityCard extends Layer

  constructor : (obj = {}) ->


    super obj

    obj.file      = 'fromSketch/ActivityCard.json'
    obj.page      = 'Page-1'
    obj.artboard  = 'activityCard'

    @content = SketchImporter.import obj, @



  title : (txt) ->

    if !txt
      return @_titleTxt
      
