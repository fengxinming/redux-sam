import React, { Component } from 'react';
import map from 'celia/map';
import Thread from '../Thread';
import { getUnreadCount, getCurrentThread } from '../../store/getter';
import { connect } from 'react-redux';

class ThreadSection extends Component {
  constructor(props) {
    super(props);
    this.$mapActions(['switchThread']);
  }

  render() {
    const { threads, currentThreadID } = this.props;
    const unreadCount = getUnreadCount(threads);
    const currentThread = getCurrentThread(threads, currentThreadID);

    return (
      <div className="thread-section">
        <div className="thread-count">
          <span style={{ display: unreadCount ? 'inline' : '' }}>
            未读消息窗口: {unreadCount}
          </span>
        </div>
        <ul className="thread-list">
          {
            map(threads, (thread) => (
              <Thread
                key={thread.id}
                thread={thread}
                active={thread.id === currentThread.id}
                switchThread={this.switchThread}>
              </Thread>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default connect(state => ({
  threads: state.threads,
  threadsChanged: state.threadsChanged,
  currentThreadID: state.currentThreadID
}))(ThreadSection);
