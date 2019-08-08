import * as React from 'react'
import { Table, DatePicker } from 'antd'
import styled from 'styled-components'
import * as moment from 'moment'

const { Column } = Table

const List = styled(Table)`
  margin: 20px
`

const RecruitingArticles: React.SFC<any> = ({
  articleData,
  changeDate,
  isLoading
}) => (
  <div>
    <h1>１日のまとめ</h1>
    <List
      dataSource={articleData}
      bordered
      loading={isLoading}
      size='small'
      rowKey='today'
    >
      <Column title='発注' dataIndex='ordered' />
      <Column title='受注' dataIndex='writingStart' />
      <Column title='提出' dataIndex='pending' />
      <Column title='差し戻し' dataIndex='rejected' />
      <Column title='受理' dataIndex='accepted' />
    </List>
    <DatePicker
      defaultValue={moment()}
      onChange={changeDate}
      style={{
        marginLeft: 20
      }}
    />
  </div>
)

export default RecruitingArticles
