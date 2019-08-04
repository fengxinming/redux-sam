import React from 'react';
import loadable from '@loadable/component';
import PageLoading from '../components/PageLoading';

export default function (promise) {
  const LoadableComponent = loadable(() => promise, {
    fallback: <PageLoading />
  });

  class Loadable extends React.Component {
    render() {
      return <LoadableComponent />;
    }
  }

  return Loadable;
};
