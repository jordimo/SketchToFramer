{SketchImporter} = require 'SketchImporter'



class exports.SignIn extends Layer

  constructor : (obj = {}) ->


    super obj

    obj.file      = 'fromSketch/ActivityCard.json'
    obj.page      = 'Page 1'
    obj.artboard  = 'Sign_In_Onboarding_1'

    @content = SketchImporter.import obj, @


    for i in @content.subLayers
      if i.name.indexOf('card_')>-1
        i.on Events.MouseOver, ->
          @animate
            properties :
              scale : 1.1
            time : .2

        i.on Events.MouseOut, ->
          @animate
            properties :
              scale : 1
            time : .1
