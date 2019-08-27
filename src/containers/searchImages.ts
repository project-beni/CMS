import { compose, withHandlers, lifecycle, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { message } from 'antd'
import Unsplash, { toJson } from 'unsplash-js'

import Order from '../components/searchImages'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const copy = require('copy-to-clipboard')

const config0 = {
  applicationId: '63a7e6e897ee4152fc0af0e71f767a70639f88e34d24aec7be15565072289699',
  secret: 'cbf033e1c012682fa5d5e4746db515490970ecfcbda733da9c865e77c00100bf'
}

const config1 = {
  applicationId: '2a60e2b4161b695c26e3dc8a19d89314c81d251a1c0478fd3fb265c4bef809f5',
  secret: 'feda0b9397c36257b2bdf02e9dbfa8362e80f6cbd80fb91fd352d103e726eb5a',
}

const config2 = {
  applicationId: '41e219b64dda4cb60ca5016190bb300f262216fa116848b7d65a9ecd66d00a83',
  secret: '5b125d5119e2e01d028908acba73e156b4eacbdd1ed6f3e32bb2443b5111be7e',
}

const config3 = {
  applicationId: '0e33131009855dfa2b65b622b22c188653ea254165ccacf741edf6ea4baeaddb',
  secret: '63a9dae09e0d4d19f0390605ef51ba10fd4e0ea3fe2de13730974bd3738a18a6',
}

const config4 = {
  applicationId: '6359b63a001a67e7c5124387bdb9bc9f91636b66a44b79aab958089d896e01af',
  secret: '5e290cdbd2020838908bcdfedfd95299d2e1b5c4c1fd62675891bd5466c56be7',
}

const configs = [ config0, config1, config2, config3, config4 ]

type State = {
  photoList: string[]
  searchWord: string
  searchIndex: number
  unsplash: any
}

type Handlers = {
  setPhotoList: ({ photoList }: State) => State
  setSearchWord: ({ searchWord }: State) => State
  setSearchIndex: ({ searchIndex }: State) => State
  setUnsplash: (unsplash: any) => State
}

const stateHandlers = withStateHandlers<State, Handlers>(
  {
    photoList: [],
    searchWord: '',
    searchIndex: 1,
    unsplash: null
  },
  {
    setPhotoList: props => ({ photoList }) => ({ ...props, photoList }),
    setSearchWord: props => ({ searchWord }) => ({ ...props, searchWord }),
    setSearchIndex: props => ({ searchIndex }) => ({ ...props, searchIndex }),
    setUnsplash: props => (unsplash) => ({ ...props, unsplash })
  }
)

const WithHandlers = withHandlers<RouteComponentProps | any, {}>({
  search: ({ setPhotoList, setSearchWord, setSearchIndex, unsplash }) => (
    searchWord: string
  ) => {
    setSearchWord({ searchWord })
    unsplash.search
      .photos(searchWord, 1, 12)
      .then(toJson)
      .then((photosJson: any) => {
        const photoList: any = []
        photosJson.results.forEach((photo: any) => {
          unsplash.photos
            .getPhoto(photo.id, 1920, 1080, [0, 0, 1920, 1080])
            .then(toJson)
            .then((j: any) => {
              photoList.push(j.urls.regular)
              setPhotoList({ photoList })
            })
        })
      })
    setSearchIndex({ searchIndex: 2 })
  },
  moreSearch: ({ setPhotoList, searchIndex, searchWord, photoList, unsplash }) => () => {
    unsplash.search
      .photos(searchWord, searchIndex, 12)
      .then(toJson)
      .then((photosJson: any) => {
        photosJson.results.forEach((photo: any) => {
          unsplash.photos
            .getPhoto(photo.id, 1920, 1080, [0, 0, 1920, 1080])
            .then(toJson)
            .then((j: any) => {
              photoList.push(j.urls.regular)
              setPhotoList({ photoList })
            })
        })
      })
  },
  onChange: ({ searchWord }) => (w: string) => {
    searchWord(w)
  },
  copyLink: () => (url: string) => {
    copy(url)
    message.success('画像のURLをコピーしました')
  },
})

const Lifecyle = lifecycle<RouteComponentProps | any, {}, {}>({
  componentDidMount() {
    const i = Math.floor(Math.random() * Math.floor(5))
    const unsplash = new Unsplash(configs[i])
    this.props.setUnsplash(unsplash)
  },
})

export default compose(
  withRouter,
  stateHandlers,
  WithHandlers,
  Lifecyle
)(Order)
