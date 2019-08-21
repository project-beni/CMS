import { compose, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { message } from 'antd'
import * as copy from 'copy-to-clipboard'
import Unsplash, { toJson } from 'unsplash-js'

import Order from '../components/searchImages'

const unsplash = new Unsplash({
  applicationId:
    '2a60e2b4161b695c26e3dc8a19d89314c81d251a1c0478fd3fb265c4bef809f5',
  secret: 'feda0b9397c36257b2bdf02e9dbfa8362e80f6cbd80fb91fd352d103e726eb5a',
})

type State = {
  photoList: string[]
  searchWord: string
  searchIndex: number
}

type Handlers = {
  setPhotoList: ({ photoList }: State) => State
  setSearchWord: ({ searchWord }: State) => State
  setSearchIndex: ({ searchIndex }: State) => State
}

const stateHandlers = withStateHandlers<State, Handlers>(
  {
    photoList: [],
    searchWord: '',
    searchIndex: 1,
  },
  {
    setPhotoList: props => ({ photoList }) => ({ ...props, photoList }),
    setSearchWord: props => ({ searchWord }) => ({ ...props, searchWord }),
    setSearchIndex: props => ({ searchIndex }) => ({ ...props, searchIndex }),
  }
)

const WithHandlers = withHandlers<RouteComponentProps | any, {}>({
  search: ({ setPhotoList, setSearchWord, setSearchIndex }) => (
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
  moreSearch: ({ setPhotoList, searchIndex, searchWord, photoList }) => () => {
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

export default compose(
  withRouter,
  stateHandlers,
  WithHandlers
)(Order)
