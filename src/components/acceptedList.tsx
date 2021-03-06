import * as React from 'react'
import { Table, Tag, Button, Icon, Popconfirm } from 'antd'
import { useLocation, useHistory } from 'react-router-dom'
import Markdown from 'react-markdown'

const { Column } = Table
const AcceptedList: React.SFC<any> = ({
  dataSource: {
    filters: { writerFilters, dateFilters },
    list,
  },
  checkArticle,
  isLoading,
  pagination,
  currentPage,
  tagFilter,
  categoryFilter,
  filterTags,
  publish,
  build,
}) => {
  const history = useHistory();
  const queries = new URLSearchParams(useLocation().search);
  const nameQuery = queries.getAll('name')
  const categoriesQuery = queries.getAll('categories')
  const tagsQuery = queries.getAll('tags')
  const acceptedDate = queries.getAll('acceptedDate')
  // const sortKeyQuery = queries.get('sortKey')
  // const sortValueQuery: any = queries.get('sortValue')

  return (
    <div style={{ marginLeft: 20 }}>
      <h1>受理した記事の一覧</h1>
      <Markdown source='![Build and release](https://github.com/taka-sho/bizual-viewer/workflows/Build%20and%20release/badge.svg?branch=master)' />
      <Popconfirm
        title='ビルドしたのち，リリースも行います．本当によろしいでしょうか？'
        okText='はい．ビルドする．'
        okButtonProps={{ type: 'danger' }}
        cancelText='キャンセル'
        onConfirm={build}
      >
        <Button type='danger' size='small'>ビルド・リリース</Button>
      </Popconfirm>
      <Table
        dataSource={list}
        bordered
        loading={isLoading}
        size='small'
        pagination={{
          onChange: pagination,
          current: currentPage
        }}
        onChange={(pagination, filter) => {
          const params = new URLSearchParams();
          params.append('page', String(pagination.current));

          Object.keys(filter).forEach((key) => {
            (filter as any)[key].forEach((value: string) => {
              params.append(key, value);
            });
          })

          const baseURL = `/articles/acceptedList?${params}`;
          history.push(baseURL)
          
        }}
        style={{ marginTop: 20 }}
      >
        <Column
          title='名前'
          render={({ writer }) => <p>{writer}</p>}
          filteredValue={nameQuery.length ? nameQuery : []}
          filters={writerFilters}
          onFilter={(value, record: any) => record.writer.indexOf(value) === 0}
          key='name'
        />
        <Column
          title='タイトル'
          render={({ title, types }) => (
            <React.Fragment>
              {
                types.map((isExist: number, i: number) => {
                  if (isExist >= 0) {
                    return i ?
                      <Icon type='link' style={{ color: '#263238'}} key={i} /> :
                      <Icon type='twitter' style={{ color: '#55acee' }} key={i} />
                  } else {
                    return null
                  }
                })
              }
              <p>{title}</p>
            </React.Fragment>
          )}
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
          title='受注日時'
          render={({ writingStart }) => {
            const s = writingStart ? writingStart.split('-') : null
            return s ? `${s[0]}年${s[1]}/${s[2]}` : null
          }}
          key='orderedDate'
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
          // sortOrder={sortKeyQuery === 'acceptedDate' ? sortValueQuery : false}
          filteredValue={acceptedDate.length ? acceptedDate : []}
        />
        <Column
          title='日数'
          render={({ days }) => {
            if (days >= 7) {
              return <p style={{ color: '#d32f2f' }}>{`${days}日`}</p>
            } else {
              return `${days}日`
            }
          }}
          key='date'
        />
        <Column
          title='カテゴリー'
          render={({ categories }) =>
            categories ? (
              categories.map((categorie: string, i: number) => <Tag key={i}>{categorie}</Tag>)
            ) : 'ERR'
          }
          filteredValue={categoriesQuery.length ? categoriesQuery : []}
          filters={categoryFilter}
          onFilter={(value, {categories}: any) => categories[0].indexOf(value) === 0}
          key='categories'
        />
        <Column
          title='タグ'
          render={({ tags }) =>
            tags ? (
              tags.map((tag: string, i: number) => <Tag key={i}>{tag}</Tag>)
            ) : 'ERR'
          }
          filters={tagFilter}
          onFilter={filterTags}
          filteredValue={tagsQuery.length ? tagsQuery : []}
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
            >
              閲覧
            </Button>
          )}
          key='check'
        />
        <Column
          title='公開'
          render={({ id, status, index, categories, publishDate }) => (
            status === 'accepted' ? (
              <Popconfirm
                onConfirm={() => publish({ id, categories, index })}
                title='公開します'
                okText='公開'
                cancelText='キャンセル'
              >
                <Button
                  type='danger'
                  size='small'
                >
                  公開
                </Button>
              </Popconfirm>
            ) : (
              <a
                href={`https://bizual.jp/${categories[0]}/${index}`}
                target='_blank'
              >
                公開済み
                {
                  publishDate ? `\n${publishDate.split('-')[1]}/${publishDate.split('-')[2]}` : '9/19'
                }
              </a>
            )
          )}
        />
      </Table>
    </div>
  )
}

export default AcceptedList
