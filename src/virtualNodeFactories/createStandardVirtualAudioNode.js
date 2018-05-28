import {capitalize, equals, filter, find, forEach, get, set} from '../utils'
import {
  audioParamProperties,
  constructorParamsKeys,
  setters,
  startAndStopNodes,
} from '../data'

const connect = function (...connectArgs) {
  const {audioNode} = this
  const filteredConnectArgs = filter(Boolean, connectArgs)
  audioNode.connect && audioNode.connect(...filteredConnectArgs)
  this.connections = this.connections.concat(filteredConnectArgs)
  this.connected = true
}

const createAudioNode = (audioContext, name, constructorParam, {offsetTime, startTime, stopTime}) => {
  offsetTime = offsetTime || 0
  const audioNode = constructorParam
    ? audioContext[`create${capitalize(name)}`](constructorParam)
    : audioContext[`create${capitalize(name)}`]()
  if (startAndStopNodes.indexOf(name) !== -1) {
    if (startTime == null) audioNode.start(audioContext.currentTime, offsetTime); else audioNode.start(startTime, offsetTime)
    if (stopTime != null) audioNode.stop(stopTime)
  }
  return audioNode
}

const disconnect = function (node) {
  const {audioNode} = this
  if (node) {
    if (node.isCustomVirtualNode) {
      forEach(key => {
        const childNode = node.virtualNodes[key]
        if (!this.connections.some(x => x === childNode.audioNode)) return
        this.connections = filter(
          x => x !== childNode.audioNode,
          this.connections
        )
      }, Object.keys(node.virtualNodes))
    } else {
      if (!this.connections.some(x => x === node.audioNode)) return
      this.connections = filter(x => x !== node.audioNode, this.connections)
    }
  }
  audioNode.disconnect && audioNode.disconnect()
  this.connected = false
}

const disconnectAndDestroy = function () {
  const {audioNode, stopCalled} = this
  if (audioNode.stop && !stopCalled) audioNode.stop()
  audioNode.disconnect && audioNode.disconnect()
  this.connected = false
}

const update = function (params = {}) {
  forEach(key => {
    if (constructorParamsKeys.indexOf(key) !== -1) return
    const param = params[key]
    if (this.params && this.params[key] === param) return
    if (audioParamProperties.indexOf(key) !== -1) {
      if (Array.isArray(param)) {
        if ((param[0] !== 'setValueCurveAtTime') &&
          (this.params && equals(param, this.params[key]))) {
          return
        } else {
          get(this.audioNode, key).cancelScheduledValues(0)
        }
        const callMethod = ([methodName, ...args]) => get(this.audioNode, key)[methodName](...args)
        Array.isArray(param[0]) ? forEach(callMethod, param) : callMethod(param)
        return
      }
      get(this.audioNode, key).value = param
      return
    }
    if (setters.indexOf(key) !== -1) {
      this.audioNode[`set${capitalize(key)}`](...param)
      return
    }
    set(this.audioNode, key, param)
  }, Object.keys(params))
  this.params = params
  return this
}

export default (audioContext, [node, output, params, input]) => {
  const paramsObj = params || {}
  const {offsetTime, startTime, stopTime} = paramsObj
  const constructorParam = paramsObj[find(key => constructorParamsKeys.indexOf(key) !== -1, Object.keys(paramsObj))]
  const virtualNode = {
    audioNode: createAudioNode(audioContext, node, constructorParam, {offsetTime, startTime, stopTime}),
    connect,
    connected: false,
    connections: [],
    disconnect,
    disconnectAndDestroy,
    input,
    isCustomVirtualNode: false,
    node,
    output,
    stopCalled: stopTime !== undefined,
    update,
  }
  return virtualNode.update(paramsObj)
}
