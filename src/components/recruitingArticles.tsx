import * as React from 'react'
import { Table, Tag, Button, Popconfirm } from 'antd'
import styled from 'styled-components'

import beautyDate from '../utils/beautyDate'

const { Column } = Table

const List = styled(Table)`
  margin: 20px;
`

const RecruitingArticles: React.SFC<any> = ({
  dataSource,
  editArticle,
  isLoading,
  position,
  amountOfArticles,
}) => {
  return (
    <div>
      <h1>募集中の記事</h1>
      <p style={{ margin: 20 }}>
        「受注中」の記事が3つ以上の場合は新たに受注できません．（検品中・差し戻しの記事はカウントしません）
      </p>
      <List
        dataSource={dataSource}
        bordered
        loading={isLoading}
        expandedRowRender={({ summary }) => {
          return summary.map(({ type, text, key }: any) => {
            switch (type) {
              case 'header-one':
                return (
                  <h1
                    key={key}
                    style={{
                      fontSize: '1.5em',
                      margin: 0,
                    }}
                  >
                    ○ {text}
                  </h1>
                )
                break
              case 'header-two':
                return (
                  <h2
                    key={key}
                    style={{
                      fontSize: '1em',
                      marginLeft: '2em',
                    }}
                  >
                    ● {text}
                  </h2>
                )
                break
              case 'header-three':
                return (
                  <h3
                    key={key}
                    style={{
                      fontSize: '1em',
                      marginLeft: '4em',
                    }}
                  >
                    ・ {text}
                  </h3>
                )
                break
              default:
                return null
            }
          })
        }}
      >
        <Column title='タイトル' dataIndex='title' />
        <Column
          title='発注日時'
          render={({ ordered }) => beautyDate(ordered)}
          key='orderedDate'
        />
        <Column
          title='キーワード'
          render={({ keyword }) =>
            keyword.map((tag: string, i: number) => <Tag key={i}>{tag}</Tag>)
          }
          key='keyword'
        />
        {position === 'writer' ? (
          amountOfArticles <= 2 ? (
            <Column
              title='受注'
              render={({ id }) => (
                <Popconfirm
                  title='本当に受注しますか？'
                  onConfirm={() => editArticle({ id })}
                >
                  <Button size='small'>受注する</Button>
                </Popconfirm>
              )}
              key='writingStart'
            />
          ) : null
        ) : null}
      </List>
    </div>
  )
}

export default RecruitingArticles
