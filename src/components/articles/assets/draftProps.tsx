import * as React from 'react'
import {
  InsertLink,
  FormatListBulleted,
  FormatQuote,
  FormatColorFill,
  Comment,
  OpenInNewTwoTone
} from '@material-ui/icons'
import { Icon } from 'antd'

type BlockLabel = 'H1' | 'H2' | 'H3' | 'H6' | 'P' | 'QT' | 'UL' | 'twitter-link' | 'outside-link'
type BlockStyle = 'header-one' | 'header-two' | 'header-three' | 'header-six' | 'paragraph' | 'blockquote' | 'unordered-list-item' | 'table'

type InlineLabel = 'Link' | 'Back'
type InlineStyle = 'link' | 'twitter-link' | 'outside-link' | 'inside-link' | 'BACK'

export type Styles = BlockStyle | InlineStyle
type Actions = {
  type: 'inline' | 'block' | 'separator' | 'entity'
  label?:  BlockLabel | InlineLabel
  style?: Styles
  icon?: any
  entity?: 'LINK'
}

const baseActions: Actions[] = [
  { type: 'inline', label: 'Back', style: 'BACK', icon: FormatColorFill },
  { type: 'separator' },
  { type: 'block', label: 'QT', style: 'blockquote', icon: FormatQuote },
  { type: 'block', label: 'UL', style: 'unordered-list-item', icon: FormatListBulleted },
  {
    type: 'block',
    label: 'P',
    style: 'paragraph',
    icon: () => (
      <p style={{color: '#fff', lineHeight: '0.925em'}}>本文</p>
    )
  }
]

export const writerActions = baseActions

export const directorActions: Actions[] = [
  { type: 'block', label: 'H6', style: 'header-six', icon: Comment },
  { type: 'separator' },
  ...baseActions,
  { type: 'entity', label: 'Link', style: 'link', entity: 'LINK', icon: InsertLink },
  { type: 'separator' },
  { type: 'block', label: 'twitter-link', style: 'twitter-link', icon: () => (<Icon type='twitter' />) },
  { type: 'block', label: 'outside-link', style: 'outside-link', icon: OpenInNewTwoTone },
  { type: 'separator' },
  {
    type: 'block',
    label: 'H1',
    style: 'header-one',
    icon: () => (
      <h1 
        style={{ color: '#fff', lineHeight: '0.7em' }}
      >
        大<br/><span style={{ fontSize: '0.1em', lineHeight: '0.1em' }}>見出し</span>
      </h1>
    )
  },
  {
    type: 'block',
    label: 'H2',
    style: 'header-two',
    icon: () => (
      <h2
        style={{ color: '#fff', lineHeight: '0.8em' }}
      >
        中<br/><span style={{ fontSize: '0.1em', lineHeight: '0.1em' }}>見出し</span>
      </h2>
    )
  },
  {
    type: 'block',
    label: 'H3',
    style: 'header-three', 
    icon: () => (
      <h3
        style={{ color: '#fff', lineHeight: '0.925em' }}
      >
        小<br/><span style={{ fontSize: '0.1em', lineHeight: '0.1em' }}>見出し</span>
      </h3>
    )
  }
]

export const CustomStyleMap = {
  'BACK': {
    background: 'linear-gradient(transparent 25%, #fbd 35%)',
    borderRadius: '1px',
    fontWeight: 800
  }
}
