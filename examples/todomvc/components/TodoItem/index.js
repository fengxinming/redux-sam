import React, { PureComponent } from 'react';
import { mapActions } from '../../store'

class TodoItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      text: ''
    };

    mapActions(this, [
      'editTodo',
      'toggleTodo',
      'removeTodo'
    ])
  }

  doneEdit = () => {
    const value = this.state.text;
    const { todo } = this.props;

    if (this.state.editing) {
      if (!value) {
        this.removeTodo(todo);
      } else {
        this.editTodo({ todo, value });
      }
      this.setState({ editing: false, text: '' });
    }
  }

  cancelEdit = () => {
    this.setState({ editing: false, text: '' });
  }

  onEdit = () => {
    this.setState({ editing: true, text: this.props.todo.text }, () => {
      this.refs.textField.focus();
    });
  }

  onEnter = (e) => {
    switch (e.which || e.keyCode) {
      case 13: // Enter
        this.doneEdit(e);
        break;
      case 27: // Esc
        this.cancelEdit(e);
        break;
      default:
    }
  }

  onChangeInput = (e) => {
    this.setState({ text: e.target.value });
  }

  onRemove = (todo) => {
    this.setState({ editing: false, text: '' });
    this.removeTodo(todo);
  }

  render() {
    const { todo } = this.props;
    const { editing } = this.state;
    return (
      <li className={'todo' + (todo.done ? ' completed' : '' + (editing ? ' editing' : ''))}>
        <div className="view">
          <input className="toggle"
            type="checkbox"
            checked={todo.done}
            onChange={() => this.toggleTodo(todo)} />
          <label onDoubleClick={this.onEdit}>{todo.text}</label>
          <button className="destroy" onClick={() => this.onRemove(todo)}></button>
        </div>
        <input className="edit"
          ref="textField"
          style={{ display: editing ? 'inline' : 'none' }}
          onChange={this.onChangeInput}
          value={this.state.text}
          onKeyUp={this.onEnter}
          onBlur={this.doneEdit} />
      </li>
    );
  }
}

export default TodoItem;
