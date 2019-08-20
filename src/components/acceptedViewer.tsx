import * as React from 'react'
import {
  InsertLink,
  FormatListBulleted,
  FormatQuote,
  FormatBold,
  FormatItalic,
  FormatColorFill,
  Comment
} from '@material-ui/icons'
import { Button, Icon, Row, Col } from 'antd'
const { MegadraftEditor } = require('megadraft')

import tablePlugin from '../plugins/table'
import imagePlugin from '../plugins/image'
import './editArticle/index.css'

const actions = [
  {type: "block", label: "H6", style: "header-six", icon: Comment},
  {type: "separator"},
  {type: "inline", label: "I", style: "ITALIC", icon: FormatItalic},
  {type: "inline", label: "BACK", style: "BACK", icon: FormatColorFill},
  {type: "block", label: "QT", style: "blockquote", icon: FormatQuote},
  {type: "entity", label: "Link", style: "link", entity: "LINK", icon: InsertLink},

  {type: "separator"},
  {type: "block", label: "UL", style: "unordered-list-item", icon: FormatListBulleted},
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

const AcceptedViewer: React.SFC<any> = ({
  onChange,
  body,
  save,
  counts,
  countAll,
  myBlockStyle,
  type,
  updateType
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
                case 'table':
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
                borderRadius: '1px',
                fontWeight: 800
              }
            }}
            plugins={[ tablePlugin, imagePlugin ]}
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
          <Col span={8}>
            <Button
              onClick={save}
              style={{margin: '15px'}}
            >保存</Button>
          </Col>
          <Col span={8}>
            <p style={{margin: 15}}>執筆文字数：{countAll}</p>
          </Col>
          <Col span={8}>
              <Button
                onClick={() => {
                  type === 'normal' ? updateType({ type: 'model' }) : updateType({ type: 'normal'})
                }}
                disabled={!type}
                style={{margin: '15px'}}
              >
                {
                  type === 'normal' ? 'モデル記事に設定する' : (
                    type === 'model' ? 'モデル記事から解除する': <Icon type='loading'/>
                  )
                }
              </Button>
            </Col>
        </Row>
        
      </div>
    </div>
  )
}

export default AcceptedViewer
