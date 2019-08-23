import * as React from 'react'
import { Button, Popconfirm, Checkbox } from 'antd'

import DraftWrapper from './assets/draftWrapper'
import KeywordBoard from './assets/keywordBoard'

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
  return (
    <div style={{ margin: '100px 50px' }} >
      <DraftWrapper
        blockStyleFn={myBlockStyle}
        body={body}
        counts={counts}
        isLineInfo={true}
        isKeywordBoard={true}
        isReadOnly={false}
        onChange={onChange}
      />
      <KeywordBoard
        countAll={countAll}
        isDrawerVisible={isDrawerVisible}
        isWriter={true}
        keywords={keyword}
        relatedQueries={relatedQueries}
        save={save}
        toggleChecking={toggleChecking}
        toggleDrawer={toggleDrawer}
      />
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
            'コピペはしていませんか？'
          ]}
          style={{
            fontSize: '.6em',
            margin: 15
          }}
          onChange={updateCheck}
        />
        <Popconfirm
          title='本当に提出しますか'
          onConfirm={submit}
          disabled={checks!==6}
        >
          <Button
            style={{
              margin: '0 0 15px 15px',
            }}
            disabled={checks!==6}
            type='danger'
          >
            提出する
          </Button>
        </Popconfirm>
      </div>
    </div>
  )
}

export default editArticles
