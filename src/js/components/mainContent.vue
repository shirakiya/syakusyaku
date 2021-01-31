<template>
  <v-main>
    <error-notification
      :error="hasError"
    />
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 class="app-description">
          <introduction />
        </v-flex>
        <v-flex id="map-container" md8 xs12>
          <div v-if="!map" class="text-xs-center">
            <v-progress-circular
              :size="100"
              color="amber"
              indeterminate
            />
          </div>
          <div id="map" />
          <ad />
        </v-flex>
        <v-flex md4 xs12>
          <v-card>
            <v-card-text>
              <v-tabs fixed-tabs>
                <v-tab>
                  <v-icon>place</v-icon>距離円
                </v-tab>
                <v-tab>
                  <v-icon>compare_arrows</v-icon>二地点間距離
                </v-tab>
                <v-tab-item>
                  <div>
                    <v-form @submit.prevent>
                      <v-container fluid>
                        <v-snackbar
                          right
                          top
                          :timeout="-1"
                          :value="isPointSelectedPhase"
                        >
                          マップ上で中心地点を選択してください
                        </v-snackbar>
                        <v-btn
                          color="secondary"
                          :disabled="isPointSelectedPhase"
                          @click="listenPointSelected"
                        >
                          <v-icon>add</v-icon>追加
                        </v-btn>
                      </v-container>
                    </v-form>
                    <v-container fluid grid-list-xl>
                      <v-layout row wrap>
                        <v-flex
                          v-for="point in points"
                          :key="point.n"
                          xs12
                        >
                          <v-card @mouseenter="makeMarkerBounced(point.marker)">
                            <v-card-text>
                              <v-form @submit.prevent>
                                <v-layout align-center row wrap>
                                  <v-flex xs2>
                                    <v-icon
                                      large
                                      :color="getColorAlias(point.n)"
                                    >
                                      place
                                    </v-icon>
                                  </v-flex>
                                  <v-flex xs10>
                                    <v-text-field
                                      v-model="point.circle.radius"
                                      label="半径 (m)"
                                      append-icon="chevron_right"
                                      :rules="radiusRule"
                                      @keyup.enter="changeRadius(point.circle)"
                                    />
                                  </v-flex>
                                </v-layout>
                              </v-form>
                            </v-card-text>
                            <v-card-actions>
                              <v-btn
                                flat
                                @click="changeRadius(point.circle)"
                              >
                                更新
                              </v-btn>
                              <v-btn
                                color="error"
                                flat
                                @click="removePoint(point)"
                              >
                                削除
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                </v-tab-item>
                <v-tab-item>
                  <v-container>
                    <v-form
                      ref="directDistanceForm"
                      @submit.prevent
                    >
                      <v-text-field
                        v-model="searchAddress1"
                        label="住所1"
                      />
                      <v-text-field
                        v-model="searchAddress2"
                        label="住所2"
                      />
                      <v-btn
                        color="secondary"
                        @click="calcDistance"
                      >
                        決定
                      </v-btn>
                    </v-form>
                    <div
                      v-if="calcedSearchAddress1 && calcedSearchAddress2"
                      class="direct-distance-result-container"
                    >
                      <v-list subheader>
                        <v-list-tile
                          avatar
                          @click="makeMarkerBounced(marker1)"
                        >
                          <v-list-tile-avatar>
                            <v-icon
                              color="red"
                            >
                              place
                            </v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title
                              class="body-2"
                            >
                              {{ calcedSearchAddress1 }}
                            </v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile
                          avatar
                          @click="makeMarkerBounced(marker2)"
                        >
                          <v-list-tile-avatar>
                            <v-icon
                              color="red"
                            >
                              place
                            </v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title
                              class="body-2"
                            >
                              {{ calcedSearchAddress2 }}
                            </v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-content>
                            <v-list-tile-title>直線距離： <span class="font-weight-bold">{{ groupedDistance }} km</span></v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </div>
                  </v-container>
                </v-tab-item>
              </v-tabs>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import scriptjs from 'scriptjs'
import Ad from './ad.vue'
import ErrorNotification from './errorNotification.vue'
import Introduction from './introduction.vue'
import { getGeocoderResultFromAddresses } from '../utils/api.js'
import { getColorAliasByNum, getColorCodeByNum } from '../utils/materialColor.js'

export default {
  components: {
    Ad,
    ErrorNotification,
    Introduction,
  },
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
      default: 11,
    },
  },
  data() {
    return {
      map: null,
      hasError: false,
      // circle distance
      isPointSelectedPhase: false,
      points: [],
      pointsLength: 0,
      radiusRule: [
        v => (!!v && !!Number(v)) || '数値を入力してください',
      ],
      // direct distance
      searchAddress1: '',
      searchAddress2: '',
      calcedSearchAddress1: null,
      calcedSearchAddress2: null,
      calcedDistance: null,
      marker1: null,
      marker2: null,
      poly: null,
    }
  },
  computed: {
    groupedDistance() {
      // m -> km に変換, 3桁区切りでカンマを入れる
      return (this.calcedDistance / 1000).toFixed(3)
    },
  },
  beforeMount() {
    scriptjs(
      'https://maps.googleapis.com/maps/api/js?key=' + process.env.GOOGLE_API_KEY + '&libraries=geometry',
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

      new google.maps.event.addListenerOnce(this.map, 'click', e => {
        this.addPointFromLatLng(e.latLng)
      })
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
    calcDistance() {
      getGeocoderResultFromAddresses([this.searchAddress1, this.searchAddress2])
        .then(geocoderResults => {
          if (this.marker1) this.removeMapObject(this.marker1)
          if (this.marker2) this.removeMapObject(this.marker2)
          if (this.poly) this.removeMapObject(this.poly)

          const fromGeocoder = geocoderResults[0]
          this.calcedSearchAddress1 = fromGeocoder.formatted_address
          const fromLatLng = new google.maps.LatLng(fromGeocoder.lat, fromGeocoder.lng)

          const toGeocoder = geocoderResults[1]
          this.calcedSearchAddress2 = toGeocoder.formatted_address
          const toLatLng = new google.maps.LatLng(toGeocoder.lat, toGeocoder.lng)

          this.calcedDistance = google.maps.geometry.spherical.computeDistanceBetween(fromLatLng, toLatLng)

          this.marker1 = new google.maps.Marker({
            map: this.map,
            position: fromLatLng,
          })
          this.marker2 = new google.maps.Marker({
            map: this.map,
            position: toLatLng,
          })
          this.poly = new google.maps.Polyline({
            map: this.map,
            path: [ fromLatLng, toLatLng ],
            strokeColor: '#424242',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          })
          this.zoomCenter(fromLatLng)
        })
        .catch(err => {
          this.hasError = true
          console.error(err)
        })
    },
  },
}
</script>

<style lang='sass' scoped>
#map-container
  padding-right: 20px
  margin-bottom: 10px

#map
  width: 100%
  height: 500px

.app-description
  margin-bottom: 15px

.direct-distance-result-container
  padding-top: 20px
</style>
