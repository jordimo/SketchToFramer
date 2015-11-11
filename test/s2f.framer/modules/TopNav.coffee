{SketchImporter} = require 'SketchImporter'



class exports.TopNav extends Layer

  constructor : (obj = {}) ->


    super obj

    obj.file      = 'fromSketch/ActivityCard.json'
    obj.page      = 'Page 1'
    obj.artboard  = 'topNav_on'

    @content = SketchImporter.import obj, @
