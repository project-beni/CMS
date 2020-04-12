import * as React from 'react'
import 'megadraft/dist/css/megadraft.css'
import { Button, Drawer, Popconfirm, Icon, Row, Col, Checkbox } from 'antd'
const { MegadraftEditor } = require('megadraft')

import './assets/index.css'
import SearchImages from '../../containers/searchImages'
import Plugins from '../../plugins'
import { writerActions, CustomStyleMap } from './assets/draftProps'
import EachLineInfo from './assets/eachLineInfo'

const editArticles: React.SFC<any> = ({
  onChange,
  body,
  save,
  submit,
  isDrawerVisible,
  toggleDrawer,
  counts,
  countAll,
  myBlockStyle,
  relatedQueries,
  keyword,
  toggleChecking,
  isChecking,
  updateCheck,
  checks
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <div style={{ margin: '100px 50px' }} >
      <Row>
        <Col sm={3}>
          <EachLineInfo counts={counts} />
        </Col>
        <Col span={1}></Col>
        <Col sm={15}>
          <MegadraftEditor
            editorState={body}
            onChange={onChange}
            placeholder='ここから本文'
            actions={writerActions}
            blockStyleFn={myBlockStyle}
            customStyleMap={CustomStyleMap}
            plugins={Plugins}
          />
        </Col>
        <Col span={1}></Col>
        <Col span={4}></Col>
      </Row>
      
      <div
        style={{
          height: 'auto',
          width: '200px',
          position: 'fixed',
          top: 70,
          right: 30,
          opacity: .9,
          border: 'solid 1px #ccc',
          borderRadius: '.3em',
          backgroundColor: 'rgba(250, 250, 250, .8)',
          zIndex: 1000
        }}
      >
        <div
          style={{
            margin: '1em'
          }}
        >
          <h3>キーワード</h3>
          <ul
            style={{
              margin: '0 1em 0 0',
              paddingLeft: '1.5em'
            }}
          >
            {
              keyword.map((k: string, i: number) => <li key={i}>{k}</li>)
            }
          </ul>
          <h4 style={{marginTop: '1em'}}>関連キーワード</h4>
          <ul
            style={{
              margin: '0 .5em .4em 0',
              paddingLeft: '1.5em'
            }}
          >
            {
              relatedQueries.length !== 0 ? (
                relatedQueries.map((query: string, i: number) => {
                  return (
                    <li key={i} style={{fontSize: '.8em'}}>{query}</li>
                  )
                })
              ) : <Icon type='loading' />
            }
          </ul>
          <Row id='tools'>
            <Col span={24} >
              <Button onClick={save} style={{margin: '.4em 0'}}>
                <Icon type='save' /> 保存
              </Button>
            </Col>
            <Col span={24}>
              <Button
                type='default'
                onClick={toggleChecking}
                style={{margin: '.4em 0'}}
              >
                <Icon type='check' /> 提出チェック
              </Button>
            </Col>
            <Button onClick={toggleDrawer} style={{margin: '.3em 0'}}>
              <Icon type='file-image' /> 画像の検索
            </Button>
            <p style={{width: '100%'}}> 執筆文字数：{countAll}</p>
            <Drawer
              visible={isDrawerVisible}
              onClose={toggleDrawer}
              width={400}
            >
              <SearchImages />
            </Drawer>
          </Row>
        </div>
      </div>
      <div
        style={{
          height: 'auto',
          width: 600,
          position: 'fixed',
          bottom: 20,
          right: isChecking ? 20 : -600,
          border: 'solid 1px #ccc',
          borderRadius: '.3em',
          backgroundColor: 'rgba(250, 250, 250, .9)',
          zIndex: 1000
        }}
      >
        <Checkbox.Group
          options={[
            'キーワード、関連キーワードは文中に多く含まれていますか？',
            '見出しごとの文字数の目安は守れていますか？',
            'テキストは2,3行で改行され、空行はありませんか？',
            '大事なポイントは太字、特に重要なポイントは太字+マーカーにしていますか？',
            '誤字脱字、変換ミスはありませんか？',
            'コピペはしていませんか？',
            '本記事のキーワードの検索結果 1位~3位 の記事よりも、読者を満足でき充実した記事と言えますか？',
          ]}
          style={{
            fontSize: '.6em',
            margin: 15
          }}
          onChange={updateCheck}
        />
        <Popconfirm
          title='本当に提出しますか'
          onConfirm={() => {
            setIsLoading(true)
            submit()
          }}
          disabled={checks!==6}
        >
          <Button
            style={{
              margin: '0 0 15px 15px',
            }}
            disabled={checks!==6}
            type='danger'
            loading={isLoading}
          >
            提出する
          </Button>
        </Popconfirm>
      </div>
    </div>
  )
}

export default editArticles
