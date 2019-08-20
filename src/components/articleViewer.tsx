import * as React from 'react'
import { Row, Col } from 'antd'
const { MegadraftEditor } = require('megadraft')

import tablePlugin from '../plugins/table'
import imagePlugin from '../plugins/image'
import './editArticle/index.css'

const ArticleViewer: React.SFC<any> = ({
  body,
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
                  case 'blockquote':
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
            placeholder='ここから本文'
            blockStyleFn={myBlockStyle}
            readOnly={true}
            plugins={[ tablePlugin, imagePlugin ]}
          />
        </Col>
      </Row>
      <div
        style={{
          position: 'fixed',
          bottom: 30,
          left: 300,
          width: 300,
          zIndex: 1000,
          backgroundColor: '#eee',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
        }}
      >
        <Row>
          <Col span={24}>
            <p style={{margin: 15}}>執筆文字数：{countAll}</p>
          </Col>
        </Row>
        
      </div>
    </div>
  )
}

export default ArticleViewer
