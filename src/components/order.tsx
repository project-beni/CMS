import * as React from 'react'
import { Button, Form, Input, Select, Table } from 'antd'
import styled from 'styled-components'
import { Formik, FormikActions, FormikProps } from 'formik'
const { Item } = Form
const { Option } = Select
const { TextArea } = Input

const List = styled(Table)`
  margin: 20px
`

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
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
      offset: 6
    }
  }
}

const selectOptions = ['aaa', 'bbb', 'ccc']

const RecruitingArticles: React.SFC<any> = ({ isLoading, onSubmit, tags, categories }) => (
  <div>
    <h1>記事の発注</h1>
    <Formik
      initialValues={{title: '', headings: '', keyword: [] }}
      onSubmit={onSubmit}
      render={({
        handleChange,
        handleSubmit,
        values: { headings, keyword, title },
        setFieldValue
      }) => (
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Item label='キーワード（１つごとに改行）'>
            <TextArea
              name='keyword'
              onChange={handleChange}
              value={keyword}
              rows={3}
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
                tags.map((val: string, index: number) => (
                  <Option key={index} value={tags[index]}>{tags[index]}</Option>
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
                categories.map((val: string, index: number) => (
                  <Option key={index} value={categories[index]}>{categories[index]}</Option>
                ))
              }
            </Select>
          </Item>
          <Item label='見出し'>
            <TextArea
              name='headings'
              onChange={handleChange}
              value={headings}
              rows={15}
            />
          </Item>
          <Item　{...tailFormItemLayout}>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
            >発注</Button>
          </Item>
        </Form>
        
      )}
    />
  </div>
)

export default RecruitingArticles
