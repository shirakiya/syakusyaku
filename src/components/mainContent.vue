<template>
  <v-main>
    <v-container id="container" fluid>
      <v-row no-gutters>
        <v-col cols="12" md="2">
          <div class="left-pane">
            <v-container>
              <v-list>
                <v-list-subheader>
                  <v-form class="left-pane-form" @submit.prevent>
                    <v-snackbar
                      right
                      top
                      :timeout="-1"
                      :value="isPointSelectedPhase"
                    >
                      マップ上で中心地点を選択してください
                      <v-btn
                        icon
                        @click="closePointSelected"
                      >
                        <v-icon>
                          mdi-close
                        </v-icon>
                      </v-btn>
                    </v-snackbar>
                    <v-btn
                      color="secondary"
                      :disabled="isPointSelectedPhase"
                      @click="listenPointSelected"
                    >
                      <v-icon left>
                        mdi-plus
                      </v-icon>中心地点を追加する
                    </v-btn>
                  </v-form>
                </v-list-subheader>

                <v-divider v-if="points.length" />

                <template v-for="point in points">
                  <v-list-item-content
                    :key="point.n"
                    class="point-item-container"
                    @mouseenter="makeMarkerBounced(point.marker)"
                  >
                    <v-container>
                      <v-row no-gutters>
                        <v-col cols="3">
                          <v-icon large :color="getColorAlias(point.n)">
                            mdi-map-marker
                          </v-icon>
                        </v-col>
                        <v-col cols="9">
                          <v-form @submit.prevent>
                            <v-text-field
                              v-model="point.circle.radius"
                              label="半径 (m)"
                              append-icon="mdi-chevron-right"
                              :rules="radiusRule"
                              @keyup.enter="changeRadius(point.circle)"
                            />
                            <v-col class="point-item-action-row" align="end">
                              <v-btn
                                outlined
                                small
                                @click="changeRadius(point.circle)"
                              >
                                <v-icon>
                                  mdi-reload
                                </v-icon>
                              </v-btn>
                              <v-btn
                                outlined
                                small
                                color="error"
                                @click="removePoint(point)"
                              >
                                <v-icon>
                                  mdi-trash-can
                                </v-icon>
                              </v-btn>
                            </v-col>
                          </v-form>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-list-item-content>
                  <v-divider :key="point.n" />
                </template>
              </v-list>
            </v-container>
          </div>
        </v-col>
        <v-col cols="12" md="10">
          <div v-if="!map" class="text-center">
            <v-progress-circular
              :size="100"
              color="primary"
              indeterminate
            />
          </div>
          <div id="map" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import scriptjs from 'scriptjs'
import { getColorAliasByNum, getColorCodeByNum } from '../utils/materialColor.js'

export default {
  props: {
    initLat: {
      type: Number,
      default: 35.681,
    },
    initLng: {
      type: Number,
      default: 139.767,
    },
    zoom: {
      type: Number,
      default: 12,
    },
  },
  data() {
    return {
      map: null,
      // circle distance
      isPointSelectedPhase: false,
      mapPointedListener: null,
      points: [],
      pointsLength: 0,
      radiusRule: [
        v => (!!v && !!Number(v)) || '数値を入力してください',
      ],
    }
  },
  computed: {
  },
  beforeMount() {
    /* global GOOGLE_API_KEY */
    scriptjs(
      'https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_API_KEY + '&libraries=geometry',
      'loadGoogleMaps',
    )
    scriptjs.ready('loadGoogleMaps', this.loadMap)
  },
  methods: {
    loadMap() {
      /* global google */
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: this.zoom,
        center: {
          lat: this.initLat,
          lng: this.initLng,
        },
      })
    },
    zoomCenter(latLng) {
      this.map.setCenter(latLng)
    },
    removeMapObject(obj) {
      obj.setMap(null)
    },
    listenPointSelected() {
      this.isPointSelectedPhase = true

      this.mapPointedListener = new google.maps.event.addListenerOnce(this.map, 'click', e => {
        this.addPointFromLatLng(e.latLng)
      })
    },
    closePointSelected() {
      this.isPointSelectedPhase = false

      google.maps.event.removeListener(this.mapPointedListener)
      this.mapPointedListener = null
    },
    addPointFromLatLng(latLng) {
      const marker = new google.maps.Marker({
        map: this.map,
        position: latLng,
        draggable: true,
      })
      const circle = new google.maps.Circle({
        map: this.map,
        center: marker.getPosition(),
        radius: 3000,
        fillColor: getColorCodeByNum(this.pointsLength),
        fillOpacity: 0.35,
        strokeColor: getColorCodeByNum(this.pointsLength),
        strokeOpacity: 0.6,
        strokeWeight: 1,
      })
      circle.bindTo('center', marker, 'position')

      const point = {
        n: this.pointsLength,
        marker: marker,
        circle: circle,
      }
      this.points.push(point)
      this.pointsLength++

      this.isPointSelectedPhase = false
    },
    getColorAlias(num) {
      return getColorAliasByNum(num)
    },
    changeRadius(circle) {
      const radius = Number(circle.radius)
      if (radius) {
        circle.setRadius(radius)
      }
    },
    removePoint(point) {
      const targetIndex = this.points.indexOf(point)
      if (targetIndex < 0) return

      this.removeMapObject(point.marker)
      this.removeMapObject(point.circle)
      this.points.splice(targetIndex, 1)
    },
    makeMarkerBounced(marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE)
      window.setTimeout(() => {
        marker.setAnimation(null)
      }, 1400)
    },
  },
}
</script>

<style lang='sass' scoped>
// This height is a naive value.
// The header height and the footer height vary by window width.
$container-height: calc(100vh - 64px - 48px)  // 100vh - header - footer

#container
  padding: 0

.left-pane
  max-height: $container-height
  overflow-y: scroll

  .left-pane-form
    padding-bottom: 12px

.point-item-container
  padding-top: 0
  padding-bottom: 0

.point-item-action-row
  padding-top: 0
  padding-bottom: 0

#map
  width: 100%
  height: $container-height
</style>
