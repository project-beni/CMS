import * as React from 'react'
import { PlaylistAddRounded } from '@material-ui/icons'
const { insertDataBlock } = require("megadraft")

import constants from './constants'

export default class Table extends React.Component <any> {
  constructor(props: any) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick () {
    const data = {
      type: constants.PLUGIN_TYPE,
      table: [
        [ '', '' ],
        [ '', '' ]
      ]
    }

    this.props.onChange(insertDataBlock(this.props.editorState, data))
  }
  
  render () {
    return (
      <button
        className={this.props.className}
        type="button"
        onClick={this.onClick}
        title={constants.PLUGIN_NAME}
      >
        <PlaylistAddRounded
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
