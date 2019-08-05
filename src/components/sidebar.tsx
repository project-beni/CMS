import * as React from 'react'
import { Link } from 'react-router-dom'
import { Badge, Icon, Layout, Menu } from 'antd'
import { Group } from '@material-ui/icons'


const { Sider } = Layout
const { Item } = Menu

const sidebar: React.SFC<any> = ({
  position,
  isAuth,
  badges: {
    writings,
    pendings,
    rejects
  }
}) => (
  <Sider
    collapsible
    // defaultCollapsed
    theme='light'
  >
    {
      position === 'writer' ? (
        <Menu
          mode='inline'
          theme='light'
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
        >
          <Item key='2' disabled={position!=='writer'}>
            <Icon type='file-search' />
            <span>募集中</span>
            <Link to='/articles/recruiting' />
          </Item>
          <Item key='3' disabled={position!=='writer'}>
            <Badge dot={writings} offset={[ -8, 0 ]} >
              <Icon type='edit' />
            </Badge>
            <span>受注中</span>
            <Link to='/articles/ordered' />
          </Item>
          <Item key='4' disabled={position!=='writer'}>
            <Badge dot={pendings} offset={[ -8, 0 ]} >
              <Icon type='clock-circle' />
            </Badge>
            <span>検品中</span>
            <Link to='/articles/pending' />
          </Item>
          <Item key='5' disabled={position!=='writer'}>
            <Badge dot={rejects} offset={[ -8, 0 ]} >
              <Icon type='stop' />
            </Badge>
            <span>差し戻し</span>
            <Link to='/articles/rejected' />
          </Item>
          <Item key='6' disabled={position!=='writer'}>
            <Icon type='check' />
            <span>納品済み</span>
            <Link to='/articles/accepted' />
          </Item>
          <Item key='7' disabled={position!=='writer'}>
            <Icon type='check-circle' />
            <span>モデル記事</span>
            <Link to='/articles/models' />
          </Item>
          <Item key='11' disabled={!isAuth}>
            <Icon type='logout' />
            <span>ログアウト</span>
            <Link to='/logout' />
          </Item>
        </Menu>
      ) : null
    }
    {
      position === 'director' ? (
        <Menu
          mode='inline'
          theme='light'
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
        >
          <Item key='2' disabled={position!=='director'}>
            <Icon type='file-search' />
            <span>募集中</span>
            <Link to='/articles/recruiting' />
          </Item>
          <Item key='6' disabled={position!=='director'}>
            <Icon type='check' />
            <span>受理済</span>
            <Link to='/articles/acceptedList' />
          </Item>
          <Item key='7' disabled={position!=='director'}>
            <Icon type='file-add' />
            <span>発注</span>
            <Link to='/order' />
          </Item>
          <Item key='8' disabled={position!=='director'}>
            <Icon type='eye' />
            <span>検品</span>
            <Link to='/checkList' />
          </Item>
          <Item key='9' disabled={position!=='director'}>
            <Icon type='tags' />
            <span>カテゴリー・タグ</span>
            <Link to='/categoriesAndTags' />
          </Item>
          <Item key='10' disabled={position!=='director'}>
            <Icon type='idcard' />
            <span>ライターステータス</span>
            <Link to='/usersList' />
          </Item>
          <Item key='11' disabled={position!=='director'}>
            <Icon type='check-circle' />
            <span>モデル記事</span>
            <Link to='/articles/models' />
          </Item>
          <Item key='12' disabled={!isAuth}>
            <Icon type='logout' />
            <span>ログアウト</span>
            <Link to='/logout' />
          </Item>
        </Menu>
      ) : null
    }
    {
      position === '' ? (
        <Menu
          mode='inline'
          theme='light'
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
        >
          <Item key='10' disabled={position!==''}>
            <Icon type='login' />
            <span>ログイン</span>
            <Link to='/login' />
          </Item>
          <Item key='12' disabled={position!==''}>
            <Icon type='user-add' />
            <span>新規登録</span>
            <Link to='/signup' />
          </Item>
        </Menu>
      ) : null
    }
  </Sider>
)

export default sidebar
