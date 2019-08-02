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
  isLoading,
  position,
  amountOfArticles
}) => {
  return (
    <div>
      <h1>募集中の記事</h1>
      <List
        dataSource={dataSource}
        bordered
        loading={isLoading}
      >
        <Column title='タイトル' dataIndex='title' />
        <Column
          title='発注日時'
          render={({ ordered }) => {
            const s = ordered.split('-')
            return `${s[0]}年${s[1]}月${s[2]}日${s[3]}:${s[4]}`
          }}
        />
        <Column
          title='キーワード'
          render={({ keyword }) => (
            keyword.map((tag: string, i: number) => (
              <Tag key={i}>{tag}</Tag>
            ))
          )}
        />
        {
          position === 'writer' ? (
            amountOfArticles <= 2 ? (
              <Column
                title='受注'
                render={({ id }) => (
                  <Popconfirm
                    title='本当に受注しますか？'
                    onConfirm={() => editArticle({id})}
                  >
                    <Button size='small'>受注する</Button>
                  </Popconfirm>
                )}
              />
            ) : null
          ) : null
        }
      </List>
    </div>
  )
}

export default RecruitingArticles
