L.Control.ControllableImageOverlay = L.Control.extend({
	options: {
		position: 'topleft',
    modes: [
      'image',
      'rotate',
      'scale',
      'move',
      'transparent'
    ],
	},

	onAdd: function (map) {
		var className = 'leaflet-controllable-image-overlay';
		
    this._container = L.DomUtil.create('div', className + ' leaflet-bar');

		this._map = map;

		this._imageButton  = this._createButton(
		        'C', 'Change image',
		        className + '-image',  this._container, this._changeImage, this);
		this._rotateButton  = this._createButton(
		        'R', 'Rotate image',
		        className + '-rotate',  this._container, this._enableRotate, this);
		this._scaleButton = this._createButton(
		        'S', 'Resize image',
		        className + '-scale',  this._container, this._enableScale, this);
		this._moveButton = this._createButton(
		        'M', 'Move image',
		        className + '-move',  this._container, this._enableMove, this);
		this._transparentButton = this._createButton(
		        'T', 'Transparent image',
		        className + '-transparent',  this._container, this._enableTransparent, this);

    this._imageForm = L.DomUtil.create('ul', className + '-actions', this._container);
		var item = L.DomUtil.create('li', '', this._imageForm);
    this._imageUrl = L.DomUtil.create('input', '', item);
    this._imageUrl.placeholder = 'Fill your image url in here'
    this._initElementEvents(this._imageUrl);

    L.DomUtil.addClass(this._rotateButton, 'leaflet-disabled');
    L.DomUtil.addClass(this._scaleButton, 'leaflet-disabled');
    L.DomUtil.addClass(this._moveButton, 'leaflet-disabled');
    L.DomUtil.addClass(this._transparentButton, 'leaflet-disabled');

		return this._container;
	},

	onRemove: function (map) {
	},

  onImageChanged: function() {
    L.DomUtil.removeClass(this._rotateButton, 'leaflet-disabled');
    L.DomUtil.removeClass(this._scaleButton, 'leaflet-disabled');
    L.DomUtil.removeClass(this._moveButton, 'leaflet-disabled');
    L.DomUtil.removeClass(this._transparentButton, 'leaflet-disabled');
  },

	_changeImage: function (e) {
    if (this._isDisabled(this._imageButton)) return;

    if (this._changeImageEnabled) {
      this._changeImageEnabled = false;
      L.DomUtil.removeClass(this._container, 'actions-shown');

      var image = this._imageUrl.value.trim();
      if (image.length > 0 && image != this.options.image) {
        this.options.image = image;
        this._map.fire('image:changed');
      }

      if (this.options.image) this._exitMode('image');
    } else {
      this._changeImageEnabled = true;
      this._enterMode('image');
      L.DomUtil.addClass(this._container, 'actions-shown');
    }
  },

	_enableRotate: function (e) {
    if (this._isDisabled(this._rotateButton)) return;

    if (this._imageRotateEnabled) {
      this._imageRotateEnabled = false;
      this._exitMode('rotate');
      this._map.fire('image:rotate:disabled');
    } else {
      this._imageRotateEnabled = true;
      this._enterMode('rotate');
      this._map.fire('image:rotate:enabled');
    }
	},

	_enableScale: function (e) {
    if (this._isDisabled(this._scaleButton)) return;

    if (this._imageScaleEnabled) {
      this._imageScaleEnabled = false;
      this._exitMode('scale');
      this._map.fire('image:scale:disabled');
    } else {
      this._imageScaleEnabled = true;
      this._enterMode('scale');
      this._map.fire('image:scale:enabled');
    }
	},

	_enableMove: function (e) {
    if (this._isDisabled(this._moveButton)) return;

    if (this._imageMoveEnabled) {
      this._imageMoveEnabled = false;
      this._exitMode('move');
      this._map.fire('image:move:disabled');
    } else {
      this._imageMoveEnabled = true;
      this._enterMode('move');
      this._map.fire('image:move:enabled');
    }
	},

	_enableTransparent: function (e) {
    if (this._isDisabled(this._transparentButton)) return;

    if (this._imageTransparentEnabled) {
      this._imageTransparentEnabled= false;
      this._exitMode('transparent');
      this._map.fire('image:transparent:disabled');
    } else {
      this._imageTransparentEnabled = true;
      this._enterMode('transparent');
      this._map.fire('image:transparent:enabled');
    }
	},

	_createButton: function (html, title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

    this._initElementEvents(link);

		L.DomEvent
		    .on(link, 'click', fn, context)
		    .on(link, 'click', this._refocusOnMap, context);

		return link;
	},

  _initElementEvents: function (ele) {
		L.DomEvent
		    .on(ele, 'click', L.DomEvent.stopPropagation)
		    .on(ele, 'mousedown', L.DomEvent.stopPropagation)
		    .on(ele, 'dblclick', L.DomEvent.stopPropagation)
		    .on(ele, 'click', L.DomEvent.preventDefault);
  },

  _enterMode: function (mode) {
    this.options.modes.forEach(function (m) {
      var button = this['_' + m + 'Button'];

      if (mode == m) {
        L.DomUtil.removeClass(button, 'leaflet-disabled');
      } else {
        L.DomUtil.addClass(button, 'leaflet-disabled');
      }
    }, this);
  },
  _exitMode: function (mode) {
    this.options.modes.forEach(function (m) {
      var button = this['_' + m + 'Button'];
      L.DomUtil.removeClass(button, 'leaflet-disabled');
    }, this);
  },
  _isDisabled: function (ele) {
    return ele.className.indexOf('leaflet-disabled') > -1;
  },

  disable: function () {
    this.options.modes.forEach(function (m) {
      var button = this['_' + m + 'Button'];
      L.DomUtil.addClass(button, 'leaflet-disabled');
    });
  },
  enable: function () {
    this.options.modes.forEach(function (m) {
      var button = this['_' + m + 'Button'];
      L.DomUtil.removeClass(button, 'leaflet-disabled');
    });
  }
});

L.control.controllableImageOverlay = function (options) {
	return new L.Control.ControllableImageOverlay(options);
};
