{SketchImporter} = require 'SketchImporter'



class exports.ActivityCard extends Layer

  constructor : (obj = {}) ->


    super obj

    obj.file      = 'fromSketch/ActivityCard.json'
    obj.page      = 'Page 1'
    obj.artboard  = 'activityCard'

    @content = SketchImporter.import obj, @


    @title_txt = @content.mod_info.txt_title
    # ^ this is a shortcut to change the title text
    # the original text style is applied to the new html
    #
    # @title_txt.html = "Change The Title"
    # ^ will change the copy on title_txt layer
