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
import { Button, Popconfirm, Row, Col, Icon } from 'antd'
const { MegadraftEditor } = require('megadraft')


import tablePlugin from '../../plugins/table'
import imagePlugin from '../../plugins/image'
import '../editArticle/index.css'

const actions = [
  {type: "block", label: "H6", style: "header-six", icon: Comment},
  {type: "separator"},
  {type: "inline", label: "I", style: "ITALIC", icon: FormatItalic},
  {type: "inline", label: "BACK", style: "BACK", icon: FormatColorFill},
  {type: "entity", label: "Link", style: "link", entity: "LINK", icon: InsertLink},

  {type: "separator"},
  {type: "block", label: "QT", style: "blockquote", icon: FormatQuote},
  {type: "block", label: "twitter", style: "twitter-link", icon: () => (<Icon type='twitter' />)},
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
  keyword
}) => {
  return (
    <div style={{
      margin: '100px 50px'
    }}>
      <Row>
        <Col span={4}></Col>
        <Col span={20}>
          <h1 style={{fontSize: '1.5em'}}>{title}</h1>
          <p>{writer}</p>
        </Col>
      </Row>
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
                        top: content.top,
                        borderLeft: 'solid 3px #00acee'
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
                borderRadius: '1px',
                fontWeight: 800
              }
            }}
            plugins={[ tablePlugin, imagePlugin ]}
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
            <Col span={12} >
              <Button onClick={save} style={{margin: '.5em 0'}}>
                <Icon type='save' /> 保存
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
          </Row>
        </div>
      </div>
    </div>
  )
}

export default editArticles
