

class exports.sketchTextLayer extends Layer

  @define "text",
    get : () ->
      @_txt

    set : (txt) ->
      @write txt

  constructor : (obj = {}) ->

    @_defaultStyle = {}
    
    super obj

    @_txt = ''


  write : (_txt) ->

    @html = _txt
    @txt = _txt
