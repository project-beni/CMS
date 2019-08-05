import * as React from 'react'
import { Button, Form, Input } from 'antd'
import { Formik } from 'formik'

const { Item } = Form

const Login: React.SFC<any> = ({ onLogin, isLoading }) => (
  <Formik
      initialValues={{mail: '', pass: ''}}
      onSubmit={onLogin}
      render={({
        handleChange,
        handleSubmit,
        isSubmitting,
        initialValues,
        values: { pass, mail },
        setFieldValue
      }) => (
        <Form onSubmit={handleSubmit} >
          <Item label='メールアドレス'>
            <Input
              name='mail'
              onChange={handleChange}
              value={mail}
              disabled={isLoading}
            />
          </Item>
          <Item label='パスワード'>
            <Input.Password
              name='pass'
              onChange={handleChange}
              value={pass}
              disabled={isLoading}
            />
          </Item>
          <Item>
          <Button
            type="primary"
            onClick={() => handleSubmit()}
            disabled={isLoading}
            loading={isLoading}
          >
            ログイン
          </Button>
          </Item>
        </Form>
        
      )}
    />
)

export default Login
