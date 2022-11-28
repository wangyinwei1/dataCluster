IMAP.DataClusterOptions = IMAP.Class({
  initialize: function () {
    this.gridSize = 60
    this.minimumClusterSize = 2
    this.maxZoom = 0
    this.styles = []
    this.zoomOnClick = !0
  },
})
IMAP.DataClusterStyle = IMAP.Class({
  initialize: function () {
    this.url = ""
    this.width = this.height = 35
    this.anchor = [25, 0]
    this.textColor = "black"
    this.textSize = 11
    this.maxSize = 10
    this.textDecoration = "none"
    this.fontWeight = "bold"
    this.fontStyle = "normal"
    this.fontFamily = "Arial,sans-serif"
    this.backgroundPosition = "0,0"
  },
})
IMAP.ClusterIcon = IMAP.Class(IMAP.DOMEvents, {
  initialize: function (a, b) {
    this.cluster_ = a
    this.styles_ = b
    this.sums_ = this.div_ = this.center_ = null
    this.visible_ = !1
    this._map = null
    IMAP.DOMEvents.prototype.initialize.apply(this, [])
    this.setMap(a.getMap())
  },
  setStyles: function (a) {
    this.styles_ = a
  },
  setMap: function (a) {
    null == a
      ? (this.onRemove_(), (this._map = null))
      : ((this._map = a), this.onAdd_())
  },
  getMap: function () {
    return this._map
  },
  show: function () {
    if (this.div_) {
      var a = this._getPosFromLatLng(this.center_)
      this.div_.style.cssText = this._createCss(a)
      this.div_.innerHTML = this.cluster_.printable_
        ? '<img src="' +
          this.url_ +
          '"><div style="position: absolute; top: 0px; left: 0px; width: ' +
          this._width_ +
          'px;">' +
          this.sums_.text +
          "</div>"
        : this.sums_.text
      this.div_.title = this.cluster_.getDataCluster().getTitle()
      this.div_.style.display = ""
    }
    this.visible_ = !0
  },
  hide: function () {
    this.div_ && (this.div_.style.display = "none")
    this.visible_ = !1
  },
  useStyle: function (a) {
    this.sums_ = a
    a = Math.max(0, a.index - 1)
    a = Math.min(this.styles_.length - 1, a)
    a = this.styles_[a]
    this.url_ = a.url
    this.height_ = a.height
    this.width_ = a.width
    this.anchor_ = a.anchor
    this.anchorIcon_ = a.anchorIcon || [
      parseInt(this.height_ / 2, 10),
      parseInt(this.width_ / 2, 10),
    ]
    this.textColor_ = a.textColor || "black"
    this.textSize_ = a.textSize || 11
    this.textDecoration_ = a.textDecoration || "none"
    this.fontWeight_ = a.fontWeight || "bold"
    this.fontStyle_ = a.fontStyle || "normal"
    this.fontFamily_ = a.fontFamily || "Arial,sans-serif"
    this.backgroundPosition_ = a.backgroundPosition || "0 0"
  },
  setCenter: function (a) {
    this.center_ = a
  },
  _draw: function () {
    if (this.visible_) {
      var a = this.getPosFromLatLng_(this.center_)
      this.div_.style.top = a[1] + "px"
      this.div_.style.left = a[0] + "px"
    }
  },
  _createCss: function (a) {
    var b = []
    this.cluster_.printable_ ||
      (b.push("background-image:url(" + this.url_ + ");"),
      b.push("background-position:" + this.backgroundPosition_ + ";"),
      b.push("background-repeat:no-repeat;"))
    "object" === typeof this.anchor_
      ? ("number" === typeof this.anchor_[0] &&
        0 < this.anchor_[0] &&
        this.anchor_[0] < this.height_
          ? b.push(
              "height:" +
                this.height_ +
                "px; padding-top:" +
                this.anchor_[0] +
                "px;"
            )
          : b.push(
              "height:" +
                this.height_ +
                "px; line-height:" +
                this.height_ +
                "px;"
            ),
        "number" === typeof this.anchor_[1] &&
        0 < this.anchor_[1] &&
        this.anchor_[1] < this.width_
          ? b.push(
              "width:" +
                (this.width_ - this.anchor_[1]) +
                "px; padding-left:" +
                this.anchor_[1] +
                "px;"
            )
          : b.push("width:" + this.width_ + "px; text-align:center;"))
      : b.push(
          "height:" +
            this.height_ +
            "px; line-height:" +
            this.height_ +
            "px; width:" +
            this.width_ +
            "px; text-align:center;"
        )
    b.push(
      "cursor:pointer; top:" +
        a.y +
        "px; left:" +
        a.x +
        "px; color:" +
        this.textColor_ +
        "; position:absolute; font-size:" +
        this.textSize_ +
        "px; font-family:" +
        this.fontFamily_ +
        "; font-weight:" +
        this.fontWeight_ +
        "; font-style:" +
        this.fontStyle_ +
        "; text-decoration:" +
        this.textDecoration_ +
        ";"
    )
    return b.join("")
  },
  onAdd_: function () {
    var a = this
    if (!a.div) {
      a.div_ = IMAP.Function.createElement({
        name: "div",
      })
      a.visible_ && a.show()
      var b = a._map,
        c = IMAP.Constants
      a.attachToElement([
        {
          name: c.CLICK,
          element: a.div_,
          callback: function () {
            var d = a.cluster_
            d.getMarkers()
            a._triggerEventListener(a, c.CLICK)
            d.getDataCluster().getZoomOnClick() && b.zoomIn(null, !0)
          },
          object: a,
        },
        {
          name: c.MOUSE_OUT,
          element: a.div_,
          callback: function (b) {
            a._triggerEventListener(a, c.MOUSE_OUT)
          },
          object: a,
        },
        {
          name: c.MOUSE_OVER,
          element: a.div_,
          callback: function (b) {
            a._triggerEventListener(a, c.MOUSE_OVER)
          },
          object: a,
        },
      ])
      a._map.getOverlayLayer().getElement().overlayPane.appendChild(a.div_)
    }
  },
  _triggerEventListener: function (a, b) {
    var c = a.cluster_
    c.getDataCluster().triggerEvent(b, c.getCenter(), c.getMarkers())
  },
  onRemove_: function () {
    this.div_ &&
      this.div_.parentNode &&
      (this.hide(),
      this.detachToElement([
        {
          name: IMAP.Constants.CLICK,
          element: this.div_,
        },
        {
          name: IMAP.Constants.MOUSE_OUT,
          element: this.div_,
        },
        {
          name: IMAP.Constants.MOUSE_OVER,
          element: this.div_,
        },
      ]),
      this.div_.parentNode.removeChild(this.div_),
      (this.div_ = null),
      delete this.div_)
  },
  _getPosFromLatLng: function (a) {
    a = this._map.lnglatToLayerPixel(a)
    a.x -= this.anchorIcon_[1]
    a.y -= this.anchorIcon_[0]
    return a
  },
})
IMAP.Cluster = IMAP.Class({
  initialize: function (a) {
    debugger
    this.dataCluster_ = a
    this.map_ = a.getMap()
    this.gridSize_ = a.getGridSize()
    this.minimumClusterSize_ = a.getMinimumClusterSize()
    this.averageCenter_ = a.getAverageCenter()
    this.printable_ = a.getPrintable()
    this.markers_ = []
    this.bounds_ = this.center_ = null
    this.clusterIcon_ = new IMAP.ClusterIcon(this, a.getStyles())
  },
  setStyles: function (a) {
    this.clusterIcon_.setStyles(a)
    this.updateIcon()
  },
  getClusterIcon: function () {
    return self.clusterIcon_
  },
  getSize: function () {
    return this.markers_.length
  },
  getMarkers: function () {
    return this.markers_
  },
  getCenter: function () {
    return this.center_
  },
  getMap: function () {
    return this.map_
  },
  getDataCluster: function () {
    return this.dataCluster_
  },
  getBounds: function () {
    var a,
      b = new IMAP.LngLatBounds(
        new IMAP.LngLat(this.center_.lng, this.center_.lat),
        new IMAP.LngLat(this.center_.lng, this.center_.lat)
      ),
      c = this.getMarkers()
    for (a = 0; a < c.length; a++) b.extend(c[a].getPosition())
    return b
  },
  remove: function () {
    this.clusterIcon_.setMap(null)
    this.markers_ = []
  },
  addMarker: function (a) {
    if (this.isMarkerAlreadyAdded_(a)) return !1
    if (!this.center_) (this.center_ = a.getPosition()), this.calculateBounds_()
    else if (this.averageCenter_) {
      var b = this.markers_.length + 1,
        c = (this.center_.lat * (b - 1) + a.getPosition().lat) / b,
        b = (this.center_.lng * (b - 1) + a.getPosition().lng) / b
      this.center_ = new IMAP.LngLat(b, c)
      this.calculateBounds_()
    }
    a.isAdded = !0
    a.cluster = this
    this.markers_.push(a)
    return !0
  },
  isMarkerInClusterBounds: function (a) {
    return this.bounds_.containsLngLat(a.getPosition())
  },
  addMarkerToMap: function () {
    for (
      var markersLength = this.markers_.length,
        overlayLayer = this.getMap().getOverlayLayer(),
        item,
        index = 0;
      index < markersLength;
      index++
    )
      (item = this.markers_[index]),
        overlayLayer.addOverlay(item),
        this._addMarkerEvts(item)
  },
  _addMarkerEvts: function (marker) {
    var that = this,
      c = IMAP.Constants
    marker.addEventListener(
      c.CLICK,
      function () {
        that.dataCluster_.triggerEvent(c.CLICK, that.center_, [marker])
      },
      that
    )
    marker.addEventListener(
      c.MOUSE_OUT,
      function () {
        that.dataCluster_.triggerEvent(c.MOUSE_OUT, that.center_, [marker])
      },
      that
    )
    marker.addEventListener(
      c.MOUSE_OVER,
      function () {
        that.dataCluster_.triggerEvent(c.MOUSE_OVER, that.center_, [marker])
      },
      that
    )
  },
  removeMarker: function () {
    for (
      var markersLength = this.markers_.length,
        overlayLayer = this.getMap().getOverlayLayer(),
        index = 0;
      index < markersLength;
      index++
    )
      this.markers_[index].getMap() &&
        overlayLayer.removeOverlay(this.markers_[index])
  },
  updateIcon: function () {
    //zoom 小于最大zoom 或 点位数量小于最小聚合
    var markersLength = this.markers_.length,
      maxZoom = this.dataCluster_.getMaxZoom()
    ;(null !== maxZoom && this.map_.getZoom() < maxZoom) ||
    markersLength < this.minimumClusterSize_
      ? (this.clusterIcon_.hide(), this.addMarkerToMap())
      : (this.removeMarker(),
        this.dataCluster_.getStyles(),
        (a = this.dataCluster_.getCalculator()(
          this.markers_,
          this.dataCluster_.getStyles(),
          this.dataCluster_
        )),
        this.clusterIcon_.setCenter(this.center_),
        this.clusterIcon_.useStyle(a),
        this.clusterIcon_.show())
  },
  calculateBounds_: function () {
    var a = this.center_,
      a = new IMAP.LngLatBounds(
        new IMAP.LngLat(a.lng, a.lat),
        new IMAP.LngLat(a.lng, a.lat)
      )
    this.bounds_ = this.dataCluster_.getExtendedBounds(a)
  },
  isMarkerAlreadyAdded_: function (a) {
    var b = this.markers_
    if (b.indexOf) return -1 !== b.indexOf(a)
    for (var c = 0, d = b.length; c < d; ++c) if (a === b[c]) return !0
    return !1
  },
})
IMAP.DataCluster = IMAP.Class(IMAP.Events, {
  initialize: function (a, b, c) {
    c = c || {}
    var d = {
      gridSize:
        "number" === typeof c.gridSize && 10 <= c.gridSize ? c.gridSize : 60,
      minimumClusterSize: c.minimumClusterSize || 2,
      maxZoom: c.maxZoom || 0,
      title: c.title || "",
      zoomOnClick: typeof ("boolean" == c.zoomOnClick) ? c.zoomOnClick : !0,
      averageCenter: !0,
      printable: c.printable || !1,
      batchSize: c.batchSize || 1e3,
    }
    c.styles
      ? (d.styles = c.styles)
      : ((c = IMAP.MapConfig.API_REALM_NAME + IMAP.MapConfig._MAP_CLUSTER_ICON),
        (d.styles = [
          {
            url: c + "1_1.png",
            height: 75,
            width: 75,
            anchor: [30, 0],
            textColor: "black",
            textSize: 10,
            maxSize: 1e3,
          },
          {
            url: c + "1_2.png",
            height: 75,
            width: 65,
            anchor: [25, 0],
            textColor: "black",
            textSize: 10,
            maxSize: 500,
          },
          {
            url: c + "1_3.png",
            height: 55,
            width: 55,
            anchor: [20, 0],
            textColor: "black",
            textSize: 10,
            maxSize: 100,
          },
          {
            url: c + "1_4.png",
            height: 45,
            width: 45,
            anchor: [15, 0],
            textColor: "black",
            textSize: 10,
            maxSize: 50,
          },
          {
            url: c + "1_5.png",
            height: 35,
            width: 35,
            anchor: [10, 0],
            textColor: "black",
            textSize: 10,
            maxSize: 10,
          },
        ]))
    IMAP.Events.prototype.initialize.apply(this, [])
    this._options = d
    this.markers_ = []
    this.clusters_ = []
    this.clusterListeners_ = []
    this.activeMap_ = a
    this._initConfig(b || [], a)
  },
  getOptions: function () {
    return this._options
  },
  getClusters: function () {
    return this.clusters_
  },
  getMarkers: function () {
    return this.markers_
  },
  refreshCluster: function () {
    this.repaint_(!0)
  },
  setZoomOnClick: function (a) {
    "boolean" == typeof a && (this._options.zoomOnClick = a)
  },
  getZoomOnClick: function () {
    return this._options.zoomOnClick
  },
  setAverageCenter: function (a, b) {
    "boolean" == typeof a &&
      ((this._options.averageCenter = a), b && this.repaint_(!0))
  },
  getAverageCenter: function () {
    return this._options.averageCenter
  },
  getStyles: function () {
    return this._options.styles
  },
  setStyles: function (a) {
    if (a instanceof Array) {
      var b = this.clusters_
      this._options.styles = a
      for (var c = 0, d = b.length; c < d; ++c) b[c].setStyles(a)
    }
  },
  getMaxZoom: function () {
    return this._options.maxZoom
  },
  setMaxZoom: function (a, b) {
    "number" == typeof a &&
      ((this._options.maxZoom = a), b && this.repaint_(!0))
  },
  getMinimumClusterSize: function () {
    return this._options.minimumClusterSize
  },
  setMinimumClusterSize: function (a, b) {
    "number" == typeof a &&
      ((this._options.minimumClusterSize = a), b && this.repaint_(!0))
  },
  setGridSize: function (a, b) {
    typeof ("number" === a) &&
      10 <= a &&
      ((this._options.gridSize = a), b && this.repaint_(!0))
  },
  getMap: function () {
    return this.activeMap_
  },
  getTitle: function () {
    return this._options.title
  },
  getGridSize: function () {
    return this._options.gridSize
  },
  clearMarkers: function () {
    this.resetViewport_(!0)
    this.markers_ = []
  },
  removeMarker: function (a, b) {
    var c = -1,
      d = this.markers_
    b = "undefined" == typeof b ? !0 : b
    var e = !0
    if (d.indexOf) c = d.indexOf(a)
    else
      for (var f = 0, h = d.length; f < h; ++f)
        if (a === d[f]) {
          c = f
          break
        }
    ;-1 === c
      ? (e = !1)
      : (a.getMap() && this.activeMap_.getOverlayLayer().removeOverlay(a),
        d.splice(c, 1))
    b && e && this.repaint_()
    return e
  },
  addMarker: function (a, b) {
    b = "undefined" == typeof b ? !0 : b
    a.isAdded = !1
    this.markers_.push(a)
    b && this.redraw_()
  },
  addMarkers: function (markers, b) {
    var oldMarkers = this.markers_,
      item
    b = "undefined" == typeof b ? !0 : b
    for (var index = 0, len = markers.length; index < len; ++index)
      (item = markers[index]), (item.isAdded = !1), oldMarkers.push(item)
    b && this.redraw_()
  },
  setMap: function (map) {
    map
      ? ((this.activeMap_ = map), this.onAdd_())
      : (this.onRemove_(),
        (this.clusterListeners_ = []),
        (this.clusters_ = []),
        (this.markers_ = []),
        (this.activeMap_ = null))
  },
  getExtendedBounds: function (a) {
    var map = this.activeMap_,
      gridSize = this._options.gridSize,
      d = b.lnglatToPixel(a.southwest)
    a = b.lnglatToPixel(a.northeast)
    d.x -= gridSize
    d.y += gridSize
    a.x += gridSize
    a.y -= gridSize
    return new IMAP.LngLatBounds(map.pixelToLnglat(d), map.pixelToLnglat(a))
  },
  removeCluster_: function () {
    for (var a = this.clusters_, b = 0, c = a.length; b < c; ++b) a[b].remove()
    this.clusters_ = []
  },
  _initConfig: function (markers, map) {
    var c = this.getOptions()
    c.calculator = c.calculator || this.calculator_
    this.listeners_ = []
    this.addMarkers(markers, !0)
    this.ready_ = !0
    this.setMap(map)
  },
  getPrintable: function () {
    return this.getOptions().printable
  },
  getCalculator: function () {
    return this.getOptions().calculator
  },
  triggerEvent: function (a, b, c) {
    if ((a = this.getListeners()[a]))
      for (var d = 0, e = a.length; d < e; ++d)
        a[d].func.apply(a[d].obj, [b, c])
  },
  resetViewport_: function (a) {
    var b,
      markers = this.getMarkers(),
      overlayLayer = this.getMap().getOverlayLayer()
    this.removeCluster_()
    for (var e = 0, f = markers.length; e < f; ++e)
      (b = markers[e]),
        a && b.getMap() && overlayLayer.removeOverlay(b),
        (b.isAdded = !1)
  },
  repaint_: function (a) {
    this.resetViewport_(a)
    this.redraw_()
  },
  redraw_: function () {
    this.bounds = this.getExtendedBounds(this.getMap().getBounds())
    //批量创建clusters
    this.createClusters_(0)
    //更新Icon 并且会拆分Clusters和添加marker,也会添加聚合删除marker;
    this.reSetPos_()
  },
  createClusters_: function (num) {
    //batchSize 批量创建 minNum -> batchSize为1000,大于1000就递归分批渲染,小于1000 就一次性渲染完成
    if (this.ready_) {
      for (
        var markers = this.getMarkers(),
          minNum = Math.min(num + this.getOptions().batchSize, markers.length),
          index = num;
        index < minNum;
        ++index
      )
        (item = markers[index]),
          !item.isAdded &&
            this.bounds.containsLngLat(item.getPosition()) &&
            this.addToClosestCluster_(item)
      minNum < markers.length && this.createClusters_(minNum)
    }
  },
  addToClosestCluster_: function (item) {
    for (
      var clustersItemCenter,
        clustersItem,
        d = 4e5,
        e = null,
        clusters = this.getClusters(),
        index = 0,
        clustersLength = clusters.length;
      index < clustersLength;
      ++index
    )
      if (
        ((clustersItem = clusters[index]),
        (clustersItemCenter = clustersItem.getCenter()))
      )
        (dis = IMAP.Function.distanceByLngLat(
          clustersItemCenter,
          item.getPosition()
        )),
          0 == index && (d = dis + 1),
          dis < d && ((d = dis), (e = clustersItem))
    e && e.isMarkerInClusterBounds(item)
      ? e.addMarker(item)
      : ((clustersItem = new IMAP.Cluster(this)),
        clustersItem.addMarker(item),
        clusters.push(clustersItem))
  },
  reSetPos_: function () {
    for (
      var clusters = this.getClusters(),
        index = 0,
        clustersLength = clusters.length;
      index < clusters;
      index++
    )
      clusters[index].updateIcon()
  },
  onAdd_: function () {
    var that = this,
      map = that.getMap()
    that.ready_ = !0
    that.repaint_()
    that.listeners_ = [
      map.addEventListener(
        IMAP.Constants.ZOOM_END,
        function (b) {
          that.repaint_(!0)
        },
        that
      ),
      map.addEventListener(
        IMAP.Constants.MOVE_END,
        function (b) {
          that.redraw_()
        },
        that
      ),
    ]
  },
  onRemove_: function () {
    var a = this.getMap(),
      b = this.listeners_
    this.resetViewport_(!0)
    for (var c = 0, d = b.length; c < d; ++c) a.removeEventListener(b[c])
    this.ready_ = !1
  },
  calculator_: function (markers, style, dataCluster) {
    for (
      var d = 1,
        e = 1,
        f = markers.length.toString(),
        h = 1e6,
        k = 1e6,
        l = !1,
        m = !1,
        g = 0;
      g < style.length;
      g++
    )
      style[g].maxSize &&
        "number" === typeof style[g].maxSize &&
        ((m = !0),
        1e6 == h && ((h = style[g].maxSize), (e = d = 1)),
        style[g].maxSize >= f && style[g].maxSize <= k
          ? ((k = style[g].maxSize), (l = !0), (e = g + 1))
          : style[g].maxSize >= h && ((h = style[g].maxSize), (d = g + 1)))
    return m
      ? ((e = l ? Math.min(e, style.length) : d),
        {
          text: f,
          index: e,
        })
      : dataCluster.calculator_old_(markers, style.length)
  },
  calculator_old_: function (markers, len) {
    for (var c = 0, d = markers.length.toString(), e = d; 0 !== e; )
      (e = parseInt(e / 10, 10)), c++
    c = Math.min(c, len)
    return {
      text: d,
      index: c,
    }
  },
})
