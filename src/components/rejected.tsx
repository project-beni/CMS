import * as React from 'react'
import { Table, Tag, Button } from 'antd'
import styled from 'styled-components'

const { Column } = Table

const List = styled(Table)`
  margin: 20px;
`

const RecruitingArticles: React.SFC<any> = ({
  dataSource,
  editArticle,
  isLoading,
}) => (
  <div>
    <h1>差し戻しされた記事</h1>
    <List dataSource={dataSource} bordered loading={isLoading}>
      <Column title='タイトル' dataIndex='title' />
      <Column
        title='差し戻し日時'
        render={({ rejected }) => {
          const s = rejected ? rejected.split('-') : null
          return s ? `${s[0]}年${s[1]}月${s[2]}日${s[3]}:${s[4]}` : null
        }}
      />
      <Column
        title='残り日数'
        render={({ countdown }) => {
          if (countdown === 0) {
            return <p style={{ color: '#d32f2f' }}>{`${countdown}日`}</p>
          } else if (countdown < 4) {
            return <p style={{ color: '#fb8c00' }}>{`${countdown}日`}</p>
          } else {
            return `${countdown}日`
          }
        }}
      />
      <Column
        title='キーワード'
        render={({ keyword }) =>
          keyword.map((tag: string, i: number) => <Tag key={i}>{tag}</Tag>)
        }
      />
      <Column
        title='執筆'
        render={({ id }) => (
          <Button size='small' onClick={() => editArticle({ id })}>
            執筆修正する
          </Button>
        )}
      />
    </List>
  </div>
)

export default RecruitingArticles
