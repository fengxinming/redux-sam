import {
  getAllMessages,
  createMessage
} from '../api';

export default {
  getAllMessages({ commit }) {
    getAllMessages(messages => {
      commit('receiveAll', messages);
    })
  },

  sendMessage: ({ commit }, payload) => {
    createMessage(payload, message => {
      commit('receiveMessage', message);
    })
  },

  switchThread({ commit }, payload) {
    commit('switchThread', payload);
  }
};
