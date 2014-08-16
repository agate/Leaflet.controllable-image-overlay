L.ControllableImageOverlayTooltip = L.Class.extend
  baseClassName: 'leaflet-controllable-image-overlay-tooltip'

  initialize: (@_control) ->

  addTo: (@_map) ->
    @_popupPane = @_map._panes.popupPane
    @_container = L.DomUtil.create('div', @baseClassName, @_popupPane)
    @_singleLineLabel = false

  onRemove: (map) ->
    @disable()
    @_popupPane.removeChild(@_container)
    @_container = null

  enable: (labelText, position) ->
    @updateContent(labelText) if labelText
    L.DomUtil.addClass(@_container, "#{@baseClassName}-shown")
    @_map.on('mousemove', @._onMouseMove, @)
    @updatePosition(position) if position

  disable: ->
    L.DomUtil.removeClass(@_container, "#{@baseClassName}-shown")
    @_map.off('mousemove', @._onMouseMove, @)

  updateContent: (labelText) ->
    @_container.innerHTML = labelText
    return @

  _onMouseMove: (e) ->
    pos = @_map.latLngToLayerPoint(e.latlng)
    @updatePosition(pos)

  updatePosition: (position) ->
    @_container.style.visibility = 'inherit'
    L.DomUtil.setPosition(@_container, position)
    return @

  showAsError: ->
    L.DomUtil.addClass(@_container, "#{@baseClassName}-error")
    return @

  removeError: ->
    L.DomUtil.removeClass(@_container, "#{@baseClassName}-error")
    return @

L.controllableImageOverlayTooltip = (control) ->
  new L.ControllableImageOverlayTooltip(control)
