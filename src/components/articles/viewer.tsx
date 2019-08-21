import * as React from 'react'
import { Row, Col } from 'antd'
const { MegadraftEditor } = require('megadraft')

import Plugins from '../../plugins'
import './assets/index.css'
import { CustomStyleMap } from './assets/draftProps'
import EachLineInfo from './assets/eachLineInfo'

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
          <EachLineInfo counts={counts} />
        </Col>
        <Col sm={1}></Col>  
        <Col sm={20}>
          <MegadraftEditor
            editorState={body}
            placeholder='ここから本文'
            blockStyleFn={myBlockStyle}
            readOnly={true}
            plugins={Plugins}
            customStyleMap={CustomStyleMap}
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
