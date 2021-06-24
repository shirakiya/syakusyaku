import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store =  new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    isPointSelectedPhase: false,
    points: [],
    pointCount: 0,
  },
  getters: {
    isFirstVisit: () => !localStorage.getItem('visited'),
  },
  actions: {
    visited: () => localStorage.setItem('visited', true),

    movePointSelectionPhase: ({ commit }) => commit('movePointSelectionPhase'),
    releasePointSelectionPhase: ({ commit }) => commit('releasePointSelectionPhase'),

    addPoint(context) {
      const point = {
        n: context.state.pointCount, // As identifier
      }

      context.commit('addPoint', point)
    },
    removePoint(context, point) {
      context.commit('removePoint', point)
    }
  },
  mutations: {
    movePointSelectionPhase(state) {
      state.isPointSelectedPhase = true
    },
    releasePointSelectionPhase(state) {
      state.isPointSelectedPhase = false
    },

    addPoint(state, point) {
      state.points.push(point)
      state.pointCount++
    },
    removePoint(state, point) {
      state.points = state.points.filter(p => p.n !== point.n)
    }
  },
})
