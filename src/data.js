export const audioParamProperties = [
  'attack',
  'delayTime',
  'detune',
  'frequency',
  'gain',
  'tempo',
  'time',
  'pitch',
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
