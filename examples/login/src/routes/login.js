import dynamicImport from '../utils/dynamic-import';

export default function () {
  return [{
    path: '/login',
    exact: true,
    loginRequired: false,
    component: dynamicImport(import('../views/login'))
  }];
}
