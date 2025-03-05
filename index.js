/**
 * @format
 */
import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import {App} from './App.js';
import {name as appName} from './app.json';
import { RouteProvider } from './components/RouteContext.js';
import { CommentProvider } from './components/CommentContext.js';
import { ThreadProvider } from './components/ThreadContext.js';
function Index() {
    return (
        <ThreadProvider>
            <CommentProvider>
                <RouteProvider>
                    <App/>
                </RouteProvider>
            </CommentProvider>
        </ThreadProvider>
    )
}
AppRegistry.registerComponent(appName, () => Index);
