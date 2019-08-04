import './index.styl';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { LOGIN_DIRECTLY, LOGIN_UPDATE_FIELDS, LOGIN_UPDATE_STATE } from '~/constants/dispatch-types';
import history from '~/history';

const iconStyle = { color: 'rgba(0,0,0,.25)' };

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class LoginComponent extends PureComponent {
  componentDidMount() {
    setTimeout(() => {
      this.props.dispatch(LOGIN_UPDATE_STATE, {
        disabledUsername: false,
        disabledPassword: false
      });
    }, 1000);
  }

  handleSubmit = (evt) => {
    evt.preventDefault();

    const { validateFields, setFields } = this.props.form;
    validateFields((error, values) => {
      if (!error) {
        this.props.dispatch(LOGIN_DIRECTLY, null, { async: true })
          .then(() => {
            history.push('/');
          })
          .catch(({ message }) => {
            setFields({
              password: {
                value: values.password,
                errors: [new Error(message)]
              }
            });
          });
      }
    });
  }

  render() {
    const { disabledUsername, disabledPassword, isLogging, form } = this.props;
    const { getFieldDecorator, getFieldsError } = form;

    return (
      <div className="login">
        <div className="login-form">
          <h1 className="login-logo">管理平台</h1>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名!' }]
              })(
                <Input
                  disabled={disabledUsername}
                  prefix={<Icon type='user' style={iconStyle}></Icon>}
                  placeholder="用户名"></Input>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入用户名!' }]
              })(
                <Input
                  type="password"
                  disabled={disabledPassword}
                  prefix={<Icon type='lock' style={iconStyle}></Icon>}
                  placeholder="密码"></Input>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true
              })(
                <Checkbox>记住我</Checkbox>
              )}
            </Form.Item>
            <Form.Item>
              <Button
                loading={isLogging}
                className="login-submit-button"
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}>登录</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const LoginForm = Form.create({
  name: 'loginForm',
  // onFieldsChange(props, changedFields) {
  //   console.log('onFieldsChange', changedFields);
  // },
  mapPropsToFields(props) {
    // console.log('mapPropsToFields', props);
    const { fields } = props;
    return {
      username: Form.createFormField({
        value: fields.username
      }),
      password: Form.createFormField({
        value: fields.password
      })
    };
  },
  onValuesChange(props, values) {
    props.dispatch(LOGIN_UPDATE_FIELDS, values);
  }
})(LoginComponent);

export default connect((state) => {
  const { fields, disabledUsername, disabledPassword, isLogging } = state.login;
  return { fields, disabledUsername, disabledPassword, isLogging };
})(LoginForm);
