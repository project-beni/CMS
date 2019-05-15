import * as React from 'react'
import { Table } from 'antd'
import styled from 'styled-components'

const List = styled(Table)`
  margin: 20px
`

const columns: any = [
  {
    title: 'name',
    dataIndex: 'name',
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
  }
]

const data = [
  {
    key: '1',
    name: 'aaa'
  },
  {
    key: '2',
    name: 'bbb'
  },
  {
    key: '3',
    name: 'aaa'
  },
  {
    key: '4',
    name: 'bbb'
  },
  {
    key: '5',
    name: 'aaa'
  }
]

const OrderedArticles: React.SFC<any> = () => (
  <div>
    <h1>受注中の記事</h1>
    <List columns={columns} dataSource={data} />
  </div>
)

export default OrderedArticles
