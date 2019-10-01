import * as React from 'react'

export default class Block extends React.Component<any> {
  constructor(props: any) {
    super(props)
    this._handleEdit = this._handleEdit.bind(this)
  }

  _handleEdit() {
    alert(JSON.stringify(this.props.data, null, 4))
  }

  render() {
    return (
      <a
        href={this.props.data.src}
        target='_blank'
      >{this.props.data.src}</a>
    )
  }
}
