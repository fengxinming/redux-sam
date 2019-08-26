import React, { PureComponent } from 'react';
import { formatTime } from '../../common/utils';

class Thread extends PureComponent {
  render() {
    const { active, thread } = this.props;
    const { lastMessage } = thread;

    return (
      <li
        className={`thread-list-item${active ? ' active' : ''}${lastMessage.isRead ? '' : ' thread-unread'}`}
        onClick={() => this.props.switchThread(thread.id)} >
        <h5 className="thread-name">{thread.name}</h5>
        <div className="thread-time">
          {formatTime(lastMessage.timestamp)}
        </div>
        <div className="thread-last-message">
          {lastMessage.text}
        </div>
      </li>
    );
  }
}

export default Thread;
