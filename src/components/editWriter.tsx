import * as React from 'react'
import { Button, Input, Popconfirm } from 'antd'

const EditWriter: React.SFC<any> = ({
  changeNickname,
  deleteWriter,
  nickname,
  submit,
}) => (
  <React.Fragment>
    <Input
      value={nickname}
      onChange={changeNickname}
      style={{
        margin: 50,
      }}
    />
    <Button
      type="primary"
      onClick={submit}
      style={{
        margin: '10px 50px',
      }}
    >
      保存
    </Button>
    <Popconfirm
      title="本当に削除しますか？"
      onConfirm={deleteWriter}
      okType="danger"
    >
      <Button
        type="danger"
        style={{
          margin: '10px 50px',
        }}
      >
        アカウントの削除
      </Button>
    </Popconfirm>
  </React.Fragment>
)

export default EditWriter
