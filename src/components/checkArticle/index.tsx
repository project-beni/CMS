import * as React from 'react'
import {
  InsertLink,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatBold,
  FormatItalic
} from '@material-ui/icons'
import { Button, Card, Input, Popconfirm, Row, Col } from 'antd'
const { MegadraftEditor } = require('megadraft')

import './index.css'
import styled from 'styled-components'

const { TextArea } = Input

// import { State, StateUpdates } from '../../containers/editArticle'

const EditButton: React.SFC<any> = ({cmd, arg, name}) => (
  <Button
    onClick={() => document.execCommand(cmd, false, arg)}
  >
    {name || cmd }
  </Button>
)

const actions = [
  {type: "inline", label: "B", style: "BOLD", icon: FormatBold},
  {type: "inline", label: "I", style: "ITALIC", icon: FormatItalic},
  {type: "block", label: "QT", style: "blockquote", icon: FormatQuote},
  // these actions correspond with the entityInputs above
  {type: "entity", label: "Link", style: "link", entity: "LINK", icon: InsertLink},
  // {type: "entity", label: "Page Link", style: "link", entity: "INTERNAL_PAGE_LINK", icon: MyPageLinkIcon},

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
  const PropertyCard = styled(Card)`
    position: fixed;
    bottom: 50px;
    left: 100px;
    width: calc(100% - 200px);
  `
  return (
    <div style={{
      margin: '50px 100px'
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
                        lineHeight: '2em',
                        fontSize: '2em',
                        margin: '1.5em 0'
                      }}
                    >大</h1>
                    )
                    break
                  case 'header-two':
                    return (
                      <h2
                        key={i}
                        style={{
                          lineHeight: '1.5em',
                          fontSize: '1.5em',
                          margin: '1em 0',
                          fontWeight: 400
                        }}
                      >中</h2>
                    )
                    break
                  case 'header-three':
                    return (
                      <h3
                        key={i}
                        style={{
                          lineHeight: '1.2em',
                          fontSize: '1.2em',
                        }}
                      >小</h3>
                    )
                    break
                  case 'paragraph':
                    return (
                      <div
                        key={i}
                        className='paragraph'
                        style={{
                          marginBottom: '1.4em'
                        }}
                      >{content.count}</div>
                    )
                    break
                  case 'unstyled':
                      return <div key={i}>{content.count}</div>
                      break
                  case 'atomic':
                    return (
                      <div
                        key={i}
                        style={{ margin: '25em 0'}}
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
            // readOnly={true}
            // keyBindings={[
            //   {
            //     name: "save",
            //     isKeyBound: (e: any) => {
            //       return e.keyCode === 13
            //     },
            //     action: () => {}}
            // ]}
            // sidebarRendererFn={() => (
            //   <p>asdf</p>
            // )}
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
          style={{marginTop: '50px'}}
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
      {/* <PropertyCard>
        <EditButton cmd='italic' name='斜体' />
        <EditButton cmd='bold'  name='太字' />
        <EditButton cmd='formatBlock' arg='h1' name='タイトル' />
        <EditButton cmd='formatBlock' arg='h2' name='見出し' />
        <EditButton cmd='formatBlock' arg='h3' name='小見出し' />
        <EditButton cmd='formatBlock' arg='p' name='本文' />
      </PropertyCard> */}
    </div>
  )
}

export default editArticles
