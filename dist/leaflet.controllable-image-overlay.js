(function() {
  L.Control.ControllableImageOverlay = L.Control.extend({
    options: {
      position: 'topleft',
      modes: ['image', 'rotate', 'scale', 'move', 'transparent']
    },
    initialize: function(options) {
      L.Control.prototype.initialize.call(this, options);
      return this._overlay = L.controllableImageOverlay(this);
    },
    onAdd: function(map) {
      var className, removeItem, resetItem, urlItem;
      className = 'leaflet-controllable-image-overlay';
      this._container = L.DomUtil.create('div', className + ' leaflet-bar');
      this._map = map;
      this._imageButton = this._createButton('C', 'Change image', className + '-image', this._container, this._changeImage, this);
      this._rotateButton = this._createButton('R', 'Rotate image', className + '-rotate', this._container, this._enableRotate, this);
      this._scaleButton = this._createButton('S', 'Resize image', className + '-scale', this._container, this._enableScale, this);
      this._moveButton = this._createButton('M', 'Move image', className + '-move', this._container, this._enableMove, this);
      this._transparentButton = this._createButton('T', 'Transparent image', className + '-transparent', this._container, this._enableTransparent, this);
      this._imageForm = L.DomUtil.create('ul', className + '-actions', this._container);
      urlItem = L.DomUtil.create('li', '', this._imageForm);
      resetItem = L.DomUtil.create('li', '', this._imageForm);
      removeItem = L.DomUtil.create('li', '', this._imageForm);
      this._imageUrl = L.DomUtil.create('input', '', urlItem);
      this._imageUrl.placeholder = 'Fill your image url in here';
      this._initElementEvents(this._imageUrl);
      this._resetButton = this._createButton('Reset', 'Reset image', '', resetItem, this._resetImage, this);
      this._removeButton = this._createButton('Remove', 'Remove image', '', removeItem, this._removeImage, this);
      L.DomUtil.addClass(this._rotateButton, 'leaflet-disabled');
      L.DomUtil.addClass(this._scaleButton, 'leaflet-disabled');
      L.DomUtil.addClass(this._moveButton, 'leaflet-disabled');
      L.DomUtil.addClass(this._transparentButton, 'leaflet-disabled');
      this._overlay.addTo(map);
      return this._container;
    },
    onRemove: function(map) {},
    onImageChanged: function() {
      L.DomUtil.removeClass(this._rotateButton, 'leaflet-disabled');
      L.DomUtil.removeClass(this._scaleButton, 'leaflet-disabled');
      L.DomUtil.removeClass(this._moveButton, 'leaflet-disabled');
      return L.DomUtil.removeClass(this._transparentButton, 'leaflet-disabled');
    },
    _changeImage: function(e) {
      var image;
      if (this._isDisabled(this._imageButton)) {
        return;
      }
      if (this._changeImageEnabled) {
        this._changeImageEnabled = false;
        L.DomUtil.removeClass(this._container, 'actions-shown');
        image = this._imageUrl.value.trim();
        if (image.length > 0 && image !== this.options.image) {
          this.options.image = image;
          this._map.fire('image:changed');
        }
        if (this.options.image) {
          return this._exitMode('image');
        }
      } else {
        this._changeImageEnabled = true;
        this._enterMode('image');
        L.DomUtil.addClass(this._container, 'actions-shown');
        return setTimeout(((function(_this) {
          return function() {
            return _this._imageUrl.focus();
          };
        })(this)), 10);
      }
    },
    _enableRotate: function(e) {
      if (this._isDisabled(this._rotateButton)) {
        return;
      }
      if (this._imageRotateEnabled) {
        this._imageRotateEnabled = false;
        this._exitMode('rotate');
        return this._map.fire('image:rotate:disabled');
      } else {
        this._imageRotateEnabled = true;
        this._enterMode('rotate');
        return this._map.fire('image:rotate:enabled');
      }
    },
    _enableScale: function(e) {
      if (this._isDisabled(this._scaleButton)) {
        return;
      }
      if (this._imageScaleEnabled) {
        this._imageScaleEnabled = false;
        this._exitMode('scale');
        return this._map.fire('image:scale:disabled');
      } else {
        this._imageScaleEnabled = true;
        this._enterMode('scale');
        return this._map.fire('image:scale:enabled');
      }
    },
    _enableMove: function(e) {
      if (this._isDisabled(this._moveButton)) {
        return;
      }
      if (this._imageMoveEnabled) {
        this._imageMoveEnabled = false;
        this._exitMode('move');
        return this._map.fire('image:move:disabled');
      } else {
        this._imageMoveEnabled = true;
        this._enterMode('move');
        return this._map.fire('image:move:enabled');
      }
    },
    _enableTransparent: function(e) {
      if (this._isDisabled(this._transparentButton)) {
        return;
      }
      if (this._imageTransparentEnabled) {
        this._imageTransparentEnabled = false;
        this._exitMode('transparent');
        return this._map.fire('image:transparent:disabled');
      } else {
        this._imageTransparentEnabled = true;
        this._enterMode('transparent');
        return this._map.fire('image:transparent:enabled');
      }
    },
    _resetImage: function(e) {
      this._changeImageEnabled = false;
      this._imageUrl.value = this.options.image || '';
      L.DomUtil.removeClass(this._container, 'actions-shown');
      this._map.fire('image:reset');
      if (this._overlay._image) {
        return this._exitMode('image');
      }
    },
    _removeImage: function(e) {
      this._changeImageEnabled = false;
      L.DomUtil.removeClass(this._container, 'actions-shown');
      this._imageUrl.value = '';
      this.options.image = '';
      this._map.fire('image:remove');
      return this._enterMode('image');
    },
    _createButton: function(html, title, className, container, fn, context) {
      var link;
      link = L.DomUtil.create('a', className, container);
      link.innerHTML = html;
      link.href = '#';
      link.title = title;
      this._initElementEvents(link);
      L.DomEvent.on(link, 'click', fn, context).on(link, 'click', this._refocusOnMap, context);
      return link;
    },
    _initElementEvents: function(ele) {
      return L.DomEvent.on(ele, 'click', L.DomEvent.stopPropagation).on(ele, 'mousedown', L.DomEvent.stopPropagation).on(ele, 'dblclick', L.DomEvent.stopPropagation).on(ele, 'click', L.DomEvent.preventDefault);
    },
    _enterMode: function(mode) {
      return this.options.modes.forEach((function(m) {
        var button;
        button = this['_' + m + 'Button'];
        if (mode === m) {
          return L.DomUtil.removeClass(button, 'leaflet-disabled');
        } else {
          return L.DomUtil.addClass(button, 'leaflet-disabled');
        }
      }), this);
    },
    _exitMode: function(mode) {
      return this.options.modes.forEach((function(m) {
        var button;
        button = this['_' + m + 'Button'];
        return L.DomUtil.removeClass(button, 'leaflet-disabled');
      }), this);
    },
    _isDisabled: function(ele) {
      return ele.className.indexOf('leaflet-disabled') > -1;
    },
    disable: function() {
      return this.options.modes.forEach(function(m) {
        var button;
        button = this['_' + m + 'Button'];
        return L.DomUtil.addClass(button, 'leaflet-disabled');
      });
    },
    enable: function() {
      return this.options.modes.forEach(function(m) {
        var button;
        button = this['_' + m + 'Button'];
        return L.DomUtil.removeClass(button, 'leaflet-disabled');
      });
    }
  });

  L.control.controllableImageOverlay = function(options) {
    return new L.Control.ControllableImageOverlay(options);
  };

}).call(this);

