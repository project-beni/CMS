import * as React from 'react'
import { Table, Tag } from 'antd'
import styled from 'styled-components'

import BeautyDate from '../utils/beautyDate'

const { Column } = Table

const List = styled(Table)`
  margin: 20px;
`

const RecruitingArticles: React.SFC<any> = ({ dataSource, isLoading }) => (
  <div>
    <h1>検品中の記事</h1>
    <List dataSource={dataSource} bordered loading={isLoading}>
      <Column title='タイトル' dataIndex='title' />
      <Column
        title='発注日時'
        render={({ ordered }) => BeautyDate(ordered)}
      />
      <Column
        title='提出日時'
        render={({ pending }) => BeautyDate(pending)}
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
      <Column title='文字数' dataIndex='countAll' />
      <Column
        title='キーワード'
        render={({ keyword }) =>
          keyword.map((tag: string, i: number) => <Tag key={i}>{tag}</Tag>)
        }
      />
    </List>
  </div>
)

export default RecruitingArticles
