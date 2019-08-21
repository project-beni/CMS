import * as React from 'react'
import { Link } from 'react-router-dom'
import { Badge, Icon, Layout, Menu } from 'antd'

import {
  AccountCircleTwoTone,
  ContactsTwoTone,
  Done,
  Edit,
  FavoriteTwoTone,
  FindInPageTwoTone,
  InputTwoTone,
  LocalOfferTwoTone,
  NoteAddTwoTone,
  VisibilityTwoTone,
  PersonAddTwoTone,
  TodayTwoTone,
  Warning,
  WatchLaterTwoTone,
} from '@material-ui//icons'

const { Sider } = Layout
const { Item } = Menu

const sidebar: React.SFC<any> = ({
  position,
  isAuth,
  badges: { writings, pendings, rejects },
}) => (
  <Sider
    collapsible
    // defaultCollapsed
    theme='light'
  >
    {position === 'writer' ? (
      <Menu
        mode='inline'
        theme='light'
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
      >
        <Item key='2' disabled={position !== 'writer'}>
          <Icon component={() => <FindInPageTwoTone />} />
          <span>募集中</span>
          <Link to='/articles/recruiting' />
        </Item>
        <Item key='3' disabled={position !== 'writer'}>
          <Badge dot={writings} offset={[-8, 0]}>
            <Icon component={() => <Edit />} />
          </Badge>
          <span>受注中</span>
          <Link to='/articles/ordered' />
        </Item>
        <Item key='4' disabled={position !== 'writer'}>
          <Badge dot={pendings} offset={[-8, 0]}>
            <Icon component={() => <WatchLaterTwoTone />} />
          </Badge>
          <span>検品中</span>
          <Link to='/articles/pending' />
        </Item>
        <Item key='5' disabled={position !== 'writer'}>
          <Badge dot={rejects} offset={[-8, 0]}>
            <Icon component={() => <Warning />} style={{ color: '#ff6f00' }} />
          </Badge>
          <span>差し戻し</span>
          <Link to='/articles/rejected' />
        </Item>
        <Item key='6' disabled={position !== 'writer'}>
          <Icon component={() => <Done />} style={{ color: '#2196f3' }} />
          <span>納品済み</span>
          <Link to='/articles/accepted' />
        </Item>
        <Item key='7' disabled={position !== 'writer'}>
          <Icon
            component={() => <FavoriteTwoTone />}
            style={{ color: '#e91e63' }}
          />
          <span>モデル記事</span>
          <Link to='/articles/models' />
        </Item>
        <Item key='11' disabled={!isAuth}>
          <Icon component={() => <InputTwoTone />} />
          <span>ログアウト</span>
          <Link to='/logout' />
        </Item>
      </Menu>
    ) : null}
    {position === 'director' ? (
      <Menu
        mode='inline'
        theme='light'
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
      >
        <Item key='2' disabled={position !== 'director'}>
          <Icon component={() => <FindInPageTwoTone />} />
          <span>募集中</span>
          <Link to='/articles/recruiting' />
        </Item>
        <Item key='6' disabled={position !== 'director'}>
          <Icon component={() => <Done />} />
          <span>受理済</span>
          <Link to='/articles/acceptedList' />
        </Item>
        <Item key='7' disabled={position !== 'director'}>
          <Icon component={() => <NoteAddTwoTone />} />
          <span>発注</span>
          <Link to='/order' />
        </Item>
        <Item key='8' disabled={position !== 'director'}>
          <Icon component={() => <VisibilityTwoTone />} />
          <span>検品</span>
          <Link to='/checkList' />
        </Item>
        <Item key='9' disabled={position !== 'director'}>
          <Icon component={() => <LocalOfferTwoTone />} />
          <span>カテゴリー・タグ</span>
          <Link to='/categoriesAndTags' />
        </Item>
        <Item key='10' disabled={position !== 'director'}>
          <Icon component={() => <ContactsTwoTone />} />
          <span>ライターステータス</span>
          <Link to='/usersList' />
        </Item>
        <Item key='11' disabled={position !== 'director'}>
          <Icon
            component={() => <FavoriteTwoTone style={{ color: '#e91e63' }} />}
          />
          <span>モデル記事</span>
          <Link to='/articles/models' />
        </Item>
        <Item key='12' disabled={position !== 'director'}>
          <Icon component={() => <TodayTwoTone />} />
          <span>TODAY</span>
          <Link to='/summary' />
        </Item>
        <Item key='13' disabled={!isAuth}>
          <Icon component={() => <InputTwoTone />} />
          <span>ログアウト</span>
          <Link to='/logout' />
        </Item>
      </Menu>
    ) : null}
    {position === '' ? (
      <Menu
        mode='inline'
        theme='light'
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
      >
        <Item key='10' disabled={position !== ''}>
          <Icon component={() => <AccountCircleTwoTone />} />
          <span>ログイン</span>
          <Link to='/login' />
        </Item>
        <Item key='12' disabled={position !== ''}>
          <Icon component={() => <PersonAddTwoTone />} />
          <span>新規登録</span>
          <Link to='/signup' />
        </Item>
      </Menu>
    ) : null}
  </Sider>
)

export default sidebar
