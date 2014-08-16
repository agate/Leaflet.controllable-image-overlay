L.Control.ControllableImageOverlay = L.Control.extend
  options:
    position: 'topleft'
    modes: [
      'image'
      'rotate'
      'scale'
      'move'
      'transparent'
    ]

  initialize: (options) ->
    L.Control.prototype.initialize.call(@, options)
    @_overlay = L.controllableImageOverlay(@)
    @_tooltip = L.controllableImageOverlayTooltip(@)

  onAdd: (map) ->
    className = 'leaflet-controllable-image-overlay'

    @_container = L.DomUtil.create('div', className + ' leaflet-bar')

    @_map = map

    @_imageButton  = @_createButton 'C', 'Change image', className + '-image',  @_container, @_changeImage, @
    @_rotateButton = @_createButton 'R', 'Rotate image', className + '-rotate',  @_container, @_enableRotate, @
    @_scaleButton  = @_createButton 'S', 'Resize image', className + '-scale',  @_container, @_enableScale, @
    @_moveButton   = @_createButton 'M', 'Move image', className + '-move',  @_container, @_enableMove, @
    @_transparentButton = @_createButton 'T', 'Transparent image', className + '-transparent',  @_container, @_enableTransparent, @

    @_imageForm = L.DomUtil.create('ul', className + '-actions', @_container)

    urlItem   = L.DomUtil.create('li', '', @_imageForm)
    resetItem = L.DomUtil.create('li', '', @_imageForm)
    removeItem = L.DomUtil.create('li', '', @_imageForm)

    @_imageUrl = L.DomUtil.create('input', '', urlItem)
    @_imageUrl.placeholder = 'Fill your image url in here'
    @_initElementEvents(@_imageUrl)

    @_resetButton  = @_createButton 'Reset', 'Reset image', '',  resetItem, @_resetImage, @
    @_removeButton  = @_createButton 'Remove', 'Remove image', '',  removeItem, @_removeImage, @

    L.DomUtil.addClass(@_rotateButton, 'leaflet-disabled')
    L.DomUtil.addClass(@_scaleButton, 'leaflet-disabled')
    L.DomUtil.addClass(@_moveButton, 'leaflet-disabled')
    L.DomUtil.addClass(@_transparentButton, 'leaflet-disabled')

    @_overlay.addTo(map)
    @_tooltip.addTo(map)

    @_container

  onRemove: (map) ->
    @_overlay.removeFrom(map)
    @_tooltip.removeFrom(map)

  onImageChanged: ->
    L.DomUtil.removeClass(@_rotateButton, 'leaflet-disabled')
    L.DomUtil.removeClass(@_scaleButton, 'leaflet-disabled')
    L.DomUtil.removeClass(@_moveButton, 'leaflet-disabled')
    L.DomUtil.removeClass(@_transparentButton, 'leaflet-disabled')

  _changeImage: (e) ->
    if @_isDisabled(@_imageButton)
      return

    if @_changeImageEnabled
      @_changeImageEnabled = false
      L.DomUtil.removeClass(@_container, 'actions-shown')

      image = @_imageUrl.value.trim()
      if image.length > 0 && image != @options.image
        @options.image = image
        @_map.fire('image:changed')

      if (@options.image)
        @_exitMode('image')
    else
      @_changeImageEnabled = true
      @_enterMode('image')
      L.DomUtil.addClass(@_container, 'actions-shown')
      setTimeout((=> @_imageUrl.focus()), 10)

  _enableRotate: (e) ->
    if @_isDisabled(@_rotateButton)
      return

    if @_imageRotateEnabled
      @_imageRotateEnabled = false
      @_exitMode('rotate')
      @_map.fire('image:rotate:disabled')
      @_tooltip.disable()
    else
      @_imageRotateEnabled = true
      @_enterMode('rotate')
      @_map.fire('image:rotate:enabled')
      @_tooltip.enable('Drag overlay image to rotate it.', {
        x: e.clientX
        y: e.clientY
      })

  _enableScale: (e) ->
    if @_isDisabled(@_scaleButton)
      return

    if @_imageScaleEnabled
      @_imageScaleEnabled = false
      @_exitMode('scale')
      @_map.fire('image:scale:disabled')
      @_tooltip.disable()
    else
      @_imageScaleEnabled = true
      @_enterMode('scale')
      @_map.fire('image:scale:enabled')
      @_tooltip.enable('Drag overlay image to resize it.', {
        x: e.clientX
        y: e.clientY
      })

  _enableMove: (e) ->
    if @_isDisabled(@_moveButton)
      return

    if @_imageMoveEnabled
      @_imageMoveEnabled = false
      @_exitMode('move')
      @_map.fire('image:move:disabled')
      @_tooltip.disable()
    else
      @_imageMoveEnabled = true
      @_enterMode('move')
      @_map.fire('image:move:enabled')
      @_tooltip.enable('Drag overlay image to move its position.', {
        x: e.clientX
        y: e.clientY
      })

  _enableTransparent: (e) ->
    if @_isDisabled(@_transparentButton)
      return

    if @_imageTransparentEnabled
      @_imageTransparentEnabled = false
      @_exitMode('transparent')
      @_map.fire('image:transparent:disabled')
      @_tooltip.disable()
    else
      @_imageTransparentEnabled = true
      @_enterMode('transparent')
      @_map.fire('image:transparent:enabled')
      @_tooltip.enable('Wheel your mouse on the overlay image to change its opacity.')

  _resetImage: (e) ->
    @_changeImageEnabled = false

    @_imageUrl.value = @options.image || ''
    L.DomUtil.removeClass(@_container, 'actions-shown')
    @_map.fire('image:reset')

    if @_overlay._image
      @_exitMode('image')

  _removeImage: (e) ->
    @_changeImageEnabled = false

    L.DomUtil.removeClass(@_container, 'actions-shown')

    @_imageUrl.value = ''
    @options.image = ''
    @_map.fire('image:remove')

    @_enterMode('image')

  _createButton: (html, title, className, container, fn, context) ->
    link = L.DomUtil.create('a', className, container)
    link.innerHTML = html
    link.href = '#'
    link.title = title

    @_initElementEvents(link)

    L.DomEvent
     .on(link, 'click', fn, context)
     .on(link, 'click', @_refocusOnMap, context)

    link

  _initElementEvents: (ele) ->
    L.DomEvent
        .on(ele, 'click', L.DomEvent.stopPropagation)
        .on(ele, 'mousedown', L.DomEvent.stopPropagation)
        .on(ele, 'dblclick', L.DomEvent.stopPropagation)
        .on(ele, 'click', L.DomEvent.preventDefault)

  _enterMode: (mode) ->
    @options.modes.forEach(((m) ->
      button = @['_' + m + 'Button']
      if mode == m
        L.DomUtil.removeClass(button, 'leaflet-disabled')
      else
        L.DomUtil.addClass(button, 'leaflet-disabled')
    ), @)
  _exitMode: (mode) ->
    @options.modes.forEach(((m) ->
      button = @['_' + m + 'Button']
      L.DomUtil.removeClass(button, 'leaflet-disabled')
    ), @)

  _isDisabled: (ele) ->
    ele.className.indexOf('leaflet-disabled') > -1

  disable: ->
    @options.modes.forEach (m) ->
      button = @['_' + m + 'Button']
      L.DomUtil.addClass(button, 'leaflet-disabled')
  enable: ->
    @options.modes.forEach (m) ->
      button = @['_' + m + 'Button']
      L.DomUtil.removeClass(button, 'leaflet-disabled')

L.control.controllableImageOverlay = (options) ->
  new L.Control.ControllableImageOverlay(options)
