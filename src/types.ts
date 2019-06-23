export type Users = {
  [userId: string]: {
    profiles: {
      email: string
      firstName: string
      familyName: string
      nickname: string
    }
    articles: {
      writings: []
      pendings: []
      wrotes: []
    }
    mailCnnfirmation: boolean
  }
}

export type Articles = {
  [articleId: string]: {
    contents: {
      title: string
      body: string
      keywords: string[]
      tags: string[]
    }
    status: 'ordered' | 'writing' | '' | ''
  }
}
