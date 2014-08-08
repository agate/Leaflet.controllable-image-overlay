L.Control.ControllableImageOverlay = L.Control.extend({
	options: {
		position: 'topleft',
    modes: [
      'rotate',
      'scale',
      'move',
      'transparent'
    ]
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

		var stop = L.DomEvent.stopPropagation;

		L.DomEvent
		    .on(link, 'click', stop)
		    .on(link, 'mousedown', stop)
		    .on(link, 'dblclick', stop)
		    .on(link, 'click', L.DomEvent.preventDefault)
		    .on(link, 'click', fn, context)
		    .on(link, 'click', this._refocusOnMap, context);

		return link;
	},

  _addClass: function (ele, className) {
    var classNames = this._getClassNames(ele);
    classNames.push(className);
    ele.className = classNames.join(' ');
  },
  _removeClass: function (ele, className) {
    ele.className = this._getClassNames(ele).filter(function (c) {
      return c != className;
    }).join(' ');
  },
  _getClassNames: function (ele) {
    return ele.className.split(/\s+/).filter(function (c) {
      return c.length > 0;
    });
  },

  _enterMode: function (mode) {
    this.options.modes.forEach(function (m) {
      var button = this['_' + m + 'Button'];

      if (mode == m) {
        this._removeClass(button, 'leaflet-disabled');
      } else {
        this._addClass(button, 'leaflet-disabled');
      }
    }, this);
  },
  _exitMode: function (mode) {
    this.options.modes.forEach(function (m) {
      var button = this['_' + m + 'Button'];
      this._removeClass(button, 'leaflet-disabled');
    }, this);
  },
  _isDisabled: function (ele) {
    return ele.className.indexOf('leaflet-disabled') > -1;
  },

  disable: function () {
    this.options.modes.forEach(function (m) {
      var button = this['_' + m + 'Button'];
      this._addClass(button, 'leaflet-disabled');
    });
  },
  enable: function () {
    this.options.modes.forEach(function (m) {
      var button = this['_' + m + 'Button'];
      this._removeClass(button, 'leaflet-disabled');
    });
  }
});

L.control.controllableImageOverlay = function (options) {
	return new L.Control.ControllableImageOverlay(options);
};
