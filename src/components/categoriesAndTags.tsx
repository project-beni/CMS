import * as React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Icon, Layout, Menu, List, Input, Button } from 'antd'

const sidebar: React.SFC<any> = ({ addCategory, addTag, categories, tags, position }) => (
  <React.Fragment>
    <h1>カテゴリー・タグの編集</h1>
    <h2>カテゴリー</h2>
    <List
      key='1'
      bordered
      size='small'
      dataSource={categories}
      renderItem={(item: string) => (
        <List.Item>{item}</List.Item>
      )}
    />
    <Input
      onPressEnter={addCategory}
      placeholder='新しく追加するカテゴリー'
    />
    <h2>タグ</h2>
    <List
      bordered
      key='2'
      size='small'
      dataSource={tags}
      renderItem={(item: string) => (
        <List.Item>{item}</List.Item>
      )}
    />
    <Input
      onPressEnter={addTag}
      placeholder='新しく追加するタグ'
    />
  </React.Fragment>
)

export default sidebar
