/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {App} from './App.js';
import {name as appName} from './app.json';
import { RouteProvider } from './components/RouteContext.js';
function Index() {
    return (
        <RouteProvider><App/></RouteProvider>
    )
}
AppRegistry.registerComponent(appName, () => Index);
