import * as React from 'react'
import { Table, Tag, Button, Popconfirm } from 'antd'
import styled from 'styled-components'

const { Column } = Table

const List = styled(Table)`
  margin: 20px
`

const ModelArticles: React.SFC<any> = ({
  dataSource,
  checkArticle,
  isLoading
}) => (
  <div>
    <h1>お手本の記事</h1>
    <List dataSource={dataSource} bordered loading={isLoading} size='small'>
      <Column
        title='タイトル'
        render={({ title }) => <p>『{title}』</p> }
      />
      <Column
        title='カテゴリー'
        render={({ categories }) => (
          categories.map((categorie: string, i: number) => (
            <Tag key={i}>{categorie}</Tag>
          ))
        )}
      />
      <Column
        title='タグ'
        render={({ tags }) => (
          tags.map((tag: string, i: number) => (
            <Tag key={i}>{tag}</Tag>
          ))
        )}
      />
      <Column title='文字数' dataIndex='countAll' />
      <Column
        title='閲覧する'
        render={({ id }) => (
          <Button
            size='small'
            onClick={() => checkArticle({ id })}
            type='primary'
          >する</Button>
        )}
      />
    </List>
  </div>
)

export default ModelArticles
