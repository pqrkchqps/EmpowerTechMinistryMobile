/**
 * @format
 */
import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import {App} from './App.js';
import {name as appName} from './app.json';
import {RouteProvider} from './components/RouteContext.js';
import {CommentProvider} from './components/CommentContext.js';
import {ThreadProvider} from './components/ThreadContext.js';
import {ArticleProvider} from './components/ArticleContext.js';
import {ErrorProvider} from './components/ErrorContext.js';
import {AxiosComponent} from './utils/axios.js';
function Index() {
  return (
    <ErrorProvider>
      <AxiosComponent>
        <ArticleProvider>
          <ThreadProvider>
            <CommentProvider>
              <RouteProvider>
                <App />
              </RouteProvider>
            </CommentProvider>
          </ThreadProvider>
        </ArticleProvider>
      </AxiosComponent>
    </ErrorProvider>
  );
}
AppRegistry.registerComponent(appName, () => Index);
