export const STORAGE_KEY = 'todos-react';

// for testing
if (navigator.userAgent.indexOf('PhantomJS') > -1) {
  window.localStorage.clear()
}

export const mutations = {
  addTodo(state, todo) {
    // state.todos = state.todos.concat(todo);
    state.todos.push(todo);
    state.todosChanged++;
  },

  removeTodo(state, todo) {
    const { todos } = state;
    const index = todos.indexOf(todo);
    if (index === -1) {
      // 不触发组件更新
      return false;
    }
    // state.todos = todos.slice(0, index).concat(todos.slice(index + 1));
    state.todos.splice(index, 1);
    state.todosChanged--;
  },

  updateTodo(state, { todo, newTodo }) {
    const { todos } = state;
    const index = todos.indexOf(todo);
    // state.todos = todos.slice(0, index).concat(newTodo, todos.slice(index + 1));
    state.todos.splice(index, 1, newTodo);
    state.todosChanged--;
  },

  updateTodos(state, newTodos) {
    state.todos = newTodos;
  }
}
