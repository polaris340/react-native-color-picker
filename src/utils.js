import tinycolor from 'tinycolor2'
import { PanResponder, Platform } from 'react-native'

/**
 * Converts color to hsv representation.
 * @param {string} color any color represenation - name, hexa, rgb
 * @return {object} { h: number, s: number, v: number } object literal
 */
export function toHsv(color) {
  return tinycolor(color).toHsv()
}

/**
 * Converts hsv object to hexa color string.
 * @param {object} hsv { h: number, s: number, v: number } object literal
 * @return {string} color in hexa representation
 */
export function fromHsv(hsv) {
  return tinycolor(hsv).toHexString()
}

const fn = () => true;

const evtStateToCoords = (evt, state) => {
  return {
    x: evt.nativeEvent.locationX + (Platform.OS === 'android' ? state.dx : 0),
    y: evt.nativeEvent.locationY + (Platform.OS === 'android' ? state.dy : 0)
  }
};
/**
 * Simplified pan responder wrapper.
 */
export function createPanResponder({ onStart = fn, onMove = fn, onEnd = fn }) {
  return PanResponder.create({
    onStartShouldSetPanResponder: fn,
    onStartShouldSetPanResponderCapture: fn,
    onMoveShouldSetPanResponder: fn,
    onMoveShouldSetPanResponderCapture: fn,
    onPanResponderTerminationRequest: fn,
    onPanResponderGrant: (evt, state) => {
      return onStart(evtStateToCoords(evt, state), evt, state)
    },
    onPanResponderMove: (evt, state) => {
      return onMove(evtStateToCoords(evt, state), evt, state)
    },
    onPanResponderRelease: (evt, state) => {
      return onEnd(evtStateToCoords(evt, state), evt, state)
    },
  })
}

/**
 * Rotates point around given center in 2d.
 * Point is object literal { x: number, y: number }
 * @param {point} point to be rotated
 * @param {number} angle in radians
 * @param {point} center to be rotated around
 * @return {point} rotated point
 */
export function rotatePoint(point, angle, center = { x: 0, y: 0 }) {
  // translation to origin
  const transOriginX = point.x - center.x
  const transOriginY = point.y - center.y

  // rotation around origin
  const rotatedX = transOriginX * Math.cos(angle) - transOriginY * Math.sin(angle)
  const rotatedY = transOriginY * Math.cos(angle) + transOriginX * Math.sin(angle)

  // translate back from origin
  const normalizedX = rotatedX + center.x
  const normalizedY = rotatedY + center.y
  return {
    x: normalizedX,
    y: normalizedY,
  }
}
