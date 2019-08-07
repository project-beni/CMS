import * as React from 'react'
import { Table, Tag, Button } from 'antd'
import styled from 'styled-components'

const { Column } = Table

const List = styled(Table)`
  margin: 20px
`

const RecruitingArticles: React.SFC<any> = ({
  articleData: {
    ordered, writingStart, pending, rejected, accepted
  },
  isLoading
}) => (
  <div>
    <h1>検品待ちの記事</h1>
    <p>発注：{ordered}, 受注：{writingStart}, 提出：{pending}, 差し戻し：{rejected}, 受理：{accepted}</p>
    {/* <List dataSource={dataSource} bordered loading={isLoading} size='small'>
      <Column
        title='ライター / タイトル'
        render={({ writer, title }) => {
          return (
            <React.Fragment>
              <p>{writer}</p>
              <p>『{title}』</p>
            </React.Fragment>
          )
        }}
      />
      <Column
        title='発注日時'
        render={({ ordered }) => {
          const s = ordered ? ordered.split('-') : null
          return s ? `${s[0]}年${s[1]}月${s[2]}日${s[3]}:${s[4]}` : null
        }}
      />
      <Column
        title='提出日時'
        render={({ pending }) => {
          const s = pending ? pending.split('-') : null
          return s ? `${s[0]}年${s[1]}月${s[2]}日${s[3]}:${s[4]}` : null
        }}
        sorter={(a: any, b: any) => {
          let r = 0
          let f = true
          Array.prototype.forEach.call(a.pending, (str: any, i: number) => {
            if (str.charCodeAt() !== b.pending[i].charCodeAt() && f) {
              r = Number(str.charCodeAt()) - Number(b.pending[i].charCodeAt())
              f = false
            }
          })
          return r
        }}
        sortDirections={['descend', 'ascend']}
        defaultSortOrder='descend'
      />
      <Column
        title='残り日数'
        render={({ countdown }) => {
          if (countdown === 0) {
            return (<p style={{color:'#d32f2f'}}>{`${countdown}日`}</p>)
          } else if (countdown < 4) {
            return (<p style={{color:'#fb8c00'}}>{`${countdown}日`}</p>)
          }else {
            return `${countdown}日`
          }
        }}
      />
      <Column
        title='カテゴリー'
        render={({ categories }) => (
          categories.map((categorie: string, i: number) => (
            <Tag key={i}>{categorie}</Tag>
          ))
        )}
      />
      <Column
        title='タグ'
        render={({ tags }) => (
          tags.map((tag: string, i: number) => (
            <Tag key={i}>{tag}</Tag>
          ))
        )}
      />
      <Column title='文字数' dataIndex='countAll' />
      <Column
        title='検品'
        render={({ id }) => (
          <Button
            size='small'
            onClick={() => checkArticle({ id })}
            type='primary'
          >する</Button>
        )}
      />
    </List> */}
  </div>
)

export default RecruitingArticles
