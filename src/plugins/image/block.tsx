import * as React from "react"

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
      <img
        src={this.props.data.src}
        alt=""
        style={{
          width: '100%'
        }}
      />
    )
  }
}
