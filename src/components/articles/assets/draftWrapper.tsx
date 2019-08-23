import * as React from 'react'
import { Row, Col } from 'antd'
const { MegadraftEditor } = require('megadraft')

import Plugins from '../../../plugins'
import EachLineInfo from './eachLineInfo'
import { Content } from './eachLineInfo'

import 'megadraft/dist/css/megadraft.css'
import './index.css'

const DraftWrapper: React.SFC<{
  blockStyleFn: any
  body: any
  counts: Content[]
  isLineInfo: boolean
  isKeywordBoard: boolean
  isReadOnly: boolean
  onChange?: Function,
  title?: string
  writer?: string
}> = ({
  blockStyleFn,
  body,
  counts,
  isLineInfo,
  isKeywordBoard,
  isReadOnly,
  onChange,
  title,
  writer
}) => (
  <Row>
    {
      title && writer ? (
        <React.Fragment>
          <Col span={4} />
          <Col span={20}>
            <h1 style={{fontSize: '1.5em'}}>{title}</h1>
            <p>{writer}</p>
          </Col>
        </React.Fragment>
      ) : null
    }
    {
      isLineInfo ? (
        <React.Fragment>
          <Col span={3}>
            <EachLineInfo counts={counts} />
          </Col>
          <Col span={1} />
        </React.Fragment>
      ) : null
    }
    <Col span={isKeywordBoard ? 15 : 20}>
      <MegadraftEditor
        editorState={body}
        plageholder='ここから本文'
        blockStyleFn={blockStyleFn}
        readOnly={isReadOnly}
        onChange={onChange}
        plugins={Plugins}
        customStyleMap={(contentBlock: any) => contentBlock.getType()}
      />
    </Col>
    {
      isKeywordBoard ? <Col span={5} /> : null
    }
  </Row>
)

export default DraftWrapper
