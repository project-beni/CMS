import * as React from 'react'
import { Icon, List, Input, Popconfirm, Row, Col } from 'antd'
import { keyframes } from 'styled-components';

const sidebar: React.SFC<any> = ({
  addCategory,
  addTag,
  categories,
  tags,
  deleteTag,
  deleteCategorie,
  isLoading
}) => (
  <React.Fragment>
    <h1>カテゴリー・タグの編集</h1>
    <Row style={{ margin: 50 }} gutter={48}>
      <Col span={12}>
        <List
          header={<h2>カテゴリー</h2>}
          key='1'
          bordered
          size='small'
          dataSource={categories}
          loading={isLoading}
          renderItem={(item: any, i: number) => (
            <List.Item
              key={i}
              actions={[
                <Popconfirm
                  title='本当に削除しますか？'
                  onConfirm={() => deleteCategorie(item.key)}
                  placement='left'
                >
                  <Icon type='delete' />
                </Popconfirm>
              ]}
            >
              {item.value}
            </List.Item>
          )}
        />
        <Input
          style={{ marginTop: 10}}
          onPressEnter={addCategory}
          placeholder='新しく追加するカテゴリー'
        />
      </Col>
      <Col span={12}>
        <List
          header={<h2>タグ</h2>}
          bordered
          key='2'
          size='small'
          dataSource={tags}
          loading={isLoading}
          renderItem={(item: any, i: number) => (
            <List.Item
              key={i}
              actions={[
                <Popconfirm
                  title='本当に削除しますか？'
                  onConfirm={() => deleteTag(item.key)}
                  placement='left'
                >
                  <Icon type='delete' />
                </Popconfirm>
              ]}
            >{item.value}</List.Item>
          )}
        />
        <Input
          style={{ marginTop: 10}}
          onPressEnter={addTag}
          placeholder='新しく追加するタグ'
        />
      </Col>
    </Row>
  </React.Fragment>
)

export default sidebar
