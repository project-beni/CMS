import * as React from 'react'
import { Table, Tag, Button, Popconfirm } from 'antd'
import styled from 'styled-components'

const { Column } = Table

const List = styled(Table)`
  margin: 20px
`

const columns: any = [
  {
    title: 'name',
    dataIndex: 'title',
    filters: [
      {
        text: 'aaa',
        value: 'aaa'
      },
      {
        text: 'bbb',
        value: 'bbb'
      }
    ],
    onFilter: (value: any, record: any) => record.name.indexOf(value) === 0,
    sorter: (a: any, b: any) => a.name.length - b.name.length,
    sortDirections: ['descend']
  },
  {
    title: 'order date',
    dataIndex: 'ordered'
  },
  {
    title: 'keyword',
    dataIndex: 'keyword'
  }
]

const RecruitingArticles: React.SFC<any> = ({
  dataSource,
  editArticle,
  isLoading
}) => (
  <div>
    <h1>受注中の記事</h1>
    <List dataSource={dataSource} bordered loading={isLoading}>
      <Column title='Name' dataIndex='title' />
      <Column title='Order date' dataIndex='ordered' />
      <Column
        title='Tags'
        render={({ tags }) => (
          tags.map((tag: string, i: number) => (
            <Tag key={i}>{tag}</Tag>
          ))
        )}
      />
    </List>
  </div>
)

export default RecruitingArticles
