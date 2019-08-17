//<style src="todomvc-app-css/index.css"></style>

import React, { PureComponent } from 'react';
import map from 'celia.object/map';
import { connect } from 'react-redux';
import { mapActions, sam } from '../../store';
import TodoItem from '../TodoItem';

const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: todos => todos.filter(todo => todo.done)
}


class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visibility: 'all',
    }

    mapActions(this, [
      'toggleAll',
      'clearCompleted'
    ]);
  }

  pluralize = (n, w) => n === 1 ? w : (w + 's')

  capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

  addTodo = (e) => {
    if ((e.switch || e.keyCode) === 13) {
      const text = e.target.value;
      if (text.trim()) {
        sam.dispatch('addTodo', text);
      }
      e.target.value = '';
    }
  }

  filteredTodos(todos) {
    return filters[this.state.visibility](todos);
  }

  onSetVisibility = (key) => {
    this.setState({
      visibility: key
    });
  }

  render() {
    const todos = this.props.todos;
    const len = todos.length;
    let remaining = 0;
    let allChecked = 0;
    todos.forEach((todo) => {
      allChecked += todo.done ? 1 : 0;
      remaining += todo.done ? 0 : 1;
    });
    allChecked = allChecked === len;

    return (
      <section className="todoapp">
        {/* <!-- header --> */}
        <header className="header">
          <h1>todos</h1>
          <input className="new-todo"
            autoFocus
            autoComplete="off"
            placeholder="What needs to be done?"
            onKeyUp={this.addTodo} />
        </header>

        {/* <!-- main section --> */}
        <section className="main" style={{ display: len ? 'block' : 'none' }}>
          <input
            className="toggle-all"
            id="toggle-all"
            type="checkbox"
            checked={allChecked}
            onChange={() => this.toggleAll(!allChecked)} />
          <label htmlFor="toggle-all"></label>
          <ul className="todo-list">
            {
              this.filteredTodos(todos).map((todo, index) => (
                <TodoItem
                  key={index}
                  todo={todo}
                />
              ))
            }
          </ul>
        </section>

        {/* <!-- footer --> */}
        <footer className="footer" style={{ display: len ? 'block' : 'none' }}>
          <span className="todo-count">
            <strong>{remaining}</strong>
            {this.pluralize(remaining, ' item')} left
          </span>
          <ul className="filters">
            {
              map(filters, (val, key) => (
                <li key={key}>
                  <a href={'#/' + key}
                    className={this.state.visibility === key ? 'selected' : ''}
                    onClick={() => this.onSetVisibility(key)}>{this.capitalize(key)}</a>
                </li>
              ))
            }
          </ul>
          <button
            className="clear-completed"
            style={{ display: len > remaining ? 'inline' : 'none' }}
            onClick={this.clearCompleted}>Clear completed</button>
        </footer>
      </section >
    );
  }
}

export default connect(state => ({
  todos: state.todos
}))(App);
