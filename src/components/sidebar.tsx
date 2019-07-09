import * as React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Icon, Layout, Menu } from 'antd'


const { Sider } = Layout
const { Item } = Menu

const sidebar: React.SFC<any> = ({ position, isAuth }) => (
  <Sider
    collapsible
    // defaultCollapsed
    theme='light'
  >
    <Menu
      mode='inline'
      theme='light'
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
    >
      {/* <Item key='1'>
        <Icon type='home' />
        <span>ホーム</span>
        <Link to='/' />
      </Item> */}
      <Item key='2' disabled={position!=='writer'}>
        <Icon type='file-search' />
        <span>募集中</span>
        <Link to='/articles/recruiting' />
      </Item>
      <Item key='3' disabled={position!=='writer'}>
        <Icon type='edit' />
        <span>受注中</span>
        <Link to='/articles/ordered' />
      </Item>
      <Item key='4' disabled={position!=='writer'}>
        <Icon type='clock-circle' />
        <span>検品中</span>
        <Link to='/articles/pending' />
      </Item>
      <Item key='5' disabled={position!=='writer'}>
        <Icon type='stop' />
        <span>差し戻し</span>
        <Link to='/articles/rejected' />
      </Item>
      <Item key='6' disabled={position!=='writer'}>
        <Icon type='check' />
        <span>納品済み</span>
        <Link to='/articles/accepted' />
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
      {/* <Item key='5'>
        <Icon type='user' />
        <span>マイページ</span>
        <Link to='/mypage' />
      </Item> */}
      <Item key='9' disabled={position!=='director'}>
        <Icon type='tags' />
        <span>カテゴリー・タグ</span>
        <Link to='/categoriesAndTags' />
      </Item>
      <Item key='10' disabled={position!==''}>
        <Icon type='login' />
        <span>ログイン</span>
        <Link to='/login' />
      </Item>
      <Item key='11' disabled={!isAuth}>
        <Icon type='logout' />
        <span>ログアウト</span>
        <Link to='/logout' />
      </Item>
      <Item key='12' disabled={position!==''}>
        <Icon type='user-add' />
        <span>サインアップ</span>
        <Link to='/signup' />
      </Item>
    </Menu>
  </Sider>
)

export default sidebar
