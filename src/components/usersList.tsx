import * as React from 'react'
import { Table } from 'antd';

const UsersList: React.SFC<any> = ({
  dataSource: {
    users,
    userArticles
  }
}) => {
  const expandedRowRender = () => (
    <Table
      dataSource={userArticles}
    />
  )
  return (
    <Table
      // expandedRowRender={expandedRowRender}
      dataSource={users}
      columns={[
        { title: 'ペンネーム', key: 'nickname', dataIndex: 'name' },
        { title: 'ライターID', key: 'writerId', dataIndex: 'writerId'},
        { title: '受注（執筆）中', key: 'ordered', dataIndex: 'ordered'},
        { title: '差し戻し・修正中', key: 'rejected', dataIndex: 'rejected'},
        { title: '受理', key: 'accepted', dataIndex: 'accepted'},
      ]}
    />
  )
}

export default UsersList
