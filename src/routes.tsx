import * as React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { Layout } from 'antd'
const { Header, Content, Footer } = Layout

import C from 'react-contenteditable'

import reducer from './stores/reducers/auth'
const store = createStore(reducer)

// import Sidebar from './components/sidebar'
import Sidebar from './containers/sidebar'

import dashboard from './components/dashboard'
import login from './containers/login'
import recruitingArticles from './components/recruitingArticles'
import OrderedArticles from './components/orderedArticles'
import Order from './containers/order'

const Hello = () => (
  <C
    html={'honya'}
    disabled={false}
    tagName='p'
  />
)

const Routes: React.SFC<any> = () => (
  <Provider store={store}>
    <Router>
      <Layout　style={{ minHeight: '100vh' }}>
        <Header>moarke</Header>
        <Layout>
          <Sidebar />
          <Layout>
            <Content style={{ margin: '0 16px', backgroundColor: '#fff' }}>
                <Switch>
                  <Route path={'/'} exact={true} component={dashboard} />
                  <Route path={'/login'} exact={true} component={login} />
                  <Route path={'/articles/recruiting'} exact={true} component={recruitingArticles} />
                  <Route path={'/articles/ordered'} exact={true} component={OrderedArticles} />
                  {/* <Route path={'/articles/writing'} exact={true} component={} /> */}
                  {/* <Route path={'/mypage'} exact={true} component={} /> */}
                  <Route path={'/order'} exact={true} component={Order} />
                </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  </Provider>
)

export default Routes
