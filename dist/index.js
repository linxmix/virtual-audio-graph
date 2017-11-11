'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};









































var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();











var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var capitalize = function capitalize(a) {
  return a.charAt(0).toUpperCase() + a.substring(1);
};
var equals = function equals(a, b) {
  if (a === b) return true;
  var typeA = typeof a === 'undefined' ? 'undefined' : _typeof(a);
  if (typeA !== (typeof b === 'undefined' ? 'undefined' : _typeof(b)) || typeA !== 'object') return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!equals(a[i], b[i])) return false;
    }return true;
  }
  var keysA = Object.keys(a);
  var keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  if (keysA.length > 1000) return false;
  for (var _i = 0; _i < keysA.length; _i++) {
    var key = keysA[_i];
    if (!equals(a[key], b[key])) return false;
  }
  return true;
};
var forEach = function forEach(f, xs) {
  for (var i = 0; i < xs.length; i++) {
    f(xs[i]);
  }
};
var filter = function filter(f, xs) {
  var ys = [];
  for (var i = 0; i < xs.length; i++) {
    f(xs[i]) && ys.push(xs[i]);
  }return ys;
};
var find = function find(f, xs) {
  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i])) return xs[i];
  }
};
var mapObj = function mapObj(f, o) {
  var p = {};
  for (var key in o) {
    if (Object.prototype.hasOwnProperty.call(o, key)) p[key] = f(o[key]);
  }return p;
};
var values = function values(obj) {
  var keys = Object.keys(obj);
  var ret = [];
  for (var i = 0; i < keys.length; i++) {
    ret[i] = obj[keys[i]];
  }return ret;
};

var get = function get(object, keys, defaultVal) {
  keys = Array.isArray(keys) ? keys : keys.split('.');
  object = object[keys[0]];
  if (object && keys.length > 1) {
    return get(object, keys.slice(1), defaultVal);
  }
  return object === undefined ? defaultVal : object;
};

var set = function set(object, keys, val) {
  keys = Array.isArray(keys) ? keys : keys.split('.');
  if (keys.length > 1) {
    object[keys[0]] = object[keys[0]] || {};
    return set(object[keys[0]], keys.slice(1), val);
  }
  object[keys[0]] = val;
};

var connectAudioNodes = (function (virtualGraph) {
  var handleConnectionToOutput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  return forEach(function (id) {
    var virtualNode = virtualGraph[id];
    var output = virtualNode.output;

    if (virtualNode.connected || output == null) return;
    forEach(function (output) {
      if (output === 'output') return handleConnectionToOutput(virtualNode);

      if (Object.prototype.toString.call(output) === '[object Object]') {
        var key = output.key,
            destination = output.destination,
            inputs = output.inputs,
            outputs = output.outputs;


        if (key == null) {
          throw new Error('id: ' + id + ' - output object requires a key property');
        }
        if (inputs) {
          if (inputs.length !== outputs.length) {
            throw new Error('id: ' + id + ' - outputs and inputs arrays are not the same length');
          }
          return forEach(function (input, i) {
            return virtualNode.connect(virtualGraph[key].audioNode, outputs[i], input);
          }, inputs);
        }
        return virtualNode.connect(virtualGraph[key].audioNode[destination]);
      }

      var destinationVirtualAudioNode = virtualGraph[output];

      if (destinationVirtualAudioNode.isCustomVirtualNode) {
        return forEach(function (node) {
          return node.input === 'input' && virtualNode.connect(node.audioNode);
        }, values(destinationVirtualAudioNode.virtualNodes));
      }

      virtualNode.connect(destinationVirtualAudioNode.audioNode);
    }, Array.isArray(output) ? output : [output]);
  }, Object.keys(virtualGraph));
});

var audioParamProperties = ['attack', 'delayTime', 'detune', 'frequency', 'gain', 'knee', 'pan', 'playbackRate', 'ratio', 'reduction', 'release', 'threshold', 'Q',

// tuna delay node properties
'wet.gain', // wet level
'filter.frequency', // cutoff
'delay.delayTime', // delayTime
'feedbackNode.gain', // feedback

// soundtouch node properties
'time', 'tempo', 'pitch'];

var constructorParamsKeys = ['maxDelayTime', 'mediaElement', 'mediaStream', 'numberOfOutputs'];

var setters = ['position', 'orientation'];

var startAndStopNodes = ['oscillator', 'bufferSource', 'soundtouchSource'];

var connect = function connect() {
  var audioNode = this.audioNode;

  for (var _len = arguments.length, connectArgs = Array(_len), _key = 0; _key < _len; _key++) {
    connectArgs[_key] = arguments[_key];
  }

  var filteredConnectArgs = filter(Boolean, connectArgs);
  audioNode.connect && audioNode.connect.apply(audioNode, toConsumableArray(filteredConnectArgs));
  this.connections = this.connections.concat(filteredConnectArgs);
  this.connected = true;
};

