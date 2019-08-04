import React from 'react';
import { Router, Redirect } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { eachModule } from './utils/module-util';
import history from './history';

// 模拟校验
function isLogged() {
  return document.cookie.indexOf('TMD_SESSIONID=') > -1;
}

const routes = [];
eachModule(require.context('./routes', false, /^\.\/.+\.js$/), (model) => {
  const parts = model();
  parts.forEach((route) => {
    route.key = route.key || route.path;
    // 默认每个页面需要登录才能打开
    if (route.loginRequired !== false) {
      const { component: Cmp, render } = route;
      if (render) {
        route.render = props =>
          isLogged()
            ? render(props)
            : (<Redirect to="/login" />)
      } else if (Cmp) {
        route.render = props =>
          isLogged()
            ? (<Cmp {...props} />)
            : (<Redirect to="/login" />)
      } else {
        throw new TypeError('Property component or render must be required in route config');
      }
    }
    routes[routes.length] = route;
  });
});

export default function () {
  return (
    <Router history={history}>
      {renderRoutes(routes)}
    </Router>
  );
};