(function() {
  L.ControllableImageOverlay = L.Class.extend({
    includes: L.Mixin.Events,
    options: {
      imageRotate: 0,
      imageOpacity: 1,
      imageScale: 1
    },
    initialize: function(control) {
      return this._control = control;
    },
    onAdd: function(map) {
      this._map = map;
      return map.on('image:changed', this._resetImage, this);
    },
    _onImageAdded: function() {
      this._map.getPanes().overlayPane.appendChild(this._image);
      this._map.on('viewreset', this._reset, this);
      if (this._map.options.zoomAnimation && L.Browser.any3d) {
        this._map.on('zoomanim', this._animateZoom, this);
      }
      this._map.on('image:rotate:enabled', (function() {
        L.DomEvent.on(this._image, 'mousedown', this._rotateStart, this);
        L.DomEvent.on(this._image, 'mousemove', this._rotating, this);
        L.DomEvent.on(this._image, 'mouseout', this._rotateEnd, this);
        return L.DomEvent.on(this._image, 'mouseup', this._rotateEnd, this);
      }), this);
      this._map.on('image:rotate:disabled', (function() {
        L.DomEvent.off(this._image, 'mousedown', this._rotateStart, this);
        L.DomEvent.off(this._image, 'mousemove', this._rotating, this);
        L.DomEvent.off(this._image, 'mouseout', this._rotateEnd, this);
        return L.DomEvent.off(this._image, 'mouseup', this._rotateEnd, this);
      }), this);
      this._map.on('image:scale:enabled', (function() {
        L.DomEvent.on(this._image, 'mousedown', this._scaleStart, this);
        L.DomEvent.on(this._image, 'mousemove', this._scaling, this);
        L.DomEvent.on(this._image, 'mouseout', this._scaleEnd, this);
        return L.DomEvent.on(this._image, 'mouseup', this._scaleEnd, this);
      }), this);
      this._map.on('image:scale:disabled', (function() {
        L.DomEvent.off(this._image, 'mousedown', this._scaleStart, this);
        L.DomEvent.off(this._image, 'mousemove', this._scaling, this);
        L.DomEvent.off(this._image, 'mouseout', this._scaleEnd, this);
        return L.DomEvent.off(this._image, 'mouseup', this._scaleEnd, this);
      }), this);
      this._map.on('image:move:enabled', (function() {
        L.DomEvent.on(this._image, 'mousedown', this._moveStart, this);
        L.DomEvent.on(this._image, 'mousemove', this._moving, this);
        L.DomEvent.on(this._image, 'mouseout', this._moveEnd, this);
        return L.DomEvent.on(this._image, 'mouseup', this._moveEnd, this);
      }), this);
      this._map.on('image:move:disabled', (function() {
        L.DomEvent.off(this._image, 'mousedown', this._moveStart, this);
        L.DomEvent.off(this._image, 'mousemove', this._moving, this);
        L.DomEvent.off(this._image, 'mouseout', this._moveEnd, this);
        return L.DomEvent.off(this._image, 'mouseup', this._moveEnd, this);
      }), this);
      this._map.on('image:transparent:enabled', (function() {
        return L.DomEvent.on(this._image, 'mousewheel', this._transparent, this);
      }), this);
      this._map.on('image:transparent:disabled', (function() {
        return L.DomEvent.off(this._image, 'mousewheel', this._transparent, this);
      }), this);
      this._map.on('image:reset', (function() {
        return this._resetImage();
      }), this);
      this._map.on('image:remove', (function() {
        return this._removeImage();
      }), this);
      return this._reset();
    },
    _rotateStart: function(e) {
      L.DomEvent.stopPropagation(e);
      this._imageRotating = true;
      return this._imageRotateDiff = this._getMouseImageRotate(e) - this.options.imageRotate;
    },
    _rotateEnd: function(e) {
      L.DomEvent.stopPropagation(e);
      return this._imageRotating = false;
    },
    _rotating: function(e) {
      if (!this._imageRotating) {
        return;
      }
      L.DomEvent.stopPropagation(e);
      this.options.imageRotate = this._getMouseImageRotate(e) - this._imageRotateDiff;
      return this._reset();
    },
    _getMouseImageRotate: function(e) {
      var centerX, centerY, degree, imageBounding, radians;
      imageBounding = this._image.getBoundingClientRect();
      centerX = imageBounding.left + imageBounding.width / 2;
      centerY = imageBounding.top + imageBounding.height / 2;
      radians = Math.atan2(e.pageX - centerX, e.pageY - centerY);
      degree = (radians * (180 / Math.PI) * -1) + 90;
      return degree;
    },
    _scaleStart: function(e) {
      L.DomEvent.stopPropagation(e);
      this._imageScaling = true;
      this._imageScalingInitScale = this.options.imageScale;
      return this._imageScalingInitPoint = {
        x: e.pageX,
        y: e.pageY
      };
    },
    _scaleEnd: function(e) {
      L.DomEvent.stopPropagation(e);
      return this._imageScaling = false;
    },
    _scaling: function(e) {
      var centerX, centerY, diffInitX, diffInitY, diffNowX, diffNowY, distanInit, distanNow, imageBounding, scale;
      if (!this._imageScaling) {
        return;
      }
      L.DomEvent.stopPropagation(e);
      imageBounding = this._image.getBoundingClientRect();
      centerX = imageBounding.left + imageBounding.width / 2;
      centerY = imageBounding.top + imageBounding.height / 2;
      diffNowX = centerX - e.pageX;
      diffNowY = centerY - e.pageY;
      diffInitX = centerX - this._imageScalingInitPoint.x;
      diffInitY = centerY - this._imageScalingInitPoint.y;
      distanNow = Math.sqrt(Math.pow(diffNowX, 2) + Math.pow(diffNowY, 2));
      distanInit = Math.sqrt(Math.pow(diffInitX, 2) + Math.pow(diffInitY, 2));
      scale = distanNow / distanInit * this._imageScalingInitScale;
      this.options.imageScale = scale;
      return this._reset();
    },
    _moveStart: function(e) {
      L.DomEvent.stopPropagation(e);
      return this._imageMoving = true;
    },
    _moveEnd: function(e) {
      L.DomEvent.stopPropagation(e);
      return this._imageMoving = false;
    },
    _moving: function(e) {
      var ne, sw;
      if (!this._imageMoving) {
        return;
      }
      L.DomEvent.stopPropagation(e);
      ne = this._map.latLngToLayerPoint(this._bounds.getNorthEast());
      sw = this._map.latLngToLayerPoint(this._bounds.getSouthWest());
      ne.x += e.movementX;
      ne.y += e.movementY;
      sw.x += e.movementX;
      sw.y += e.movementY;
      this._bounds = L.latLngBounds(this._map.layerPointToLatLng(sw), this._map.layerPointToLatLng(ne));
      return this._reset();
    },
    _transparent: function(e) {
      L.DomEvent.stopPropagation(e);
      this.options.imageOpacity = this.options.imageOpacity + e.wheelDelta / 120 / 50;
      if (this.options.imageOpacity > 1) {
        this.options.imageOpacity = 1;
      }
      if (this.options.imageOpacity < 0.2) {
        this.options.imageOpacity = 0.2;
      }
      return this._reset();
    },
    onRemove: function(map) {
      this._removeImage();
      this._map.off('image:changed', this._resetImage, this);
      if (map.options.zoomAnimation) {
        return map.off('zoomanim', this._animateZoom, this);
      }
    },
    addTo: function(map) {
      map.addLayer(this);
      return this;
    },
    bringToFront: function() {
      if (this._image) {
        this._map._panes.overlayPane.appendChild(this._image);
      }
      return this;
    },
    bringToBack: function() {
      var pane;
      pane = this._map._panes.overlayPane;
      if (this._image) {
        pane.insertBefore(this._image, pane.firstChild);
      }
      return this;
    },
    setUrl: function(url) {
      return this._image.src = url;
    },
    getAttribution: function() {
      return this.options.attribution;
    },
    _initImage: function() {
      if (!this._control.options.image) {
        return;
      }
      if (!this._image) {
        this._image = L.DomUtil.create('img', 'leaflet-controllable-image-layer');
        if (this._map.options.zoomAnimation && L.Browser.any3d) {
          L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
        } else {
          L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
        }
        return L.extend(this._image, {
          galleryimg: 'no',
          onselectstart: L.Util.falseFn,
          onmousemove: L.Util.falseFn,
          onload: L.bind(this._onImageLoad, this),
          src: this._control.options.image
        });
      } else {
        return this._image.src = this._control.options.image;
      }
    },
    _animateZoom: function(e) {
      var image, map, nw, origin, scale, se, size, topLeft;
      map = this._map;
      image = this._image;
      scale = map.getZoomScale(e.zoom);
      nw = this._bounds.getNorthWest();
      se = this._bounds.getSouthEast();
      topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center);
      size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft);
      origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));
      return image.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(origin) + ' scale(' + scale * this.imageScale + ')' + ' rotate(' + this.options.imageRotate + ')';
    },
    _resetOptions: function() {
      this.options.imageRotate = 0;
      this.options.imageOpacity = 1;
      return this.options.imageScale = 1;
    },
    _resetImage: function() {
      this._resetOptions();
      this._initImage();
      return this._resetImageBounds((function(_this) {
        return function() {
          return _this._reset();
        };
      })(this));
    },
    _removeImage: function() {
      this._resetOptions();
      if (this._image) {
        this._map.getPanes().overlayPane.removeChild(this._image);
      }
      this._map.off('viewreset', this._reset, this);
      return this._image = null;
    },
    _reset: function() {
      var image, size, topLeft;
      if (!this._imageLoaded) {
        return;
      }
      image = this._image;
      topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest());
      size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);
      L.DomUtil.setPosition(image, topLeft);
      L.DomUtil.setOpacity(image, this.options.imageOpacity);
      image.style.width = size.x + 'px';
      image.style.height = size.y + 'px';
      image.style[L.DomUtil.TRANSFORM] += ' scale(' + this.options.imageScale + ')';
      return image.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.imageRotate + 'deg)';
    },
    _resetImageBounds: function(cb) {
      return this._getImageInfo(this._control.options.image, (function(_this) {
        return function(info) {
          var bl, bounds, centerX, centerY, displayHeight, displayWidth, height, ne, sw, tr, width;
          _this._imageLoaded = true;
          bounds = _this._map.getBounds();
          ne = _this._map.latLngToContainerPoint(bounds.getNorthEast());
          sw = _this._map.latLngToContainerPoint(bounds.getSouthWest());
          width = ne.x - sw.x;
          height = sw.y - ne.y;
          centerX = width / 2;
          centerY = height / 2;
          if (info.width > info.height) {
            displayHeight = centerX / info.width * info.height;
            tr = _this._map.containerPointToLatLng(L.point(3 / 4 * width, centerY - displayHeight / 2));
            bl = _this._map.containerPointToLatLng(L.point(1 / 4 * width, centerY + displayHeight / 2));
          } else {
            displayWidth = centerY / info.height * info.width / 2;
            tr = _this._map.containerPointToLatLng(L.point(centerX + displayWidth / 2, 1 / 4 * height));
            bl = _this._map.containerPointToLatLng(L.point(centerX - displayWidth / 2, 3 / 4 * height));
          }
          _this._bounds = L.latLngBounds([bl, tr]);
          return cb();
        };
      })(this));
    },
    _onImageLoad: function() {
      this.fire('load');
      return this._resetImageBounds((function(_this) {
        return function() {
          return _this._onImageAdded();
        };
      })(this));
    },
    _getImageInfo: function(imgUrl, callback) {
      var img;
      img = new Image();
      img.src = imgUrl;
      return img.onload = function() {
        return callback({
          width: img.width,
          height: img.height
        });
      };
    }
  });

  L.controllableImageOverlay = function(url, bounds, options) {
    return new L.ControllableImageOverlay(url, bounds, options);
  };

}).call(this);
