import { Component } from 'react';
import { createStore } from 'redux-sam';
import createLogger from 'redux-sam/logger';
import mutations from './mutations';
import actions from './actions';

const state = {
  currentThreadID: null,
  threads: {
    /*
    id: {
      id,
      name,
      messages: [...ids],
      lastMessage
    }
    */
  },
  threadsChanged: 0,
  messages: {
    /*
    id: {
      id,
      threadId,
      threadName,
      authorName,
      text,
      timestamp,
      isRead
    }
    */
  }
}

const { store, sam, mapActions, mapMutations } = createStore({
  state,
  actions,
  mutations,
  plugins: [process.env.NODE_ENV !== 'production' && createLogger()]
}, Component);

// 默认获取所有消息
sam.dispatch('getAllMessages');

export { store, sam, mapActions, mapMutations };
