import * as React from 'react'

import { Styles } from './draftProps'

export type Content = {
  type: Styles
  top: number
  count: number
}
type Props = {
  counts: Content[]
}

const EachLineInfo: React.FC<Props> = ({ counts }) => (
  <React.Fragment>
    {
      counts.map((content: Content, i: number) => {
        switch (content.type) {
          case 'header-one':
            return (
            <p
            key={i}
            style={{
              position: 'absolute',
              top: content.top + 10
            }}
            >150文字以下</p>
            )
            break
          case 'header-two':
            return (
              <p
              key={i}
              style={{
                position: 'absolute',
                top: content.top + 5
              }}
                >250文字以下</p>
            )
            break
          case 'header-three':
            return (
              <p
                key={i}
                className='header-three'
                style={{
                  position: 'absolute',
                  top: content.top
                }}
              >250文字以下</p>
            )
            break
          case 'header-six':
            return null
            break
          case 'paragraph':
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: content.top
                }}
              >{content.count}</div>
            )
            break
          case 'twitter-link':
            return (
              <div
                key={i}
                className='twitter-link'
                style={{
                  position: 'absolute',
                  top: content.top,
                  borderLeft: 'solid 3px #00acee'
                }}
              >100文字以下</div>
            )
            break
          case 'outside-link':
            return (
              <div
                key={i}
                className='outside-link'
                style={{
                  position: 'absolute',
                  top: content.top
                }}
              >外</div>
            )
            break
          case 'unordered-list-item':
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: content.top + 10
                }}
              >{content.count}</div>
            )
            break
          case 'table':
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: content.top + 10
                }}
              >{content.count}</div>
            )
            break
          default:
            return null
        }
      })
    }
  </React.Fragment>
)

export default EachLineInfo
