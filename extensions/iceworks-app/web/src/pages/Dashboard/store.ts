import { createStore } from 'ice';
import info from './models/info';
import coreDependencies from './models/coreDependencies';
import componentDependencies from './models/componentDependencies';
import pluginDependencies from './models/pluginDependencies';

const store = createStore({ info, coreDependencies, componentDependencies, pluginDependencies });

export default store;
