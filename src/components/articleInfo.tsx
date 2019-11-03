import * as React from 'react'
// import { Button, Select } from 'antd'
// const { Option } = Select

const EditWriter: React.SFC<any> = ({
  // changeTags,
  // tags,
  // submit,
  // tagChoices,
  // changeCategory,
  // category,
  // categoryChoices
}) => (
  <React.Fragment>
        <p>現在このページは封鎖中です</p>
    <p>カテゴリやタグの変更がある場合は直接開発者まで連絡してください．</p>
    {/* <Select
      mode='multiple'
      style={{ margin: 50, width: 300 }}
      placeholder='Please select'
      onChange={changeTags}
      value={tags}
      disabled={tags[0]==='loading'}
    >
      {tagChoices.map((tag: string, index: number) => (
        <Option key={index} value={tag}>
          {tag}
        </Option>
      ))}
    </Select>
    <Select
      style={{ margin: 50, width: 300 }}
      placeholder='Please select'
      onChange={changeCategory}
      value={category}
      disabled={category==='loading'}
    >
      {categoryChoices.map((category: string, index: number) => (
        <Option key={index} value={category}>
          {category}
        </Option>
      ))}
    </Select>
    <Button
      type='primary'
      onClick={submit}
      style={{
        margin: '10px 50px',
      }}
    >
      保存
    </Button> */}
  </React.Fragment>
)

export default EditWriter
