import React, { PureComponent } from 'react';
import { formatTime } from '../../common/utils';

class Message extends PureComponent {
  render() {
    const { message } = this.props;

    return (
      <li className="message-list-item">
        <h5 className="message-author-name">{message.authorName}</h5>
        <div className="message-time">
          {formatTime(message.timestamp)}
        </div>
        <div className="message-text">{message.text}</div>
      </li>
    );
  }
}

export default Message;