var createAudioNode = function createAudioNode(audioContext, name, constructorParam, _ref) {
  var offsetTime = _ref.offsetTime,
      startTime = _ref.startTime,
      stopTime = _ref.stopTime;

  offsetTime = offsetTime || 0;
  var audioNode = constructorParam ? audioContext['create' + capitalize(name)](constructorParam) : audioContext['create' + capitalize(name)]();
  if (startAndStopNodes.indexOf(name) !== -1) {
    if (startTime == null) audioNode.start(audioContext.currentTime, offsetTime);else audioNode.start(startTime, offsetTime);
    if (stopTime != null) audioNode.stop(stopTime);
  }
  return audioNode;
};

var disconnect = function disconnect(node) {
  var _this = this;

  var audioNode = this.audioNode;

  if (node) {
    if (node.isCustomVirtualNode) {
      forEach(function (key) {
        var childNode = node.virtualNodes[key];
        if (!_this.connections.some(function (x) {
          return x === childNode.audioNode;
        })) return;
        _this.connections = filter(function (x) {
          return x !== childNode.audioNode;
        }, _this.connections);
      }, Object.keys(node.virtualNodes));
    } else {
      if (!this.connections.some(function (x) {
        return x === node.audioNode;
      })) return;
      this.connections = filter(function (x) {
        return x !== node.audioNode;
      }, this.connections);
    }
  }
  audioNode.disconnect && audioNode.disconnect();
  this.connected = false;
};

var disconnectAndDestroy = function disconnectAndDestroy() {
  var audioNode = this.audioNode,
      stopCalled = this.stopCalled;

  if (audioNode.stop && !stopCalled) audioNode.stop();
  audioNode.disconnect && audioNode.disconnect();
  this.connected = false;
};

var update = function update() {
  var _this2 = this;

  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  forEach(function (key) {
    if (constructorParamsKeys.indexOf(key) !== -1) return;
    var param = params[key];
    if (_this2.params && _this2.params[key] === param) return;
    if (audioParamProperties.indexOf(key) !== -1) {
      if (Array.isArray(param)) {
        if (_this2.params && equals(param, _this2.params[key], { strict: true })) {
          return;
        } else {
          get(_this2.audioNode, key).cancelScheduledValues(0);
        }
        var callMethod = function callMethod(_ref2) {
          var _get;

          var _ref3 = toArray(_ref2),
              methodName = _ref3[0],
              args = _ref3.slice(1);

          return (_get = get(_this2.audioNode, key))[methodName].apply(_get, toConsumableArray(args));
        };
        Array.isArray(param[0]) ? forEach(callMethod, param) : callMethod(param);
        return;
      }
      get(_this2.audioNode, key).value = param;
      return;
    }
    if (setters.indexOf(key) !== -1) {
      var _audioNode;

      (_audioNode = _this2.audioNode)['set' + capitalize(key)].apply(_audioNode, toConsumableArray(param));
      return;
    }
    set(_this2.audioNode, key, param);
  }, Object.keys(params));
  this.params = params;
  return this;
};

var createStandardVirtualAudioNode = (function (audioContext, _ref4) {
  var _ref5 = slicedToArray(_ref4, 4),
      node = _ref5[0],
      output = _ref5[1],
      params = _ref5[2],
      input = _ref5[3];

  var paramsObj = params || {};
  var offsetTime = paramsObj.offsetTime,
      startTime = paramsObj.startTime,
      stopTime = paramsObj.stopTime;

  var constructorParam = paramsObj[find(function (key) {
    return constructorParamsKeys.indexOf(key) !== -1;
  }, Object.keys(paramsObj))];
  var virtualNode = {
    audioNode: createAudioNode(audioContext, node, constructorParam, { offsetTime: offsetTime, startTime: startTime, stopTime: stopTime }),
    connect: connect,
    connected: false,
    connections: [],
    disconnect: disconnect,
    disconnectAndDestroy: disconnectAndDestroy,
    input: input,
    isCustomVirtualNode: false,
    node: node,
    output: output,
    stopCalled: stopTime !== undefined,
    update: update
  };
  return virtualNode.update(paramsObj);
});

var connect$1 = function connect() {
  for (var _len = arguments.length, connectArgs = Array(_len), _key = 0; _key < _len; _key++) {
    connectArgs[_key] = arguments[_key];
  }

  forEach(function (childVirtualNode) {
    var output = childVirtualNode.output;

    if (output === 'output' || Array.isArray(output) && output.indexOf('output') !== -1) childVirtualNode.connect.apply(childVirtualNode, toConsumableArray(filter(Boolean, connectArgs)));
  }, values(this.virtualNodes));
  this.connected = true;
};

