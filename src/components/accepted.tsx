import * as React from 'react'
import { Table, Tag } from 'antd'
import styled from 'styled-components'

const { Column } = Table

const List = styled(Table)`
  margin: 20px;
`

const RecruitingArticles: React.SFC<any> = ({ dataSource, isLoading }) => (
  <div>
    <h1>納品済みの記事</h1>
    <List dataSource={dataSource} bordered loading={isLoading}>
      <Column title="タイトル" dataIndex="title" />
      <Column
        title="納品日時"
        render={({ accepted }) => {
          const s = accepted ? accepted.split('-') : null
          return s ? `${s[0]}年${s[1]}月${s[2]}日${s[3]}:${s[4]}` : null
        }}
      />
      <Column
        title="執筆日数"
        render={({ days }) => {
          if (days >= 7) {
            return <p style={{ color: '#d32f2f' }}>{`${days}日`}</p>
          } else {
            return `${days}日`
          }
        }}
      />
      <Column title="文字数" dataIndex="countAll" />
      <Column
        title="キーワード"
        render={({ keyword }) =>
          keyword.map((tag: string, i: number) => <Tag key={i}>{tag}</Tag>)
        }
      />
    </List>
  </div>
)

export default RecruitingArticles
