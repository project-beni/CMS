import * as React from 'react'
import { Button, Col, Drawer, Icon, Popconfirm, Row } from 'antd'

import SearchImages from '../../../containers/searchImages'

const KeywordBoard: React.SFC<{
  countAll: number
  isDrawerVisible?: boolean
  isWriter: boolean
  keywords: string[]
  recieve?: () => void
  reject?: () => void
  relatedQueries: string[]
  save: () => void
  toggleChecking?: () => void
  toggleDrawer?: () => void
}> = ({
  countAll,
  isDrawerVisible,
  isWriter,
  keywords,
  recieve,
  reject,
  relatedQueries,
  save,
  toggleChecking,
  toggleDrawer
}) => (
  <div style={{
    height: 'auto',
    width: '200px',
    position: 'fixed',
    top: 70,
    right: 30,
    opacity: .9,
    border: 'solid 1px #ccc',
    borderRadius: '.3em',
    backgroundColor: 'rgba(250, 250, 250, .8)',
    zIndex: 1000
  }}>
    <div style={{ margin: '1em' }}>
      <h3>キーワード</h3>
      <ul style={{ margin: '0 1em 0 0', paddingLeft: '1.5em' }}>
        {
          keywords.map((k: string, i: number) => <li key={i}>{k}</li>)
        }
      </ul>
      <h4 style={{ marginTop: '1em' }}>関連キーワード</h4>
      <ul style={{ margin: '0 .5em .4em 0', paddingLeft: '1.5em' }}>
        {
          relatedQueries.length !== 0 ? (
            relatedQueries.map((query: string, i: number) => {
              return (
                <li key={i} style={{fontSize: '.8em'}}>{query}</li>
              )
            })
          ) : <Icon type='loading' />
        }
      </ul>
    </div>
    <Row id='tools' style={{ marginLeft: '1em' }}>
      <Col span={ isWriter ? 24 : 12}>
        <Button type='default' onClick={save} style={{ margin: '.4em 0'}}>
          <Icon type='save' />保存
        </Button>
      </Col>
      {
        isWriter ? (
          <React.Fragment>
            <Col span={24}>
              <Button onClick={toggleChecking} style={{ margin: '.4em 0'}}>
                <Icon type='check' />提出チェック
              </Button>
            </Col>
            <Button onClick={toggleDrawer} style={{margin: '.3em 0'}}>
              <Icon type='file-image' /> 画像の検索
            </Button>
              <Drawer
              visible={isDrawerVisible}
              onClose={toggleDrawer}
              width={400}
            >
              <SearchImages />
            </Drawer>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Col span={12}>
              <Popconfirm
                title='本当に受理しますか'
                onConfirm={recieve}
              >
                <Button type='primary' style={{margin: '.5em 0'}}>
                  <Icon type='check' /> 受理
                </Button>
              </Popconfirm>
            </Col>
            <Col span={24}>
              <Popconfirm
                title='本当に差し戻しますか'
                onConfirm={reject}
              >
                <Button type='danger' style={{margin: '.5em 0'}}>
                  <Icon type='check' /> 差し戻し
                </Button>
              </Popconfirm>
            </Col>
          </React.Fragment>
        )
      }
      <p style={{width: '100%'}}> 執筆文字数：{countAll}</p>
    </Row>
  </div>
)

export default KeywordBoard
