import React from 'react'
import PropTypes from 'prop-types'

import { OverlayTrigger } from 'react-bootstrap'
import numeral from 'numeral'

export default class ClaimValue extends React.PureComponent {
  static get propTypes() {
    return {
      className: PropTypes.string,
      tooltip: PropTypes.object.isRequired,
      netClaimAmount: PropTypes.number,
      format: PropTypes.string,
    }
  }

  static get defaultProps() {
    return {
      className: '',
      netClaimAmount: '0.00',
      format: '$0,0.00',
    }
  }

  render() {
    return (
      <OverlayTrigger placement="bottom" overlay={this.props.tooltip}>
        <span className={this.props.className}>
          {numeral(this.props.netClaimAmount).format(this.props.format)}
        </span>
      </OverlayTrigger>
    )
  }
}
