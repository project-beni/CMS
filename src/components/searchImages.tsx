import * as React from 'react'
import { Button, Card, Col, Input, Row, Icon } from 'antd'
const { Search } = Input

const SearchImages: React.SFC<any> = ({
  search,
  searchIndex,
  searchWord,
  moreSearch,
  photoList,
  copyLink
}) => (
  <React.Fragment>
    <Search
      placeholder='検索ワード'
      enterButton='検索'
      onSearch={search}
      style={{ marginTop: 30}}
    />
    <Row gutter={4}>
      {
        photoList.map((url: string, i: number) => (
          <Col span={24} key={i}>
            <Card
              style={{
                height: 'auto',
                marginTop: 20,
                marginBottom: 20
              }}
              cover={<img src={url} onClick={() => copyLink(url)} />}
              // actions={[
              //   <Icon 
              //     type='copy'
              //     onClick={() => copyLink(url)}
              //   />
              // ]}
            />
          </Col>
        ))
      }
    </Row>
    {
      searchIndex !== 1 ? (
        <Button
          onClick={moreSearch}
        >さらに読み込む</Button>  
          ) : null
    }
  </React.Fragment>
)

export default SearchImages
