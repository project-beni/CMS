import * as React from 'react'
import {
  InsertLink,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatBold,
  FormatItalic,
  FormatColorFill,
  Comment
} from '@material-ui/icons'
import { Button, Popconfirm, Row, Col } from 'antd'
const { MegadraftEditor } = require('megadraft')

import './index.css'

const actions = [
  {type: "block", label: "H6", style: "header-six", icon: Comment},
  {type: "separator"},
  {type: "inline", label: "B", style: "BOLD", icon: FormatBold},
  {type: "inline", label: "I", style: "ITALIC", icon: FormatItalic},
  {type: "inline", label: "BACK", style: "BACK", icon: FormatColorFill},
  {type: "block", label: "QT", style: "blockquote", icon: FormatQuote},
  {type: "entity", label: "Link", style: "link", entity: "LINK", icon: InsertLink},

  {type: "separator"},
  {type: "block", label: "UL", style: "unordered-list-item", icon: FormatListBulleted},
  // {type: "block", label: "OL", style: "ordered-list-item", icon: FormatListNumbered},
  {type: "separator"},
  {type: "block", label: "H1", style: "header-one", icon: () => (
    <h1 style={{color: '#fff', lineHeight: '0.7em'}}>大<br/><span style={{fontSize: '0.1em', lineHeight: '0.1em'}}>見出し</span></h1>
  )},
  {type: "block", label: "H2", style: "header-two", icon: () => (
    <h2 style={{color: '#fff', lineHeight: '0.8em'}}>中<br/><span style={{fontSize: '0.1em', lineHeight: '0.1em'}}>見出し</span></h2>
  )},
  {type: "block", label: "H3", style: "header-three", icon: () => (
    <h3 style={{color: '#fff', lineHeight: '0.925em'}}>小<br/><span style={{fontSize: '0.1em', lineHeight: '0.1em'}}>見出し</span></h3>
  )},
  {type: "block", label: "P", style: "paragraph", icon: () => (
    <p style={{color: '#fff', lineHeight: '0.925em'}}>本文</p>
  )}
];

const editArticles: React.SFC<any> = ({
  bodies,
  handleChange,
  recieve,
  reject,
  title,
  comment,
  onChange,
  body,
  save,
  changeComment,
  counts,
  countAll,
  myBlockStyle
}) => {
  return (
    <div style={{
      margin: '100px 50px'
    }}>
      <Row>
        <Col span={3}>
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
        <Col sm={1}></Col>  
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
        }}
      >
        <Row>
          <Col span={6}>
            <Button
              onClick={save}
              style={{margin: '15px'}}
            >保存</Button>
          </Col>
          <Col span={6}>
            <Popconfirm
              title='本当に受理しますか？'
              onConfirm={recieve}
            >
              <Button
                type='primary'
                style={{ margin: '0 15px'}}
              >受理</Button>
            </Popconfirm>
          </Col>
          <Col span={6}>
            <Popconfirm
              title='本当に差し戻しますか？'
              onConfirm={reject}
            >
              <Button
                type='danger'
                style={{ margin: '0 15px'}}
              >差し戻す</Button>
            </Popconfirm>
          </Col>
          <Col span={6}>
            <p>執筆文字数：{countAll}</p>
          </Col>
        </Row>
        
      </div>
    </div>
  )
}

export default editArticles
