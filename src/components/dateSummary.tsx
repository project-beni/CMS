import * as React from 'react'
import { Table, DatePicker } from 'antd'
import styled from 'styled-components'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment')

const { Column } = Table

const List = styled(Table)`
  margin: 20px;
`

const RecruitingArticles: React.SFC<any> = ({
  articleData,
  changeDate,
  isLoading,
}) => {
  const order = articleData[0]
    ? articleData[0].ordered + articleData[1].ordered
    : 'loading'
  return (
    <div>
      <h1>１日のまとめ</h1>
      <p style={{ margin: 20 }}>発注：{order}</p>
      <List dataSource={articleData} bordered loading={isLoading} size="small">
        <Column title="役職" dataIndex="head" />
        <Column title="受注" dataIndex="writingStart" />
        <Column title="提出" dataIndex="pending" />
        <Column title="差し戻し" dataIndex="rejected" />
        <Column title="受理" dataIndex="accepted" />
      </List>
      <DatePicker
        defaultValue={moment()}
        onChange={changeDate}
        style={{
          marginLeft: 20,
        }}
      />
    </div>
  )
}

export default RecruitingArticles
