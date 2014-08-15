L.ControllableImageOverlay = L.Class.extend
  includes: L.Mixin.Events

  options:
    imageRotate: 0
    imageOpacity: 1
    imageScale: 1

  initialize: (control) ->
    @_control = control

  onAdd: (map) ->
    @_map = map
    map.on('image:changed', @_resetImage, @)

  _onImageAdded: ->
    @_map.getPanes().overlayPane.appendChild(@_image)
    @_map.on('viewreset', @_reset, @)

    if @_map.options.zoomAnimation && L.Browser.any3d
      @_map.on('zoomanim', @_animateZoom, @)

    @_map.on('image:rotate:enabled', (->
      L.DomEvent.on(@_image, 'mousedown', @_rotateStart, @)
      L.DomEvent.on(@_image, 'mousemove', @_rotating, @)
      L.DomEvent.on(@_image, 'mouseout', @_rotateEnd, @)
      L.DomEvent.on(@_image, 'mouseup', @_rotateEnd, @)
    ), @)
    @_map.on('image:rotate:disabled', (->
      L.DomEvent.off(@_image, 'mousedown', @_rotateStart, @)
      L.DomEvent.off(@_image, 'mousemove', @_rotating, @)
      L.DomEvent.off(@_image, 'mouseout', @_rotateEnd, @)
      L.DomEvent.off(@_image, 'mouseup', @_rotateEnd, @)
    ), @)
    @_map.on('image:scale:enabled', (->
      L.DomEvent.on(@_image, 'mousedown', @_scaleStart, @)
      L.DomEvent.on(@_image, 'mousemove', @_scaling, @)
      L.DomEvent.on(@_image, 'mouseout', @_scaleEnd, @)
      L.DomEvent.on(@_image, 'mouseup', @_scaleEnd, @)
    ), @)
    @_map.on('image:scale:disabled', (->
      L.DomEvent.off(@_image, 'mousedown', @_scaleStart, @)
      L.DomEvent.off(@_image, 'mousemove', @_scaling, @)
      L.DomEvent.off(@_image, 'mouseout', @_scaleEnd, @)
      L.DomEvent.off(@_image, 'mouseup', @_scaleEnd, @)
    ), @)
    @_map.on('image:move:enabled', (->
      L.DomEvent.on(@_image, 'mousedown', @_moveStart, @)
      L.DomEvent.on(@_image, 'mousemove', @_moving, @)
      L.DomEvent.on(@_image, 'mouseout', @_moveEnd, @)
      L.DomEvent.on(@_image, 'mouseup', @_moveEnd, @)
    ), @)
    @_map.on('image:move:disabled', (->
      L.DomEvent.off(@_image, 'mousedown', @_moveStart, @)
      L.DomEvent.off(@_image, 'mousemove', @_moving, @)
      L.DomEvent.off(@_image, 'mouseout', @_moveEnd, @)
      L.DomEvent.off(@_image, 'mouseup', @_moveEnd, @)
    ), @)
    @_map.on('image:transparent:enabled', (->
      L.DomEvent.on(@_image, 'mousewheel', @_transparent, @)
    ), @)
    @_map.on('image:transparent:disabled', (->
      L.DomEvent.off(@_image, 'mousewheel', @_transparent, @)
    ), @)
    @_map.on('image:reset', (->
      @_resetImage()
    ), @)
    @_map.on('image:remove', (->
      @_removeImage()
    ), @)

    @_reset()

  # ROTATE STUFF
  _rotateStart: (e) ->
    L.DomEvent.stopPropagation(e)

    @_imageRotating = true
    @_imageRotateDiff = @_getMouseImageRotate(e) - @options.imageRotate
  _rotateEnd: (e) ->
    L.DomEvent.stopPropagation(e)

    @_imageRotating = false
  _rotating: (e) ->
    if !@_imageRotating
      return

    L.DomEvent.stopPropagation(e)

    @options.imageRotate = @_getMouseImageRotate(e) - @_imageRotateDiff
    @_reset()
  _getMouseImageRotate: (e) ->
    imageBounding = @_image.getBoundingClientRect()
    centerX = imageBounding.left + imageBounding.width / 2
    centerY = imageBounding.top + imageBounding.height / 2
    radians = Math.atan2(e.pageX - centerX, e.pageY - centerY)
    degree = (radians * (180 / Math.PI) * -1) + 90

    return degree

  # SCALE STUFF
  _scaleStart: (e) ->
    L.DomEvent.stopPropagation(e)

    @_imageScaling = true
    @_imageScalingInitScale = @options.imageScale
    @_imageScalingInitPoint =
      x: e.pageX,
      y: e.pageY,
  _scaleEnd: (e) ->
    L.DomEvent.stopPropagation(e)

    @_imageScaling = false
  _scaling: (e) ->
    if !@_imageScaling
      return

    L.DomEvent.stopPropagation(e)

    imageBounding = @_image.getBoundingClientRect()
    centerX = imageBounding.left + imageBounding.width / 2
    centerY = imageBounding.top + imageBounding.height / 2
    diffNowX = centerX - e.pageX
    diffNowY = centerY - e.pageY
    diffInitX = centerX - @_imageScalingInitPoint.x
    diffInitY = centerY - @_imageScalingInitPoint.y
    distanNow = Math.sqrt(Math.pow(diffNowX, 2) + Math.pow(diffNowY, 2))
    distanInit = Math.sqrt(Math.pow(diffInitX, 2) + Math.pow(diffInitY, 2))
    scale = distanNow / distanInit * @_imageScalingInitScale

    @options.imageScale = scale
    @_reset()

  # MOVE STUFF
  _moveStart: (e) ->
    L.DomEvent.stopPropagation(e)

    @_imageMoving = true
  _moveEnd: (e) ->
    L.DomEvent.stopPropagation(e)

    @_imageMoving = false
  _moving: (e) ->
    if !@_imageMoving
      return

    L.DomEvent.stopPropagation(e)

    ne = @_map.latLngToLayerPoint(@_bounds.getNorthEast())
    sw = @_map.latLngToLayerPoint(@_bounds.getSouthWest())

    ne.x += e.movementX
    ne.y += e.movementY
    sw.x += e.movementX
    sw.y += e.movementY

    @_bounds = L.latLngBounds(
      @_map.layerPointToLatLng(sw),
      @_map.layerPointToLatLng(ne)
    )

    @_reset()

  # TRANSPARENT STUFF
  _transparent: (e) ->
    L.DomEvent.stopPropagation(e)

    @options.imageOpacity = @options.imageOpacity + e.wheelDelta / 120 / 50

    if @options.imageOpacity > 1
      @options.imageOpacity = 1
    if @options.imageOpacity < 0.2
      @options.imageOpacity = 0.2

    @_reset()

  onRemove: (map) ->
    @_removeImage()

    @_map.off('image:changed', @_resetImage, @)
    if map.options.zoomAnimation
      map.off('zoomanim', @_animateZoom, @)

  addTo: (map) ->
    map.addLayer(@)
    return @

  # TODO remove bringToFront/bringToBack duplication from TileLayer/Path
  bringToFront: ->
    if @_image
      @_map._panes.overlayPane.appendChild(@_image)
    return @

  bringToBack: ->
    pane = @_map._panes.overlayPane
    if @_image
      pane.insertBefore(@_image, pane.firstChild)
    return @

  setUrl: (url) ->
    @_image.src = url

  getAttribution: ->
    return @options.attribution

  _initImage: ->
    if !@_control.options.image
      return

    if !@_image
      @_image = L.DomUtil.create('img', 'leaflet-controllable-image-layer')

      if @_map.options.zoomAnimation && L.Browser.any3d
        L.DomUtil.addClass(@_image, 'leaflet-zoom-animated')
      else
        L.DomUtil.addClass(@_image, 'leaflet-zoom-hide')

      # TODO createImage util method to remove duplication
      L.extend @_image,
        galleryimg: 'no',
        onselectstart: L.Util.falseFn,
        onmousemove: L.Util.falseFn,
        onload: L.bind(@_onImageLoad, @),
        src: @_control.options.image

    else
      @_image.src = @_control.options.image

  _animateZoom: (e) ->
    map = @_map
    image = @_image
    scale = map.getZoomScale(e.zoom)
    nw = @_bounds.getNorthWest()
    se = @_bounds.getSouthEast()

    topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center)
    size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft)
    origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)))

    image.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(origin) +
                                       ' scale(' + scale * @imageScale + ')' +
                                       ' rotate(' + @options.imageRotate + ')'

  _resetOptions: ->
    @options.imageRotate = 0
    @options.imageOpacity = 1
    @options.imageScale = 1

  _resetImage: ->
    @_resetOptions()
    @_initImage()
    @_resetImageBounds =>
      @_reset()

  _removeImage: ->
    @_resetOptions()

    if @_image
      @_map.getPanes().overlayPane.removeChild(@_image)

    @_map.off('viewreset', @_reset, @)

    @_image = null

  _reset: ->
    if !@_imageLoaded
      return

    image = @_image
    topLeft = @_map.latLngToLayerPoint(@_bounds.getNorthWest())
    size = @_map.latLngToLayerPoint(@_bounds.getSouthEast())._subtract(topLeft)

    L.DomUtil.setPosition(image, topLeft)
    L.DomUtil.setOpacity(image, @options.imageOpacity)

    image.style.width  = size.x + 'px'
    image.style.height = size.y + 'px'

    image.style[L.DomUtil.TRANSFORM] += ' scale(' + @options.imageScale+ ')'
    image.style[L.DomUtil.TRANSFORM] += ' rotate(' + @options.imageRotate + 'deg)'

  _resetImageBounds: (cb) ->
    @_getImageInfo @_control.options.image, (info) =>
      @_imageLoaded = true

      bounds = @_map.getBounds()
      ne = @_map.latLngToContainerPoint(bounds.getNorthEast())
      sw = @_map.latLngToContainerPoint(bounds.getSouthWest())
      width = ne.x - sw.x
      height = sw.y - ne.y
      centerX = width / 2
      centerY = height / 2

      if info.width > info.height
        displayHeight = centerX / info.width * info.height
        tr = @_map.containerPointToLatLng(L.point(3 / 4 * width, centerY - displayHeight / 2))
        bl = @_map.containerPointToLatLng(L.point(1 / 4 * width, centerY + displayHeight / 2))
      else
        displayWidth = centerY / info.height * info.width / 2
        tr = @_map.containerPointToLatLng(L.point(centerX + displayWidth / 2, 1 / 4 * height))
        bl = @_map.containerPointToLatLng(L.point(centerX - displayWidth / 2, 3 / 4 * height))

      @_bounds = L.latLngBounds([bl, tr])
      cb()

  _onImageLoad: ->
    @fire('load')
    @_resetImageBounds =>
      @_onImageAdded()

  _getImageInfo: (imgUrl, callback) ->
    img = new Image()
    img.src = imgUrl
    img.onload = ->
      callback
        width: img.width,
        height: img.height

L.controllableImageOverlay = (url, bounds, options) ->
  return new L.ControllableImageOverlay(url, bounds, options)
