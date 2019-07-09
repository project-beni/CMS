import * as React from 'react'
import 'megadraft/dist/css/megadraft.css'
import { Button, Card, Popconfirm, Drawer, Icon } from 'antd'
import {
  Title,
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

const editArticles: React.SFC<any> = ({
  onChange,
  body,
  save,
  submit
}) => {
  const customActions = baseActions.default.concat([
    {type: "inline", label: "U", style: "UNDERLINE", icon: FormatUnderlined}
  ]);
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
  
  
  return (
    <div
      style={{
        margin: '100px 200px'
      }}
    >
      <MegadraftEditor
        editorState={body}
        onChange={onChange}
        placeholder='ここから本文'
        actions={actions}
        // sidebarRendererFn={() => (
        //   <p>asdf</p>
        // )}
      />
      <Button
        onClick={save}
        style={{marginTop: '50px'}}
      >保存</Button>
      <Popconfirm
        title='本当に提出しますか'
        onConfirm={submit}
      >
        <Button
          type='danger'
          style={{marginTop: '50px'}}
        >提出</Button>
      </Popconfirm>
    </div>
  )
}

export default editArticles
