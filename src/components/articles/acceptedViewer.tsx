import * as React from 'react'
import { Button, Icon, Row, Col } from 'antd'
const { MegadraftEditor } = require('megadraft')

import Plugins from '../../plugins'
import './assets/index.css'
import { directorActions, CustomStyleMap } from './assets/draftProps'
import EachLineInfo from './assets/eachLineInfo'

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
          <EachLineInfo counts={counts} />
        </Col>
        <Col sm={1}></Col>  
        <Col sm={20}>
          <MegadraftEditor
            editorState={body}
            onChange={onChange}
            placeholder='ここから本文'
            actions={directorActions}
            blockStyleFn={myBlockStyle}
            customStyleMap={CustomStyleMap}
            plugins={Plugins}
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
