import * as React from 'react'
import 'megadraft/dist/css/megadraft.css'
import { Button, Drawer, Popconfirm, Icon, Row, Col } from 'antd'
import {
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatBold,
  FormatItalic,
  FormatColorFill
} from '@material-ui/icons';
const { MegadraftEditor } = require('megadraft')
const baseActions = require('megadraft/lib/actions/default')

import './index.css'
import SearchImages from '../../containers/searchImages'
import { backgroundColor } from 'styled-system';

const editArticles: React.SFC<any> = ({
  onChange,
  body,
  save,
  submit,
  isDrawerVisible,
  toggleDrawer,
  counts,
  countAll,
  myBlockStyle,
  relatedQueries,
  keyword
}) => {
  const actions = [
    {type: "inline", label: "B", style: "BOLD", icon: FormatBold},
    {type: "inline", label: "I", style: "ITALIC", icon: FormatItalic},
    {type: "inline", label: "BACK", style: "BACK", icon: FormatColorFill},
    // {type: "block", label: "QT", style: "blockquote", icon: FormatQuote},
    {type: "separator"},
    {type: "block", label: "UL", style: "unordered-list-item", icon: FormatListBulleted},
    // {type: "block", label: "OL", style: "ordered-list-item", icon: FormatListNumbered},
    // {type: "separator"},
    {type: "block", label: "P", style: "paragraph", icon: () => (
      <p style={{color: '#fff', lineHeight: '0.925em'}}>本文</p>
    )}
  ];
  
  
  return (
    <div style={{ margin: '100px 50px' }} >
      <Row>
        <Col sm={3}>
          {
            counts.map((content: any, i: number) => {
              switch (content.type) {
                case 'header-one':
                  return (
                  <p
                  key={i}
                  style={{
                    position: 'absolute',
                    top: content.top + 10
                  }}
                  >150文字以下</p>
                  )
                  break
                case 'header-two':
                  return (
                    <p
                    key={i}
                    style={{
                      position: 'absolute',
                      top: content.top + 5
                    }}
                      >250文字以下</p>
                  )
                  break
                case 'header-three':
                  return (
                    <p
                      key={i}
                      className='header-three'
                      style={{
                        position: 'absolute',
                        top: content.top
                      }}
                    >250文字以下</p>
                  )
                  break
                case 'header-six':
                  return null
                  break
                case 'paragraph':
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        top: content.top
                      }}
                    >{content.count}</div>
                  )
                  break
                case 'twitter-link':
                  return (
                    <div
                      key={i}
                      className='twitter-link'
                      style={{
                        position: 'absolute',
                        top: content.top
                      }}
                    >100文字以下</div>
                  )
                  break
                case 'unordered-list-item':
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        top: content.top + 10
                      }}
                    >{content.count}</div>
                  )
                  break
                default:
                  return null
              }
            })
          }
        </Col>
        <Col span={1}></Col>
        <Col sm={15}>
          <MegadraftEditor
            editorState={body}
            onChange={onChange}
            placeholder='ここから本文'
            actions={actions}
            blockStyleFn={myBlockStyle}
            customStyleMap={{
              'BACK': {
                background: 'linear-gradient(transparent 25%, #fbd 35%)',
                borderRadius: '1px'
              }
            }}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={4}></Col>
      </Row>
      
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
          backgroundColor: 'rgba(250, 250, 250, .8)',
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
                relatedQueries.map((query: string, i: number) => {
                  return (
                    <li key={i} style={{fontSize: '.8em'}}>{query}</li>
                  )
                })
              ) : <Icon type='loading' />
            }
          </ul>
          <Row id='tools'>
            <Col span={12} >
              <Button onClick={save} style={{margin: '.5em 0'}}>
                <Icon type='save' /> 保存
              </Button>
            </Col>
            <Col span={12}>
              <Popconfirm
                title='本当に提出しますか'
                onConfirm={submit}
              >
                <Button type='danger' style={{margin: '.5em 0'}}>
                  <Icon type='check' /> 提出
                </Button>
              </Popconfirm>
            </Col>
            <Button onClick={toggleDrawer} style={{margin: '.5em 0'}}>
              <Icon type='file-image' /> 画像の検索
            </Button>
            <p style={{width: '100%'}}> 執筆文字数：{countAll}</p>
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
