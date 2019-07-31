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

const editArticles: React.SFC<any> = ({
  onChange,
  body,
  save,
  submit,
  isDrawerVisible,
  toggleDrawer,
  counts,
  countAll,
  myBlockStyle
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
                  >150文字程度</p>
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
                      >250文字程度</p>
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
                    >250文字程度</p>
                  )
                  break
                case 'header-six':
                  return null
                  break
                case 'paragraph':
                  return (
                    <div
                      key={i}
                      className='paragraph'
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
                    >100文字程度</div>
                  )
                  break
                default:
                  return null
              }
            })
          }
        </Col>
        <Col span={1}></Col>
        <Col sm={20}>
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
      </Row>
      <div
        style={{
          position: 'fixed',
          bottom: 30,
          left: 300,
          width: 600,
          zIndex: 1000,
          backgroundColor: '#eee',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
        }}>
          <Row style={{ margin: 10 }}>
            <Col span={6}>
              <Button onClick={save} >
                <Icon type='save' /> 保存
              </Button>
            </Col>
            <Col span={6}>
              <Popconfirm
                title='本当に提出しますか'
                onConfirm={submit}
              >
                <Button type='danger'>
                  <Icon type='check' /> 提出
                </Button>
              </Popconfirm>
            </Col>
            <Col span={6}>
              <Button onClick={toggleDrawer} >
                <Icon type='file-image' /> 画像の検索
              </Button>
            </Col>
            <Col span={6}>
              <p>執筆文字数：{countAll}</p>
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
  )
}

export default editArticles
