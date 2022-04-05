/* eslint-disable vue/singleline-html-element-content-newline */
<template>
  <v-main>
    <v-container
      id="container"
      fluid
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          md="2"
        >
          <div class="left-pane">
            <v-container>
              <v-list>
                <v-list-subheader>
                  <v-form
                    class="left-pane-form"
                    @submit.prevent
                  >
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
                        <v-icon> mdi-close </v-icon>
                      </v-btn>
                    </v-snackbar>
                    <v-btn
                      color="secondary"
                      :disabled="isPointSelectedPhase"
                      @click="listenPointSelected"
                    >
                      <v-icon left> mdi-plus </v-icon>中心地点を追加する
                    </v-btn>
                  </v-form>
                </v-list-subheader>

                <v-divider v-if="isPointPresent" />

                <template v-for="point in points">
                  <v-list-item-content
                    :key="point.n"
                    class="point-item-container"
                    @mouseenter="makeMarkerBounced(mapObjects[point.n].marker)"
                  >
                    <v-container>
                      <v-row no-gutters>
                        <v-col cols="3">
                          <v-icon
                            large
                            :color="getColorAlias(point.n)"
                          >
                            mdi-map-marker
                          </v-icon>
                        </v-col>
                        <v-col cols="9">
                          <v-form @submit.prevent>
                            <v-text-field
                              v-model="mapObjects[point.n].circle.radius"
                              label="半径 (m)"
                              append-icon="mdi-chevron-right"
                              :rules="radiusRule"
                              @keyup.enter="
                                changeRadius(mapObjects[point.n].circle)
                              "
                            />
                            <v-col
                              class="point-item-action-row"
                              align="end"
                            >
                              <v-btn
                                outlined
                                small
                                @click="changeRadius(point.circle)"
                              >
                                <v-icon> mdi-reload </v-icon>
                              </v-btn>
                              <v-btn
                                outlined
                                small
                                color="error"
                                @click="removePoint(point)"
                              >
                                <v-icon> mdi-trash-can </v-icon>
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
        <v-col
          cols="12"
          md="10"
        >
          <div
            v-if="!map"
            class="text-center"
          >
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
/* global GOOGLE_API_KEY, google */
import scriptjs from 'scriptjs'
import {
  getColorAliasByNum,
  getColorCodeByNum,
} from '../utils/materialColor.js'

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
      mapPointedListener: null,
      mapObjects: {},
    }
  },
  computed: {
    radiusRule: () => [(v) => (!!v && !!Number(v)) || '数値を入力してください'],

    isPointSelectedPhase() {
      return this.$store.state.isPointSelectedPhase
    },

    points() {
      return this.$store.state.points
    },
    isPointPresent() {
      return this.points.length > 0
    },
  },
  beforeMount() {
    scriptjs(
      'https://maps.googleapis.com/maps/api/js?key=' +
        GOOGLE_API_KEY +
        '&libraries=geometry',
      'loadGoogleMaps',
    )
    scriptjs.ready('loadGoogleMaps', this.loadMap)
  },
  methods: {
    loadMap() {
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: this.zoom,
        center: {
          lat: this.initLat,
          lng: this.initLng,
        },
      })
    },
    removeMapObject(obj) {
      obj.setMap(null)
    },
    listenPointSelected() {
      this.$store.dispatch('movePointSelectionPhase')

      this.mapPointedListener = new google.maps.event.addListenerOnce(
        this.map,
        'click',
        (e) => {
          this.addPointFromLatLng(e.latLng)
        },
      )
    },
    closePointSelected() {
      this.$store.dispatch('releasePointSelectionPhase')

      google.maps.event.removeListener(this.mapPointedListener)
      this.mapPointedListener = null
    },
    addPointFromLatLng(latLng) {
      const pointCount = this.$store.state.pointCount

      const marker = new google.maps.Marker({
        map: this.map,
        position: latLng,
        draggable: true,
      })
      const circle = new google.maps.Circle({
        map: this.map,
        center: marker.getPosition(),
        radius: 3000,
        fillColor: getColorCodeByNum(pointCount),
        fillOpacity: 0.35,
        strokeColor: getColorCodeByNum(pointCount),
        strokeOpacity: 0.6,
        strokeWeight: 1,
      })
      circle.bindTo('center', marker, 'position')

      this.mapObjects[pointCount] = {
        marker,
        circle,
      }
      this.$store.dispatch('addPoint')
      this.$store.dispatch('releasePointSelectionPhase')
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
      const mapObject = this.mapObjects[point.n]

      this.removeMapObject(mapObject.marker)
      this.removeMapObject(mapObject.circle)

      this.$store.dispatch('removePoint', point)
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

<style
  lang="sass"
  scoped
>
// This height is a naive value.
// The header height and the footer height vary by window width.
$container-height: calc(100vh - 64px - 48px) // 100vh - header - footer

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
