import * as React from 'react'
import {
  Title,
  InsertLink,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatBold,
  FormatItalic
} from '@material-ui/icons'
import { Button, Card, Input, Popconfirm } from 'antd'
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
  changeComment
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
      <MegadraftEditor
        editorState={body}
        onChange={onChange}
        placeholder='ここから本文'
        actions={actions}
        // sidebarRendererFn={() => (
        //   <p>asdf</p>
        // )}
      />
      {/* <TextArea
        rows={4}
        placeholder='差し戻しの場合のコメント'
        onChange={changeComment}
      /> */}
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
