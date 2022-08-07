import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'
import PropTypes from 'prop-types'

const { ProfectusCommon } = window

export default class LocalDatePicker extends React.Component {
  static get propTypes() {
    return {
      dateFormat: PropTypes.string,
      inline: PropTypes.bool,
      date: PropTypes.object,
      minDate: PropTypes.object,
      maxDate: PropTypes.object,
      onChange: PropTypes.func,
      selected: PropTypes.object,
    }
  }

  static get defaultProps() {
    return {
      dateFormat: 'DD/MM/YYYY',
      inline: false,
      date: '',
      minDate: '',
      maxDate: '',
      selected: '',
      onChange: () => {},
    }
  }

  constructor(props) {
    super(props)

    this.handleChanged = this.handleChanged.bind(this)
  }

  handleChanged(value) {
    const format = this.props.dateFormat

    this.props.onChange(moment(value, format).format(format))
  }

  render() {
    let date = this.props.selected || this.props.date

    if (ProfectusCommon.util.isNotEmpty(date) && typeof date === 'string') {
      date = moment(date, this.props.dateFormat).toDate()
    }

    return (
      <div>
        {ProfectusCommon.util.isNotEmpty(date) ? (
          <DatePicker
            inline={this.props.inline}
            selected={date}
            onChange={this.handleChanged}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            dateFormat={this.props.dateFormat}
            showYearDropdown
          />
        ) : (
          <DatePicker
            inline={this.props.inline}
            onChange={this.handleChanged}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            dateFormat={this.props.dateFormat}
            showYearDropdown
          />
        )}
      </div>
    )
  }
}
