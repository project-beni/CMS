import * as React from 'react'

import DraftWrapper from './assets/draftWrapper'
import MiniWindow from './assets/miniWindow'

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
      <DraftWrapper
        blockStyleFn={myBlockStyle}
        body={body}
        counts={counts}
        isLineInfo={true}
        isKeywordBoard={false}
        isReadOnly={false}
        onChange={onChange}
      />
      <MiniWindow
        countAll={countAll}
        isViewer={false}
        save={save}
        type={type}
        updateType={updateType}
      />
    </div>
  )
}

export default AcceptedViewer
