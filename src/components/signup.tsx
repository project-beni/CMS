import * as React from 'react'
import { Button, Form, Input, Select, Table } from 'antd'
import styled from 'styled-components'
import { Formik, FormikActions, FormikProps } from 'formik'
const { Item } = Form

const List = styled(Table)`
  margin: 20px
`

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
}

const Signup: React.SFC<any> = ({ onSubmit }) => (
  <div>
    <h1>アカウントの作成</h1>
    <Formik
      initialValues={{
        mail: '',
        nickname: '',
        familyName: '',
        firstName: '',
        pass: ''
      }}
      onSubmit={onSubmit}
      render={({
        handleChange,
        handleSubmit,
        isSubmitting,
        initialValues,
        values: { nickname, familyName, firstName },
        setFieldValue
      }) => (
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Item label='苗字'>
            <Input
              name='familyName'
              onChange={handleChange}
              value={familyName}
            />
          </Item>
          <Item label='名前'>
            <Input
              name='firstName'
              onChange={handleChange}
              value={firstName}
            />
          </Item>
          <Item label='ニックネーム'>
            <Input
              name='nickname'
              onChange={handleChange}
              value={nickname}
            />
          </Item>
          <Item label='メールアドレス'>
            <Input
              name='mail'
              onChange={handleChange}
            />
          </Item>
          <Item label='パスワード'>
            <Input.Password
              name='pass'
              onChange={handleChange}
            />
          </Item>
          <Item　{...tailFormItemLayout}>
            <Button type="primary" onClick={handleSubmit} >発注</Button>
          </Item>
        </Form>
        
      )}
    />
  </div>
)

export default Signup
