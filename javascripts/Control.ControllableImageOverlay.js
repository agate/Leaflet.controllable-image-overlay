L.Control.Image = L.Control.extend({
	options: {
		position: 'topleft'
	},

	onAdd: function (map) {
		var className = 'leaflet-controllable-image-overlay',
		    container = L.DomUtil.create('div', className + ' leaflet-bar');

		this._map = map;

		this._rotateButton  = this._createButton(
		        'R', 'Enable Rotate Image Button',
		        className + '-rotate',  container, this._enableRotate, this);
		this._scaleButton = this._createButton(
		        'S', 'Enable Scale Image Button',
		        className + '-scale',  container, this._enableScale, this);
		this._moveButton = this._createButton(
		        'M', 'Enable Move Image Button',
		        className + '-move',  container, this._enableMove, this);
		this._transparentButton = this._createButton(
		        'T', 'Enable Transparent Image Button',
		        className + '-transparent',  container, this._enableTransparent, this);

		return container;
	},

	onRemove: function (map) {
	},

	_enableRotate: function (e) {
    if (this._imageRotateEnabled) {
      this._imageRotateEnabled = false;
      this._map.fire('image:rotate:disabled');
    } else {
      this._imageRotateEnabled = true;
      this._map.fire('image:rotate:enabled');
    }
	},

	_enableScale: function (e) {
    if (this._imageScaleEnabled) {
      this._imageScaleEnabled = false;
      this._map.fire('image:scale:disabled');
    } else {
      this._imageScaleEnabled = true;
      this._map.fire('image:scale:enabled');
    }
	},

	_enableMove: function (e) {
    if (this._imageMoveEnabled) {
      this._imageMoveEnabled = false;
      this._map.fire('image:move:disabled');
    } else {
      this._imageMoveEnabled = true;
      this._map.fire('image:move:enabled');
    }
	},

	_enableTransparent: function (e) {
    if (this._imageTransparentEnabled) {
      this._imageTransparentEnabled= false;
      this._map.fire('image:transparent:disabled');
    } else {
      this._imageTransparentEnabled = true;
      this._map.fire('image:transparent:enabled');
    }
	},

	_createButton: function (html, title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		var stop = L.DomEvent.stopPropagation;

		L.DomEvent
		    .on(link, 'click', stop)
		    .on(link, 'mousedown', stop)
		    .on(link, 'dblclick', stop)
		    .on(link, 'click', L.DomEvent.preventDefault)
		    .on(link, 'click', fn, context)
		    .on(link, 'click', this._refocusOnMap, context);

		return link;
	}
});

L.control.image = function (options) {
	return new L.Control.Image(options);
};
