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
    item = L.DomUtil.create('li', '', @_imageForm)
    @_imageUrl = L.DomUtil.create('input', '', item)
    @_imageUrl.placeholder = 'Fill your image url in here'
    @_initElementEvents(@_imageUrl)

    L.DomUtil.addClass(@_rotateButton, 'leaflet-disabled')
    L.DomUtil.addClass(@_scaleButton, 'leaflet-disabled')
    L.DomUtil.addClass(@_moveButton, 'leaflet-disabled')
    L.DomUtil.addClass(@_transparentButton, 'leaflet-disabled')

    @_overlay.addTo(map)
    @_container

  onRemove: (map) ->

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

  _enableRotate: (e) ->
    if @_isDisabled(@_rotateButton)
      return

    if @_imageRotateEnabled
      @_imageRotateEnabled = false
      @_exitMode('rotate')
      @_map.fire('image:rotate:disabled')
    else
      @_imageRotateEnabled = true
      @_enterMode('rotate')
      @_map.fire('image:rotate:enabled')

  _enableScale: (e) ->
    if @_isDisabled(@_scaleButton)
      return

    if @_imageScaleEnabled
      @_imageScaleEnabled = false
      @_exitMode('scale')
      @_map.fire('image:scale:disabled')
    else
      @_imageScaleEnabled = true
      @_enterMode('scale')
      @_map.fire('image:scale:enabled')

  _enableMove: (e) ->
    if @_isDisabled(@_moveButton)
      return

    if @_imageMoveEnabled
      @_imageMoveEnabled = false
      @_exitMode('move')
      @_map.fire('image:move:disabled')
    else
      @_imageMoveEnabled = true
      @_enterMode('move')
      @_map.fire('image:move:enabled')

  _enableTransparent: (e) ->
    if @_isDisabled(@_transparentButton)
      return

    if @_imageTransparentEnabled
      @_imageTransparentEnabled = false
      @_exitMode('transparent')
      @_map.fire('image:transparent:disabled')
    else
      @_imageTransparentEnabled = true
      @_enterMode('transparent')
      @_map.fire('image:transparent:enabled')

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
