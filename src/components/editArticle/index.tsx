import * as React from 'react'
import C from 'react-contenteditable'
import { Button, Card, Popconfirm, Drawer } from 'antd'

import './index.css'
import styled from 'styled-components';

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
  save,
  submit,
  title,
  comment
}) => {
  const PropertyCard = styled(Card)`
    position: fixed;
    bottom: 50px;
    left: 250px;
    width: calc(100% - 300px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
  `
  return (
    <div style={{
      margin: '50px 100px 250px 100px',
    }}>
      <h1>{title}</h1>
      <C
        html={body}
        tagName={'article'}
        onChange={handleChange}
      />
      <PropertyCard>
        <EditButton cmd='italic' name='斜体' />
        <EditButton cmd='bold'  name='太字' />
        {/* <EditButton cmd='formatBlock' arg='h1' name='タイトル' /> */}
        <EditButton cmd='formatBlock' arg='h2' name='見出し' />
        <EditButton cmd='formatBlock' arg='h3' name='小見出し' />
        <EditButton cmd='formatBlock' arg='p' name='本文' />
        <Button
          onClick={save}
          style={{ margin: '0 15px'}}
          type='primary'
        >保存する</Button>
        <Popconfirm
          title='本当に提出しますか？（取り消しはできません）'
          onConfirm={submit}
        >
          <Button
            style={{ margin: '0 15px'}}
            type='danger'
          >
            提出する
          </Button>
        </Popconfirm>
        <h3>差し戻しのコメント</h3>
        <p>{comment}</p>
        {/* {
          comment ? (
            <React.Fragment>
              <Button></Button>
              <Drawer closable={true}>
                <p>{comment}</p>
              </Drawer>
            </React.Fragment>
          ): null
        } */}
      </PropertyCard>
    </div>
  )
}

export default editArticles
