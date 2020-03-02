import * as React from 'react'

export default class Block extends React.Component<any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: this.props.data.src}}
      />
    )
  }
}
