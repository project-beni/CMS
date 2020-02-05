import * as React from 'react'
import { Table, Tag, Button } from 'antd'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'

const { Column } = Table

const List = styled(Table)`
  margin: 20px;
`

const AllArticleList: React.SFC<any> = ({
  dataSource,
  isLoading,
  moreInfo,
  categoryFilter,
  tagFilter
}) => {
  const history = useHistory();
  const queries = new URLSearchParams(useLocation().search);
  const categoriesQuery = queries.getAll('categories')
  const tagsQuery = queries.getAll('tags')
  const pageQuery = queries.get('page')
  const statusQuery = queries.getAll('status')
  return (
    <div>
      <h1>全ての記事</h1>
      <List
        dataSource={dataSource}
        bordered
        loading={isLoading}
        pagination={{
          current: Number(pageQuery) || 0,
        }}
        onChange={(pagination, filter) => {
          const params = new URLSearchParams();
          params.append('page', String(pagination.current));

          Object.keys(filter).forEach((key) => {
            (filter as any)[key].forEach((value: string) => {
              params.append(key, value);
            });
          })

          const baseURL = `/articles?${params}`;
          history.push(baseURL)
          
        }}
      >
        <Column title='タイトル' dataIndex='title' />
        <Column
          title='状態'
          render={({ status, dates }) => {
            switch (status) {
              case 'ordered':
                const ordered = dates.ordered.split('-').slice(1,3).join('/')
                return <Tag color='#ccc'>発注:{ordered}</Tag>
                break
              case 'writing':
                const writingStart = dates.writingStart.split('-').slice(1,3).join('/')
                return <Tag color='#aed581'>執筆:{writingStart}</Tag>
                break
              case 'pending':
                const pending = dates.pending.split('-').slice(1,3).join('/')
                return <Tag color='#ffd54f'>検品:{pending}</Tag>
                break
              case 'rejected':
                const rejected = dates.rejected.split('-').slice(1,3).join('/')
                return <Tag color='#e57373'>差戻:{rejected}</Tag>
                break
              case 'accepted':
                const accepted = dates.accepted.split('-').slice(1,3).join('/')
                return <Tag color='#64b5f6'>受理:{accepted}</Tag>
                break
              case 'published':
                const published = dates.accepted.split('-').slice(1,3).join('/')
                return <Tag color='#00bcd4'>公開:{published}</Tag>
                break
              default:
                return null
                break
            }
          }}
          filters={[
            { text: '発注', value: 'ordered' },
            { text: '執筆', value: 'writing' },
            { text: '検品', value: 'pending' },
            { text: '差戻', value: 'rejected' },
            { text: '受理', value: 'accepted' },
            { text: '公開', value: 'published' }
          ]}
          filteredValue={statusQuery.length ? statusQuery : []}
          onFilter={(value, {status}: any) => status.indexOf(value) === 0}
          key='status'
        />
        <Column
          title='ライター'
          render={({ nickname, writerPosition }) => {
            return (
              <React.Fragment>
                {
                  writerPosition === 'regular' ? <Tag color='cyan'>正</Tag> : null
                }
                {nickname || '-'}
              </React.Fragment>
            )
          }}
        />
        <Column
          title='タグ'
          render={({ tags }) =>
            tags.map((tag: string, i: number) => <Tag key={i}>{tag}</Tag>)
          }
          filters={tagFilter}
          onFilter={(value, {tags}: any) => {
            if (!tags[1]) {
              return tags[0].indexOf(value) === 0
            } else {
              return tags[0].indexOf(value) === 0 || tags[1].indexOf(value) === 0
            }
          }}
          filteredValue={tagsQuery.length ? tagsQuery : []}
          key='tags'
        />
        <Column
          title='カテゴリー'
          render={({ categories }) =>
            categories.map((category: string, i: number) => <Tag key={i}>{category}</Tag>)
          }
          filters={categoryFilter}
          onFilter={(value, {categories}: any) => categories[0].indexOf(value) === 0}
          filteredValue={categoriesQuery.length ? categoriesQuery : []}
          key='category'
        />
        <Column
          title='タグ・カテゴリー'
          render={({ id }) =>
            <Button
              onClick={() => {moreInfo({id})}}
              size='small'
              type='dashed'
            >
              変更
            </Button>
          }
        />
      </List>
    </div>
  )
}
export default AllArticleList
