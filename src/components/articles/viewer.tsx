import * as React from 'react'

import DraftWrapper from './assets/draftWrapper'
import MiniWindow from './assets/miniWindow'

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
      <DraftWrapper
        blockStyleFn={myBlockStyle}
        body={body}
        counts={counts}
        isLineInfo={true}
        isKeywordBoard={false}
        isReadOnly={true}
      />
      <MiniWindow
        countAll={countAll}
        isViewer={true}
      />
    </div>
  )
}

export default ArticleViewer
