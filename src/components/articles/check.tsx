import * as React from 'react'

import DraftWrapper from './assets/draftWrapper'
import KeywordBoard from './assets/keywordBoard'

const editArticles: React.SFC<any> = ({
  reject,
  recieve,
  onChange,
  body,
  save,
  counts,
  countAll,
  myBlockStyle,
  title,
  writer,
  relatedQueries,
  keyword
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
        isKeywordBoard={true}
        isReadOnly={false}
        onChange={onChange}
        title={title}
        writer={writer}
      />
      <KeywordBoard
        countAll={countAll}
        isWriter={false}
        keywords={keyword}
        recieve={recieve}
        reject={reject}
        relatedQueries={relatedQueries}
        save={save}
      />
    </div>
  )
}

export default editArticles
