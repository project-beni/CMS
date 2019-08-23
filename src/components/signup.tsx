import * as React from 'react'
import { Button, Form, Input } from 'antd'
import { Formik } from 'formik'

const { Item } = Form

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

const Signup: React.SFC<any> = ({ onSubmit, isLoading }) => (
  <div>
    <h1>アカウントの作成</h1>
    <Formik
      initialValues={{
        mail: '',
        nickname: '',
        familyName: '',
        firstName: '',
        pass: '',
      }}
      onSubmit={onSubmit}
      render={({ handleChange, handleSubmit, values: { nickname } }) => (
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Item label='ペンネーム'>
            <Input
              name='nickname'
              onChange={handleChange}
              value={nickname}
              disabled={isLoading}
            />
          </Item>
          <Item label='メールアドレス'>
            <Input name='mail' onChange={handleChange} disabled={isLoading} />
          </Item>
          <Item label='パスワード'>
            <Input.Password
              name='pass'
              onChange={handleChange}
              disabled={isLoading}
            />
          </Item>
          <Item {...tailFormItemLayout}>
            <Button
              type='primary'
              onClick={() => handleSubmit()}
              disabled={isLoading}
              loading={isLoading}
            >
              作成
            </Button>
          </Item>
        </Form>
      )}
    />
  </div>
)

export default Signup
