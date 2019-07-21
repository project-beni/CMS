import * as React from 'react'
import { Button, Table, Tag } from 'antd';

const UsersList: React.SFC<any> = ({
  users,
  checkArticle
}) => {
  // console.log(users);
  
  const expandedRowRender = (a: any, i: number) => {
    console.log(a);
    
    return (
      <React.Fragment>
        <p>ユーザーID:{a.writerId}</p>
        {
          a.writings.length ? (
            <Table
              pagination={{ pageSize: 5 }}
              dataSource={a.writings}
              title={() => <h2>執筆中</h2>}
              columns={[
                {
                  title: 'タイトル',
                  key: 'title',
                  render: ({ contents }) => (
                    <p>{contents.title}</p>
                  )
                },
                {
                  title: '執筆文字数',
                  key: 'countAll',
                  render: ({ contents }) => (
                    <p>{contents.countAll || 0}</p>
                  )
                },
                {
                  title: 'キーワード',
                  key: 'keywords',
                  render: ({ contents }) => contents.keyword.map((keyword: string) => <Tag>{keyword}</Tag>)
                },
                {
                  title: '受注',
                  key: 'orderedDate',
                  render: ({ dates: { ordered } }) => {
                    if (ordered) {
                      const [year,month,day, hour, minutes] = ordered.split('-')
                      return (
                        <p>{`${year}年${month}月${day}日${hour}:${minutes}`}</p>
                      )
                    } else {
                      return <p>-</p>
                    }
                  }
                },
              ]}
              style={{ margin: 10}}
              size='small'
            />
          ) : null
        }
        {
          a.pendings.length ? (
            <Table
              pagination={{ pageSize: 5 }}
              dataSource={a.pendings}
              title={() => <h2>検品中</h2>}
              columns={[
                {
                  title: 'タイトル',
                  key: 'title',
                  render: ({ contents }) => (
                    <p>{contents.title}</p>
                  )
                },
                {
                  title: '執筆文字数',
                  key: 'countAll',
                  render: ({ contents }) => (
                    <p>{contents.countAll || 0}</p>
                  )
                },
                {
                  title: 'キーワード',
                  key: 'keywords',
                  render: ({ contents }) => contents.keyword.map((keyword: string) => <Tag>{keyword}</Tag>)
                },
                {
                  title: '提出',
                  key: 'submitDate',
                  render: ({ dates: { pending } }) => {
                    if (pending) {
                      const [year,month,day, hour, minutes] = pending.split('-')
                      return (
                        <p>{`${year}年${month}月${day}日${hour}:${minutes}`}</p>
                      )
                    } else {
                      return <p>-</p>
                    }
                  }
                },
                {
                  title: '検品する',
                  key: 'check',
                  render: ({ articleId }) => (
                    <Button
                      onClick={() => checkArticle({articleId})}
                      size='small'
                      type='primary'
                    >検品する</Button>
                  )
                },
              ]}
              style={{ margin: 10}}
              size='small'
            />
          ) : null
        }
        {
          a.rejects.length ? (
            <Table
              pagination={{ pageSize: 5 }}
              dataSource={a.rejects}
              title={() => <h2>差し戻し</h2>}
              columns={[
                {
                  title: 'タイトル',
                  key: 'title',
                  render: ({ contents }) => (
                    <p>{contents.title}</p>
                  )
                },
                {
                  title: '執筆文字数',
                  key: 'countAll',
                  render: ({ contents }) => (
                    <p>{contents.countAll || 0}</p>
                  )
                },
                {
                  title: 'キーワード',
                  key: 'keywords',
                  render: ({ contents }) => contents.keyword.map((keyword: string) => <Tag>{keyword}</Tag>)
                },
                {
                  title: '差し戻し',
                  key: 'rejectedDate',
                  render: ({ dates: { rejected } }) => {
                    if (rejected) {
                      const [year,month,day, hour, minutes] = rejected.split('-')
                      return (
                        <p>{`${year}年${month}月${day}日${hour}:${minutes}`}</p>
                      )
                    } else {
                      return <p>-</p>
                    }
                  }
                },
              ]}
              style={{ margin: 10}}
              size='small'
            />
          ) : null
        }
        {
          a.accepted.length ? (
            <Table
              pagination={{ pageSize: 5 }}
              dataSource={a.accepted}
              title={() => <h2>受理</h2>}
              columns={[
                {
                  title: 'タイトル',
                  key: 'title',
                  render: ({ contents }) => (
                    <p>{contents.title}</p>
                  )
                },
                {
                  title: '執筆文字数',
                  key: 'countAll',
                  render: ({ contents }) => (
                    <p>{contents.countAll || 0}</p>
                  )
                },
                {
                  title: 'キーワード',
                  key: 'keywords',
                  render: ({ contents }) => contents.keyword.map((keyword: string) => <Tag>{keyword}</Tag>)
                },
                {
                  title: '受理',
                  key: 'acceptedDate',
                  render: ({ dates: { accepted } }) => {
                    if (accepted) {
                      const [year,month,day, hour, minutes] = accepted.split('-')
                      return (
                        <p>{`${year}年${month}月${day}日${hour}:${minutes}`}</p>
                      )
                    } else {
                      return <p>-</p>
                    }
                  }
                },
              ]}
              style={{ margin: 10}}
              size='small'
            />
          ) : null
        }
      </React.Fragment>
    )
  }
  
  return (
    <Table
      expandedRowRender={expandedRowRender}
      dataSource={users}
      bordered
      columns={[
        { title: 'ペンネーム', key: 'nickname', dataIndex: 'nickname' },
        { title: 'メールアドレス', key: 'mail', dataIndex: 'mail' },
        {
          title: '受注（執筆）中',
          key: 'ordered',
          render: ({ writings }) => <p>{writings.length}</p>
        },
        {
          title: '検品中',
          key: 'pending',
          render: ({ pendings }) => <p>{pendings.length}</p>
        },
        {
          title: '差し戻し・修正中',
          key: 'rejected',
          render: ({ rejects }) => <p>{rejects.length}</p>
        },
        {
          title: '受理',
          key: 'accepted',
          render: ({ accepted }) => <p>{accepted.length}</p>
        },
      ]}
      style={{margin: 50}}
      size='small'
    />
  )
}

export default UsersList
