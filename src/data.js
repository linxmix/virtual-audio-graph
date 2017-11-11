export const audioParamProperties = [
  'attack',
  'delayTime',
  'detune',
  'frequency',
  'gain',
  'knee',
  'pan',
  'playbackRate',
  'ratio',
  'reduction',
  'release',
  'threshold',
  'Q',

  // tuna delay node properties
  'wet.gain', // wet level
  'filter.frequency', // cutoff
  'delay.delayTime', // delayTime
  'feedbackNode.gain', // feedback

  // soundtouch node properties
  'time',
  'tempo',
  'pitch',
]

export const constructorParamsKeys = [
  'maxDelayTime',
  'mediaElement',
  'mediaStream',
  'numberOfOutputs',
]

export const setters = [
  'position',
  'orientation',
]

export const startAndStopNodes = [
  'oscillator',
  'bufferSource',
  'soundtouchSource',
]
