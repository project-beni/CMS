import * as React from 'react'
import { Input, Button, Col, Row, Popconfirm } from 'antd'
import {
  Add,
  Remove
} from '@material-ui/icons'

export default class Block extends React.Component<any> {
  constructor(props: any) {
    super(props)
    this._handleCaptionChange = this._handleCaptionChange.bind(this)
    this._handleEdit = this._handleEdit.bind(this)
  }

  _handleEdit() {
    alert(JSON.stringify(this.props.data, null, 4))
  }

  _handleCaptionChange(
    event: React.ChangeEvent<HTMLInputElement>,
    base: string[][],
    rowIndex: number,
    columnIndex: number
  ) {
    event.stopPropagation()
    base[rowIndex][columnIndex] = event.target.value
    this.props.container.updateData({ table: base })
  }

  _addRow (base: string[][]) {
    const numberOfColumns = base[0].length
    const newRow = Array(numberOfColumns).fill('')
    base.push(newRow)

    this.props.container.updateData({ table: base })
  }

  _deleteRow (base: string[][]) {
    if (base.length <= 2) return
    base.pop()

    this.props.container.updateData({ table: base })
  }

  _addColumn (base: string[][]) {
    const newData = base.map((row: string[]) => {
      row.push('')
      return row
    })

    this.props.container.updateData({ table: newData })
  }

  _deleteColumn (base: string[][]) {
    if (base[0].length <= 2) return
    const newData = base.map((row: string[]) => {
      row.pop()
      return row
    })

    this.props.container.updateData({ table: newData })
  }

  render() {
    const tableData = this.props.data.table
    return (
      <React.Fragment>
        <Row>
          <Col span={23}>
            <table style={{ width: '100%' }}>
              <tbody>
                {
                  tableData.map((row: string[], i: number) => (
                    <tr
                      key={i}
                      style={{
                        border: 'solid 1px #ccc'
                      }}
                    >
                      {
                        row.map((element: string, j: number) => {
                          if (i === 0) {
                            return (
                              <th
                                key={j}
                                style={{
                                  borderRight: row.length !== j + 1 ? 'solid 1px #ccc' : 'none',
                                  padding: 0
                                }}
                              >
                                <Input
                                  placeholder='ヘッダー'
                                  value={element}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    this._handleCaptionChange(e, tableData, i, j)
                                  }}
                                  style={{
                                    border: 'none',
                                    backgroundColor: '#eee',
                                    borderRadius: 0
                                  }}
                                />
                              </th>
                            )
                          } else {
                            return (
                              <td
                                key={j}
                                style={{
                                  borderRight: row.length !== j + 1 ? 'solid 1px #ccc' : 'none',
                                  padding: 0
                                }}
                              >
                                <Input
                                  placeholder='コンテンツ'
                                  value={element}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    this._handleCaptionChange(e, tableData, i, j)
                                  }}
                                  style={{
                                    border: 'none',
                                    borderRadius: 0
                                  }}
                                />
                              </td>
                            )
                          }
                        })
                      }
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </Col>
          <Col span={1}>
            <div style={{ width: '100%' }}>
              <Button
                onClick={() => {
                  this._addColumn(tableData)
                }}
                style={{ padding: 0 }}
              >
                <Add/>
              </Button>
              <Popconfirm
                title='一番右の１列（縦）削除します'
                onConfirm={() => {
                  this._deleteColumn(tableData)
                }}

              >
                <Button　style={{ padding: 0 }}　>
                  <Remove />
                </Button>
              </Popconfirm>
            </div>
          </Col>
        </Row>
        <Button onClick={() => {
          this._addRow(tableData)
        }}>
          <Add/>
        </Button>
        <Popconfirm
          title='一番下の１行（横）削除します'
          onConfirm={() => {
            this._deleteRow(tableData)
          }}
        >
          <Button>
            <Remove />
          </Button>
        </Popconfirm>
      </React.Fragment>
    );
  }
}
