import * as React from 'react'
import { Button, Col, Icon, Row } from 'antd'

type Props = {
  countAll: number
  isViewer: boolean
  save?: () => void
  type?: string
  updateType?: ({ type }: { type: 'model' | 'normal' }) => void
}

const MiniWindow: React.SFC<Props> = ({
  countAll,
  isViewer,
  save,
  type,
  updateType
}) => (
  <div
    style={{
      position: 'fixed',
      bottom: 30,
      left: 300,
      width: isViewer ? 'auto' : 600,
      zIndex: 1000,
      backgroundColor: '#eee',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
    }}
  >
    <Row>
      <Col span={isViewer ? 24 : 8}>
        <p style={{margin: 15}}>執筆文字数：{countAll}</p>
      </Col>
      {
        !isViewer && updateType ? (
          <React.Fragment>
            <Col span={8}>
              <Button
                onClick={save}
                style={{margin: '15px'}}
              >保存</Button>
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
          </React.Fragment>
        ) : null
      }
    </Row>
  </div>
)

export default MiniWindow
