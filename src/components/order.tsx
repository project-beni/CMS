import * as React from 'react'
import { Button, Form, Input, Select, Table } from 'antd'
import styled from 'styled-components'
import { Formik, FormikActions, FormikProps } from 'formik'
const { Item } = Form
const { Option } = Select

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

const selectOptions = ['aaa', 'bbb', 'ccc']

const RecruitingArticles: React.SFC<any> = ({ onSubmit }) => (
  <div>
    <h1>記事の発注</h1>
    <Formik
      initialValues={{title: 'aaa'}}
      onSubmit={onSubmit}
      render={({
        handleChange,
        handleSubmit,
        isSubmitting,
        initialValues,
        values: { title },
        setFieldValue
      }) => (
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Item label='キーワード'>
            <Input
              name='keyWord'
              onChange={handleChange}
            />
          </Item>
          <Item label='タグ'>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={(tagNames: string) => ( // type for tags
                setFieldValue('tagNames', tagNames)
              )}
              // defaultValue={}
            >
              {
                selectOptions.map((val: string, index: number) => (
                  <Option key={index} value={selectOptions[index]}>{selectOptions[index]}</Option>
                ))
              }
            </Select>
          </Item>
          <Item label='タイトル'>
            <Input
              name='title'
              onChange={handleChange}
              value={title}
            />
          </Item>
          <Item label='カテゴリ'>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={(categories: string) => ( // type for tags
                setFieldValue('categories', categories)
              )}
              // defaultValue={}
            >
              {
                selectOptions.map((val: string, index: number) => (
                  <Option key={index} value={selectOptions[index]}>{selectOptions[index]}</Option>
                ))
              }
            </Select>
          </Item>
          <Item　{...tailFormItemLayout}>
            <Button type="primary" onClick={handleSubmit} >発注</Button>
          </Item>
        </Form>
        
      )}
    />
  </div>
)

export default RecruitingArticles
