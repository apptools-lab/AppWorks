import { createStore } from 'ice';
import info from './models/info';
import coreDependencies from './models/coreDependencies';
import componentDependencies from './models/componentDependencies';
import pluginDependencies from './models/pluginDependencies';
import doctor from './models/doctor';

const store = createStore({ info, coreDependencies, componentDependencies, pluginDependencies, doctor });

export default store;
