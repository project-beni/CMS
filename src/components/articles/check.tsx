import * as React from 'react'
import { Button, Popconfirm, Row, Col, Icon, Drawer, Input } from 'antd'
const { MegadraftEditor } = require('megadraft')

import Plugins from '../../plugins'
import './assets/index.css'
import { directorActions, CustomStyleMap } from './assets/draftProps'
import EachLineInfo from './assets/eachLineInfo'
import SearchImages from '../../containers/searchImages'

const editArticles: React.SFC<any> = ({
  reject,
  recieve,
  onChange,
  body,
  save,
  counts,
  countAll,
  myBlockStyle,
  title,
  writer,
  relatedQueries,
  keyword,
  isDrawerVisible,
  toggleDrawer,
  changeTitle,
  instructions
}) => {
  return (
    <div style={{
      margin: '100px 50px'
    }}>
      <Row>
        <Col span={4}></Col>
        <Col span={20}>
          <Input
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              changeTitle({ title: e.target.value })
            }}
          />
          <p>{writer}</p>
        </Col>
      </Row>
      <Row style={{ marginBottom: 250 }}>
        <Col span={3}>
          <EachLineInfo counts={counts} />
        </Col>
        <Col sm={1}></Col>  
        <Col sm={15}>
          <MegadraftEditor
            editorState={body}
            onChange={onChange}
            placeholder='ここから本文'
            actions={directorActions}
            blockStyleFn={myBlockStyle}
            customStyleMap={CustomStyleMap}
            plugins={Plugins}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={4}></Col>
      </Row>
      <div
        style={{
          height: '200px',
          width: 700,
          position: 'fixed',
          overflow: 'scroll',
          bottom: 20,
          left: 220,
          opacity: 1,
          border: 'solid 1px #ccc',
          borderRadius: '.3em',
          backgroundColor: 'rgba(250, 250, 250, .95)',
          zIndex: 1000,
          padding: '30px 0px'
        }}
      >
        {
          instructions.length ? (
            instructions.map((a: any) => {
              switch (a.type) {
                case 'header-one':
                  return <h2 style={{ marginLeft: 10 }}>○{a.text}</h2>
                  break
                case 'header-two':
                  return <h3 style={{ marginLeft: 20 }}>●{a.text}</h3>
                  break
                case 'header-three':
                  return <h4 style={{ marginLeft: 40 }}>・{a.text}</h4>
                  break
                case 'paragraph':
                  return <p style={{ marginLeft: 60 }}>{a.text}</p>
                  break
                default:
                  return null
              }
            })
          ) : (
            <React.Fragment>
              指示文を読み込み中
              <Icon type='loading' />
            </React.Fragment>
          )
        }
      </div>
      <div
        style={{
          height: 'auto',
          width: '200px',
          position: 'fixed',
          top: 80,
          right: 30,
          opacity: .9,
          border: 'solid 1px #ccc',
          borderRadius: '.3em',
          backgroundColor: 'rgba(250, 250, 250, .95)',
          zIndex: 1000
        }}
      >
        <div
          style={{
            margin: '1em'
          }}
        >
          <h3>キーワード</h3>
          <ul
            style={{
              margin: '0 1em 0 0',
              paddingLeft: '1.5em'
            }}
          >
            {
              keyword.map((k: string, i: number) => <li key={i}>{k}</li>)
            }
          </ul>
          <h4 style={{marginTop: '1em'}}>関連キーワード</h4>
          <ul
            style={{
              margin: '0 .5em 1em 0',
              paddingLeft: '1.5em'
            }}
          >
            {
              relatedQueries.length !== 0 ? (
                relatedQueries.length !== 1 ? (
                  relatedQueries.map((query: string, i: number) => {
                    return (
                      <li key={i} style={{fontSize: '.8em'}}>{query}</li>
                    )
                  })
                ) : (
                  relatedQueries.map((query: string, i: number) => {
                    return (
                      <li key={i} style={{fontSize: '.8em'}}>
                        <a href={`https://www.google.com/search?q=${query}`} target='_blank'>
                          こちらから確認してください
                        </a>
                      </li>
                    )
                  })
                )
              ) : <Icon type='loading' />
            }
          </ul>
          <Row id='tools'>
            <Col span={24} >
              <Button onClick={save} style={{margin: '.5em 0'}}>
                <Icon type='save' /> 保存
              </Button>
            </Col>
            <Col span={24} >
              <Button onClick={toggleDrawer} style={{margin: '.5em 0'}}>
                <Icon type='file-image' /> 画像の検索
              </Button>
            </Col>
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
            <Col span={24}>
              <p style={{width: '100%'}}> 執筆文字数：{countAll}</p>
            </Col>
            <Drawer
              visible={isDrawerVisible}
              onClose={toggleDrawer}
              width={400}
            >
              <SearchImages />
            </Drawer>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default editArticles
