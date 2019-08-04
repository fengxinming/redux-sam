import dynamicImport from '../utils/dynamic-import';

export default function () {
  return [{
    path: '/',
    exact: true,
    component: dynamicImport(import('../views/home'))
  }];
}
