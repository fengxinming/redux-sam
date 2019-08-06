import React from 'react';
import { Router, Redirect } from 'react-router';
import { renderRoutes } from 'react-router-config';
import history from './history';
import home from './routes/home';
import login from './routes/login';

// 模拟校验
function isLogged() {
  return document.cookie.indexOf('TMD_SESSIONID=') > -1;
}

const routes = [].concat(home(), login()).map((route) => {
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
  return route;
});

export default function () {
  return (
    <Router history={history}>
      {renderRoutes(routes)}
    </Router>
  );
};
