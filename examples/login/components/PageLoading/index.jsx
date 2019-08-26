import './index.styl';
import React from 'react';
import { Spin } from 'antd';

export default class PageLoading extends React.PureComponent {
  render() {
    return (
      <div className="page-loading">
        <Spin size="large" />
      </div>
    );
  }
}
