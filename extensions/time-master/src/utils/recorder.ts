import { Recorder } from '@appworks/recorder';

// eslint-disable-next-line
const { name, version } = require('../../package.json');

const recorder = new Recorder(name, version);

export default recorder;
