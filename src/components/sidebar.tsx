import * as React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Icon, Layout, Menu } from 'antd'


const { Sider } = Layout
const { Item } = Menu

const sidebar: React.SFC<any> = ({ selected }) => (
  <Sider
    collapsible
    defaultCollapsed
    theme='light'
  >
    <Menu
      mode='inline'
      theme='light'
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
    >
      <Item key='1'>
        <Icon type='home' />
        <span>ホーム</span>
        <Link to='/' />
      </Item>
      <Item key='2'>
        <Icon type='file-search' />
        <span>募集中の記事</span>
        <Link to='/articles/recruiting' />
      </Item>
      <Item key='3'>
        <Icon type='edit' />
        <span>受注中の記事</span>
        <Link to='/articles/ordered' />
      </Item>
      <Item key='4'>
        <Icon type='file-add' />
        <span>記事の発注</span>
        <Link to='/order' />
      </Item>
      <Item key='5'>
        <Icon type='user' />
        <span>マイページ</span>
        <Link to='/mypage' />
      </Item>
    </Menu>
  </Sider>
)

export default sidebar
