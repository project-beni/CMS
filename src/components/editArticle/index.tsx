import * as React from 'react'
import 'megadraft/dist/css/megadraft.css'
import { Button, Drawer, Popconfirm, Icon, Row, Col } from 'antd'
import {
  InsertLink,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatBold,
  FormatItalic
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
  counts
}) => {
  const customActions = baseActions.default.concat([
    {type: "inline", label: "U", style: "UNDERLINE", icon: FormatUnderlined}
  ]);
  const actions = [
    {type: "inline", label: "B", style: "BOLD", icon: FormatBold},
    {type: "inline", label: "I", style: "ITALIC", icon: FormatItalic},
    {type: "block", label: "QT", style: "blockquote", icon: FormatQuote},
    // these actions correspond with the entityInputs above
    // {type: "entity", label: "Link", style: "link", entity: "LINK", icon: InsertLink},
    // {type: "entity", label: "Page Link", style: "link", entity: "INTERNAL_PAGE_LINK", icon: MyPageLinkIcon},
  
    {type: "separator"},
    {type: "block", label: "UL", style: "unordered-list-item", icon: FormatListBulleted},
    {type: "block", label: "OL", style: "ordered-list-item", icon: FormatListNumbered},
    // {type: "separator"},
    // {type: "block", label: "H1", style: "header-one", icon: () => (
    //   <h1 style={{color: '#fff', lineHeight: '0.7em'}}>大<br/><span style={{fontSize: '0.1em', lineHeight: '0.1em'}}>見出し</span></h1>
    // )},
    // {type: "block", label: "H2", style: "header-two", icon: () => (
    //   <h2 style={{color: '#fff', lineHeight: '0.8em'}}>中<br/><span style={{fontSize: '0.1em', lineHeight: '0.1em'}}>見出し</span></h2>
    // )},
    // {type: "block", label: "H3", style: "header-three", icon: () => (
    //   <h3 style={{color: '#fff', lineHeight: '0.925em'}}>小<br/><span style={{fontSize: '0.1em', lineHeight: '0.1em'}}>見出し</span></h3>
    // )},
    // {type: "block", label: "P", style: "main", icon: () => (
    //   <p style={{color: '#fff', lineHeight: '0.925em'}}>本文</p>
    // )}
  ];
  
  
  return (
    <div
      style={{
        margin: '100px 200px'
      }}
    >
      <Row>
        <Col sm={1}>
          <div className='megadraft' id='counts' style={{ marginTop: '3em' }}>
            {
              counts.map((content: any) => {
                switch (content.type) {
                  case 'header-one':
                    return (
                    <h1
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
                        className='paragraph'
                        style={{
                          marginBottom: '1.4em'
                        }}
                      >{content.count}</div>
                    )
                    break
                  case 'unstyled':
                      return <div>{content.count}</div>
                      break
                  case 'atomic':
                    return (
                      <div
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
          style={{ margin: 10}}
        >
          <Icon type='save' /> 保存
        </Button>
        <Popconfirm
          title='本当に提出しますか'
          onConfirm={submit}
        >
          <Button
            type='danger'
            style={{ margin: 10}}
          >
            <Icon type='check' /> 提出
          </Button>
        </Popconfirm>
        <Button
          onClick={toggleDrawer}
          style={{
            margin: '10',
            // borderLeft: 'solid 1px #666'
          }}
        >
          <Icon type='file-image' /> 画像の検索
        </Button>
        <Drawer
          visible={isDrawerVisible}
          onClose={toggleDrawer}
          width={400}
          >
            <SearchImages />
          </Drawer>
      </div>
    </div>
  )
}

export default editArticles
