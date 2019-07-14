import * as React from 'react'
import {
  InsertLink,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatBold,
  FormatItalic,
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
  {type: "block", label: "QT", style: "blockquote", icon: FormatQuote},
  {type: "entity", label: "Link", style: "link", entity: "LINK", icon: InsertLink},

  {type: "separator"},
  {type: "block", label: "UL", style: "unordered-list-item", icon: FormatListBulleted},
  {type: "block", label: "OL", style: "ordered-list-item", icon: FormatListNumbered},
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
  {type: "block", label: "P", style: "main", icon: () => (
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
  counts
}) => {
  return (
    <div style={{
      margin: '100px 200px'
    }}>
      <Row>
        <Col sm={1}>
          <div className='megadraft' id='counts' style={{ marginTop: '3em' }}>
          {
              counts.map((content: any, i: number) => {
                switch (content.type) {
                  case 'header-one':
                    return (
                    <h1
                    key={i}
                      style={{
                        lineHeight: `${content.height}px`,
                        marginTop: content.marginTop,
                        marginBottom: content.marginBottom,
                        color: '#ddd'
                      }}
                    >大</h1>
                    )
                    break
                  case 'header-two':
                    return (
                      <h2
                      key={i}
                      style={{
                        lineHeight: `${content.height}px`,
                        marginTop: '16px',
                        marginBottom: content.marginBottom,
                        color: '#ddd'
                      }}
                        >中</h2>
                    )
                    break
                  case 'header-three':
                    return (
                      <h3
                        key={i}
                        style={{
                          lineHeight: `${content.height}px`,
                          marginTop: content.marginTop,
                          marginBottom: content.marginBottom,
                          color: '#ddd'
                        }}
                      >小</h3>
                    )
                    break
                  case 'header-six':
                    return (
                      <h6
                        key={i}
                        style={{
                          lineHeight: `${content.height}px`,
                          marginTop: content.marginTop,
                          marginBottom: content.marginBottom,
                          color: '#f44'
                        }}
                      >コ</h6>
                    )
                    break
                  case 'paragraph':
                    return (
                      <div
                        key={i}
                        className='paragraph'
                        style={{
                          lineHeight: `${content.height}px`,
                          marginTop: content.marginTop,
                          marginBottom: content.marginBottom
                        }}
                      >{content.count}</div>
                    )
                    break
                  case 'unstyled':
                      return (
                        <div
                          key={i}
                          style={{
                            lineHeight: `${content.height}px`,
                            marginTop: content.marginTop,
                            marginBottom: content.marginBottom,
                            color: '#ddd'
                          }}
                        >{content.count}</div>
                      )
                      break
                  case 'atomic':
                    return (
                      <div
                        key={i}
                        style={{
                          lineHeight: `${content.height}px`,
                          marginTop: content.marginTop,
                          marginBottom: content.marginBottom,
                          color: '#ddd'
                        }}
                      >画像</div>
                    )
                    break   
                  default:
                    return null
                }
              })
            }
          </div>
        </Col>
        <Col span={3}></Col>
        <Col sm={20}>
          <MegadraftEditor
            editorState={body}
            onChange={onChange}
            placeholder='ここから本文'
            actions={actions}
          />
        </Col>
      </Row>
      <div
        style={{
          position: 'fixed',
          bottom: 30,
          left: 300,
          zIndex: 1000,
          backgroundColor: '#eee',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
        }}
      >
        <Button
          onClick={save}
          style={{margin: '15px'}}
        >保存</Button>
        <Popconfirm
          title='本当に受理しますか？'
          onConfirm={recieve}
        >
          <Button
            type='primary'
            style={{ margin: '0 15px'}}
          >受理</Button>
        </Popconfirm>
        <Popconfirm
          title='本当に差し戻しますか？'
          onConfirm={reject}
        >
          <Button
            type='danger'
            style={{ margin: '0 15px'}}
          >差し戻す</Button>
        </Popconfirm>
      </div>
    </div>
  )
}

export default editArticles
