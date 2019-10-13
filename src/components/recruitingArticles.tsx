import * as React from 'react'
import { Table, Tag, Button, Popconfirm } from 'antd'
import styled from 'styled-components'

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
          return summary.map(({ type, text }: any) => {
            switch (type) {
              case 'header-one':
                return (
                  <h1
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
          render={({ ordered }) => {
            const s = ordered.split('-')
            return `${s[0]}年${s[1]}月${s[2]}日${s[3]}:${s[4]}`
          }}
        />
        <Column
          title='キーワード'
          render={({ keyword }) =>
            keyword.map((tag: string, i: number) => <Tag key={i}>{tag}</Tag>)
          }
        />
        {position === 'writer' ? (
          amountOfArticles <= 1 ? (
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
            />
          ) : null
        ) : null}
      </List>
    </div>
  )
}

export default RecruitingArticles
