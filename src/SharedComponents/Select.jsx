import React from 'react'
import { default as Wrapped } from 'react-select'

export default class Select extends React.Component {
  render() {
    return <Wrapped {...this.props} />
  }
}
