import * as React from 'react'
import C from 'react-contenteditable'
import { Button, Card, Input, Popconfirm } from 'antd'

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

const editArticles: React.SFC<any> = ({
  body,
  handleChange,
  propertyWindow: { x, y, isDisplay },
  recieve,
  reject,
  title,
  comment,
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
      <h1>{title}</h1>
      <C
        html={body}
        tagName={'article'}
        onChange={handleChange}
        disabled={true}
      />
      <TextArea
        rows={4}
        placeholder='差し戻しの場合のコメント'
        onChange={changeComment}
      />
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
