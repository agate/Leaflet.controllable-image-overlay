L.ControllableImageOverlay = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		opacity: 1,

    imageRotate: 0,
    imageOpacity: 1,
    imageScale: 1,
	},

	initialize: function (options) {
		L.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;

    if (!this._control) {
      this._control = new L.control.controllableImageOverlay();
      this._control.addTo(map);
    }

    map.on('image:changed', this._eventImageChanged, this);
	},

  _eventImageChanged: function () {
    this.options.imageRotate = 0;
    this.options.imageOpacity = 1;
    this.options.imageScale = 1;
    this.options.image = this._control.options.image;
    this._initImage();
  },

  _onImageAdded: function () {
    var map = this._map;

		map._panes.overlayPane.appendChild(this._image);

		map.on('viewreset', this._reset, this);

		if (map.options.zoomAnimation && L.Browser.any3d) {
			map.on('zoomanim', this._animateZoom, this);
		}

    map.on('image:rotate:enabled', function () {
      L.DomEvent.on(this._image, 'mousedown', this._rotateStart, this);
      L.DomEvent.on(this._image, 'mousemove', this._rotating, this);
      L.DomEvent.on(this._image, 'mouseout', this._rotateEnd, this);
      L.DomEvent.on(this._image, 'mouseup', this._rotateEnd, this);
    }, this);
    map.on('image:rotate:disabled', function () {
      L.DomEvent.off(this._image, 'mousedown', this._rotateStart, this);
      L.DomEvent.off(this._image, 'mousemove', this._rotating, this);
      L.DomEvent.off(this._image, 'mouseout', this._rotateEnd, this);
      L.DomEvent.off(this._image, 'mouseup', this._rotateEnd, this);
    }, this);

    map.on('image:scale:enabled', function () {
      L.DomEvent.on(this._image, 'mousedown', this._scaleStart, this);
      L.DomEvent.on(this._image, 'mousemove', this._scaling, this);
      L.DomEvent.on(this._image, 'mouseout', this._scaleEnd, this);
      L.DomEvent.on(this._image, 'mouseup', this._scaleEnd, this);
    }, this);
    map.on('image:scale:disabled', function () {
      L.DomEvent.off(this._image, 'mousedown', this._scaleStart, this);
      L.DomEvent.off(this._image, 'mousemove', this._scaling, this);
      L.DomEvent.off(this._image, 'mouseout', this._scaleEnd, this);
      L.DomEvent.off(this._image, 'mouseup', this._scaleEnd, this);
    }, this);

    map.on('image:move:enabled', function () {
      L.DomEvent.on(this._image, 'mousedown', this._moveStart, this);
      L.DomEvent.on(this._image, 'mousemove', this._moving, this);
      L.DomEvent.on(this._image, 'mouseout', this._moveEnd, this);
      L.DomEvent.on(this._image, 'mouseup', this._moveEnd, this);
    }, this);
    map.on('image:move:disabled', function () {
      L.DomEvent.off(this._image, 'mousedown', this._moveStart, this);
      L.DomEvent.off(this._image, 'mousemove', this._moving, this);
      L.DomEvent.off(this._image, 'mouseout', this._moveEnd, this);
      L.DomEvent.off(this._image, 'mouseup', this._moveEnd, this);
    }, this);

    map.on('image:transparent:enabled', function () {
      L.DomEvent.on(this._image, 'mousewheel', this._transparent, this);
    }, this);
    map.on('image:transparent:disabled', function () {
      L.DomEvent.off(this._image, 'mousewheel', this._transparent, this);
    }, this);

		this._reset();
  },

  // ROTATE STUFF
  _rotateStart: function (e) {
    L.DomEvent.stopPropagation(e);

    this._imageRotating = true;
    this._imageRotateDiff = this._getMouseImageRotate(e) - this.options.imageRotate;
  },
  _rotateEnd: function (e) {
    L.DomEvent.stopPropagation(e);

    this._imageRotating = false;
  },
  _rotating: function (e) {
    if (!this._imageRotating) return;

    L.DomEvent.stopPropagation(e);

    this.options.imageRotate = this._getMouseImageRotate(e) - this._imageRotateDiff;
    this._reset();
  },
  _getMouseImageRotate: function (e) {
    var imageBounding = this._image.getBoundingClientRect(),
        centerX = imageBounding.left + imageBounding.width / 2,
        centerY = imageBounding.top + imageBounding.height / 2,
        radians = Math.atan2(e.pageX - centerX, e.pageY - centerY),
        degree = (radians * (180 / Math.PI) * -1) + 90;

    return degree;
  },

  // SCALE STUFF
  _scaleStart: function (e) {
    L.DomEvent.stopPropagation(e);

    this._imageScaling = true;
    this._imageScalingInitScale = this.options.imageScale;
    this._imageScalingInitPoint = {
      x: e.pageX,
      y: e.pageY,
    };
  },
  _scaleEnd: function (e) {
    L.DomEvent.stopPropagation(e);

    this._imageScaling = false;
  },
  _scaling: function (e) {
    if (!this._imageScaling) return;

    L.DomEvent.stopPropagation(e);

    var imageBounding = this._image.getBoundingClientRect(),
        centerX = imageBounding.left + imageBounding.width / 2,
        centerY = imageBounding.top + imageBounding.height / 2,
        diffNowX = centerX - e.pageX,
        diffNowY = centerY - e.pageY,
        diffInitX = centerX - this._imageScalingInitPoint.x,
        diffInitY = centerY - this._imageScalingInitPoint.y,
        distanNow = Math.sqrt(Math.pow(diffNowX, 2) + Math.pow(diffNowY, 2)),
        distanInit = Math.sqrt(Math.pow(diffInitX, 2) + Math.pow(diffInitY, 2)),
        scale = distanNow / distanInit * this._imageScalingInitScale;

    this.options.imageScale = scale;
    this._reset();
  },

  // MOVE STUFF
  _moveStart: function (e) {
    L.DomEvent.stopPropagation(e);

    this._imageMoving = true;
  },
  _moveEnd: function (e) {
    L.DomEvent.stopPropagation(e);

    this._imageMoving = false;
  },
  _moving: function (e) {
    if (!this._imageMoving) return;

    L.DomEvent.stopPropagation(e);

    var ne = map.latLngToLayerPoint(this._bounds.getNorthEast()),
        sw = map.latLngToLayerPoint(this._bounds.getSouthWest());

    ne.x += e.movementX;
    ne.y += e.movementY;
    sw.x += e.movementX;
    sw.y += e.movementY;

    this._bounds = L.latLngBounds(
      map.layerPointToLatLng(sw),
      map.layerPointToLatLng(ne)
    )

    this._reset();
  },

  // TRANSPARENT STUFF
  _transparent: function (e) {
    L.DomEvent.stopPropagation(e);

    this.options.imageOpacity = this.options.imageOpacity + e.wheelDelta / 120 / 50;

    if (this.options.imageOpacity > 1) this.options.imageOpacity = 1;
    if (this.options.imageOpacity < 0.2) this.options.imageOpacity = 0.2;

    this._reset();
  },

	onRemove: function (map) {
		map.getPanes().overlayPane.removeChild(this._image);

		map.off('viewreset', this._reset, this);

		if (map.options.zoomAnimation) {
			map.off('zoomanim', this._animateZoom, this);
		}
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		this._updateOpacity();
		return this;
	},

	// TODO remove bringToFront/bringToBack duplication from TileLayer/Path
	bringToFront: function () {
		if (this._image) {
			this._map._panes.overlayPane.appendChild(this._image);
		}
		return this;
	},

	bringToBack: function () {
		var pane = this._map._panes.overlayPane;
		if (this._image) {
			pane.insertBefore(this._image, pane.firstChild);
		}
		return this;
	},

	setUrl: function (url) {
    this.options.image = url
		this._image.src = url;
	},

	getAttribution: function () {
		return this.options.attribution;
	},

	_initImage: function () {
    if (!this.options.image) return;

    if (!this._image) {
      this._image = L.DomUtil.create('img', 'leaflet-controllable-image-layer');

      if (this._map.options.zoomAnimation && L.Browser.any3d) {
        L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
      } else {
        L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
      }

      this._updateOpacity();

      //TODO createImage util method to remove duplication
      L.extend(this._image, {
        galleryimg: 'no',
        onselectstart: L.Util.falseFn,
        onmousemove: L.Util.falseFn,
        onload: L.bind(this._onImageLoad, this),
        src: this.options.image
      });

      this._onImageAdded()

    } else {
      this._image.src = this.options.image;
    }
	},

	_animateZoom: function (e) {
		var map = this._map,
		    image = this._image,
		    scale = map.getZoomScale(e.zoom),
		    nw = this._bounds.getNorthWest(),
		    se = this._bounds.getSouthEast(),

		    topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
		    size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
		    origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));

		image.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(origin) +
                                       ' scale(' + scale * this.imageScale + ')' +
                                       ' rotate(' + this.options.imageRotate + ')';
	},

	_reset: function () {
    if (!this._imageLoaded) return;

		var image   = this._image,
		    topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		    size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

		L.DomUtil.setPosition(image, topLeft);
		L.DomUtil.setOpacity(image, this.options.imageOpacity);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';

    image.style[L.DomUtil.TRANSFORM] += ' scale(' + this.options.imageScale+ ')';
    image.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.imageRotate + 'deg)';
	},

	_onImageLoad: function () {
    var self = this,
        map = this._map;

		this.fire('load');
    this._getImageInfo(this.options.image, function (info) {
      self._imageLoaded = true;

      var bounds = map.getBounds();
      var ne = map.latLngToContainerPoint(bounds.getNorthEast());
      var sw = map.latLngToContainerPoint(bounds.getSouthWest());
      var width = ne.x - sw.x;
      var height = sw.y - ne.y;
      var centerX = width / 2;
      var centerY = height / 2;

      if (info.width > info.height) {
        var displayHeight = centerX / info.width * info.height;
        var tr = map.containerPointToLatLng(L.point(3 / 4 * width, centerY - displayHeight / 2)),
            bl = map.containerPointToLatLng(L.point(1 / 4 * width, centerY + displayHeight / 2));
      } else {
        var displayWidth = centerY / info.height * info.width / 2;
        var tr = map.containerPointToLatLng(L.point(centerX + displayWidth / 2, 1 / 4 * height)),
            bl = map.containerPointToLatLng(L.point(centerX - displayWidth / 2, 3 / 4 * height));
      }

      self._bounds = L.latLngBounds([bl, tr]);
      self._reset();
    });
	},

  _getImageInfo: function (imgUrl, callback) {
    var img = new Image();
    img.src = imgUrl;
    img.onload = function () {
      callback({
        width: img.width,
        height: img.height
      });
    }
  },

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	}
});

L.controllableImageOverlay = function (url, bounds, options) {
	return new L.ControllableImageOverlay(url, bounds, options);
};