var disconnect$1 = function disconnect() {
  var keys = Object.keys(this.virtualNodes);
  for (var i = 0; i < keys.length; i++) {
    var virtualNode = this.virtualNodes[keys[i]];
    var output = virtualNode.output;

    if (output === 'output' || Array.isArray(output) && output.indexOf('output') !== -1) virtualNode.disconnect();
  }
  this.connected = false;
};

var disconnectAndDestroy$1 = function disconnectAndDestroy() {
  var keys = Object.keys(this.virtualNodes);
  for (var i = 0; i < keys.length; i++) {
    this.virtualNodes[keys[i]].disconnectAndDestroy();
  }this.connected = false;
};

var update$1 = function update() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var audioGraphParamsFactoryValues = values(this.node(params));
  var keys = Object.keys(this.virtualNodes);
  for (var i = 0; i < keys.length; i++) {
    this.virtualNodes[keys[i]].update(audioGraphParamsFactoryValues[i][2]);
  }
  this.params = params;
  return this;
};

var createCustomVirtualAudioNode = function createCustomVirtualAudioNode(audioContext, _ref) {
  var _ref2 = slicedToArray(_ref, 3),
      node = _ref2[0],
      output = _ref2[1],
      params = _ref2[2];

  var virtualNodes = mapObj(function (virtualAudioNodeParam) {
    return createVirtualAudioNode(audioContext, virtualAudioNodeParam);
  }, node(params));

  connectAudioNodes(virtualNodes);

  return {
    connect: connect$1,
    connected: false,
    disconnect: disconnect$1,
    disconnectAndDestroy: disconnectAndDestroy$1,
    isCustomVirtualNode: true,
    node: node,
    output: output,
    params: params || {},
    update: update$1,
    virtualNodes: virtualNodes
  };
};

var createVirtualAudioNode = (function (audioContext, virtualAudioNodeParam) {
  return typeof virtualAudioNodeParam[0] === 'function' ? createCustomVirtualAudioNode(audioContext, virtualAudioNodeParam) : createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam);
});

/* global AudioContext */
var disconnectParents = function disconnectParents(virtualNode, virtualNodes) {
  return forEach(function (key) {
    return virtualNodes[key].disconnect(virtualNode);
  }, Object.keys(virtualNodes));
};

var index = (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$audioContext = _ref.audioContext,
      audioContext = _ref$audioContext === undefined ? new AudioContext() : _ref$audioContext,
      _ref$output = _ref.output,
      output = _ref$output === undefined ? audioContext.destination : _ref$output;

  return {
    audioContext: audioContext,
    get currentTime() {
      return audioContext.currentTime;
    },
    getAudioNodeById: function getAudioNodeById(id) {
      return this.virtualNodes[id].audioNode;
    },
    update: function update(newGraph) {
      var _this = this;

      forEach(function (id) {
        if (newGraph.hasOwnProperty(id)) return;
        var virtualAudioNode = _this.virtualNodes[id];
        virtualAudioNode.disconnectAndDestroy();
        disconnectParents(virtualAudioNode, _this.virtualNodes);
        delete _this.virtualNodes[id];
      }, Object.keys(this.virtualNodes));

      forEach(function (key) {
        if (key === 'output') throw new Error('"output" is not a valid id');
        var newNodeParams = newGraph[key];

        var _newNodeParams = slicedToArray(newNodeParams, 3),
            paramsNodeName = _newNodeParams[0],
            paramsOutput = _newNodeParams[1],
            paramsParams = _newNodeParams[2];

        if (paramsOutput == null && paramsNodeName !== 'mediaStreamDestination') {
          throw new Error('output not specified for node key ' + key);
        }
        var virtualAudioNode = _this.virtualNodes[key];
        if (virtualAudioNode == null) {
          _this.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
          return;
        }
        if ((paramsParams && paramsParams.startTime) !== (virtualAudioNode.params && virtualAudioNode.params.startTime) || (paramsParams && paramsParams.stopTime) !== (virtualAudioNode.params && virtualAudioNode.params.stopTime) || paramsNodeName !== virtualAudioNode.node) {
          virtualAudioNode.disconnectAndDestroy();
          disconnectParents(virtualAudioNode, _this.virtualNodes);
          _this.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
          return;
        }
        if (!equals(paramsOutput, virtualAudioNode.output)) {
          virtualAudioNode.disconnect();
          disconnectParents(virtualAudioNode, _this.virtualNodes);
          virtualAudioNode.output = paramsOutput;
        }

        virtualAudioNode.update(paramsParams);
      }, Object.keys(newGraph));

      connectAudioNodes(this.virtualNodes, function (virtualNode) {
        return virtualNode.connect(output);
      });

      return this;
    },

    virtualNodes: {}
  };
});

module.exports = index;
