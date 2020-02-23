import * as React from 'react'
import { message } from 'antd';
import { ImageRounded } from '@material-ui/icons'
const { insertDataBlock } = require('megadraft')

import constants from './constants'

export default class Table extends React.Component <any> {
  constructor(props: any) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick () {
    const src = window.prompt('画像のURLを貼り付けてください')
    if (!src) return
    if (!/unsplash/.test(src)) {
      message.error('指定された画像を使用してください');
      return
    }
    const data = {
      type: constants.PLUGIN_TYPE,
      src
    }

    this.props.onChange(insertDataBlock(this.props.editorState, data))
  }
  
  render () {
    return (
      <button
        className={this.props.className}
        type='button'
        onClick={this.onClick}
        title={constants.PLUGIN_NAME}
      >
        <ImageRounded
          style={{
            position: 'absolute',
            top: 4,
            left: 4
          }}
        />
      </button>
    )
  }
}
