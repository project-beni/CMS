import * as React from 'react'
import { Table, Tag, Button, Popconfirm } from 'antd'
import styled from 'styled-components'

const { Column } = Table

const List = styled(Table)`
  margin: 20px
`
const AcceptedList: React.SFC<any> = ({
  dataSource: { filters: { writerFilters, dateFilters }, list },
  checkArticle,
  isLoading
}) => (
  <div>
    <h1>受理した記事の一覧</h1>
    <List dataSource={list} bordered loading={isLoading} size='small'>
      <Column
        title='名前'
        render={({ writer }) => <p>{writer}</p>}
        filters={writerFilters}
        onFilter={(value, record: any) => record.writer.indexOf(value) === 0}
        key='name'
      />
      <Column
        title='タイトル'
        render={({ title }) => <p>{title}</p>}
        key='title'
      />
      <Column
        title='発注日時'
        render={({ ordered }) => {
          const s = ordered ? ordered.split('-') : null
          return s ? `${s[0]}年${s[1]}/${s[2]}` : null
        }}
        key='orderDate'
      />
      <Column
        title='提出日時'
        render={({ pending }) => {
          const s = pending ? pending.split('-') : null
          return s ? `${s[0]}年${s[1]}/${s[2]}` : null
        }}
        key='submitDate'
      />
      <Column
        title='受理日時'
        render={({ accepted }) => {
          const s = accepted ? accepted.split('-') : null
          return s ? `${s[0]}年${s[1]}/${s[2]}` : null
        }}
        filters={dateFilters}
        onFilter={(value, { accepted }: any) => {
          const s = accepted ? accepted.split('-') : null
          const beauty = s ? `${s[0]}年${s[1]}/${s[2]}` : ''
          return beauty.indexOf(value) === 0
        }}
        key='acceptedDate'
        sorter={(a: any, b: any) => {
          let r = 0
          let f = true
          Array.prototype.forEach.call(a.accepted, (str: any, i: number) => {
            if (str.charCodeAt() !== b.accepted[i].charCodeAt() && f) {
              r = Number(str.charCodeAt()) - Number(b.accepted[i].charCodeAt())
              f = false
            }
          })
          return r
        }}
        sortDirections={['descend', 'ascend']}
        defaultSortOrder='descend'
      />
      <Column
        title='日数'
        render={({ days }) => {
          if (days >= 7) {
            return (<p style={{color:'#d32f2f'}}>{`${days}日`}</p>)
          } else {
            return `${days}日`
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
        key='categories'
      />
      <Column
        title='タグ'
        render={({ tags }) => (
          tags.map((tag: string, i: number) => (
            <Tag key={i}>{tag}</Tag>
          ))
        )}
        key='tags'
      />
      <Column title='文字数' dataIndex='countAll' key='countAll' />
      <Column
        title=''
        render={({ id }) => (
          <Button
            size='small'
            onClick={() => checkArticle({ id })}
            type='primary'
          >閲覧</Button>
        )}
        key='check'
      />
    </List>
  </div>
)

export default AcceptedList
