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
import recruitingArticles from './containers/recruitingArticles'
import OrderedArticles from './containers/orderedArticles'
import Pending from './containers/pending'
import Order from './containers/order'
import Signup from './containers/signup'
import MailConfirmation from './containers/mailConfirmation'
import EditArticles from './containers/editArticle'
import Logout from './containers/logout'
import rejected from './containers/rejected'
import Check from './containers/check'
import CheckArticle from './containers/checkArticle'
import Accepted from './containers/accepted'
import CategoriesAndTags from './containers/categoriesAndTags'
import Auth from './containers/auth'
import SearchImages from './containers/searchImages'

const Routes: React.SFC<any> = ({ isAuth }) => (
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
                <Route path={'/signup'} exact={true} component={Signup} />
                <Route path={'/logout'} exact={true} component={Logout} />
                <Route path={'/mailConfirmation'} exact={true} component={MailConfirmation} />
                <Auth>
                  <Route path={'/articles/recruiting'} exact={true} component={recruitingArticles} />
                  <Route path={'/articles/ordered'} exact={true} component={OrderedArticles} />
                  <Route path={'/articles/pending'} exact={true} component={Pending} />
                  <Route path={'/articles/rejected'} exact={true} component={rejected} />
                  <Route path={'/articles/edit/:id'} exact={true} component={EditArticles} />
                  <Route path={'/articles/accepted'} exact={true} component={Accepted} />
                  {/* <Route path={'/mypage'} exact={true} component={} /> */}
                  <Route path={'/order'} exact={true} component={Order} />
                  <Route path={'/checkList'} exact={true} component={Check} />
                  <Route path={'/checkList/:id'} exact={true} component={CheckArticle} />
                  <Route path={'/categoriesAndTags'} exact={true} component={CategoriesAndTags} />
                  <Route path={'/searchImages'} exact={true} component={SearchImages} />
                </Auth>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  </Provider>
)

export default Routes
