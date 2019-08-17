export default {
  addTodo({ commit }, text) {
    commit('addTodo', { text, done: false });
  },

  removeTodo({ commit }, todo) {
    commit('removeTodo', todo);
  },

  toggleTodo({ commit }, todo) {
    commit('updateTodo', {
      todo,
      newTodo: { text: todo.text, done: !todo.done }
    });
  },

  editTodo({ commit }, { todo, value }) {
    commit('updateTodo', {
      todo,
      newTodo: { text: value, done: todo.done }
    });
  },

  toggleAll({ state, commit }, allChecked) {
    const { todos } = state;
    commit('updateTodos', todos.map((todo) => {
      return { text: todo.text, done: allChecked };
    }));
  },

  clearCompleted({ state, commit }) {
    let { todos } = state;
    commit('updateTodos', todos.filter(todo => !todo.done));
  }
}
