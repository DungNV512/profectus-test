import React from 'react'
import PropTypes from 'prop-types'
import { Button, Popover, OverlayTrigger } from 'react-bootstrap'
import LocalDatePicker from './LocalDatePicker'
import ProfectusCommon from '../../../utils'

export default class InlineEditableField extends React.Component {
  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      value: PropTypes.string,
      required: PropTypes.bool,
      date: PropTypes.bool,
      dateFormat: PropTypes.string,
      children: PropTypes.object,
      readOnly: PropTypes.bool,
      textarea: PropTypes.bool,
      onSubmit: PropTypes.func.isRequired,
    }
  }

  static get defaultProps() {
    return {
      id: null,
      value: '',
      date: false,
      children: null,
      required: false,
      dateFormat: 'DD/MM/YYYY',
      readOnly: false,
      textarea: false,
      onSubmit: null,
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      focused: false,
      loading: false,
      value: props.value,
      error: null,
    }

    this.handleChange = this.handleChange.bind(this)

    this.controlFocused = this.controlFocused.bind(this)

    this.fieldValueBlured = this.fieldValueBlured.bind(this)
    this.fieldValueClicked = this.fieldValueClicked.bind(this)

    this.doInlineSubmit = this.doInlineSubmit.bind(this)
    this.doInlineCancel = this.doInlineCancel.bind(this)

    this.handleKeyup = this.handleKeyup.bind(this)

    this.onSubmitComplete = this.onSubmitComplete.bind(this)

    this.showDate = this.showDate.bind(this)
    this.isActive = this.isActive.bind(this)

    this.handleDateChange = this.handleDateChange.bind(this)

    this.dateOverlay = {}
  }

  onSubmitComplete(result) {
    if (!result.ok) {
      const field = document.getElementById(this.props.id)

      this.setState({ focused: true, error: result.error })
      field.focus()
    } else {
      this.setState({ focused: false, error: null })
    }
    this.setState({ loading: false })
  }

  fieldValueBlured() {
    ProfectusCommon.util.sleep(150).then(() => {
      if (this.props.date && this.state.overlayShowing) {
        return
      }
      this.setState({ focused: this.isActive() })
    })
  }

  isActive() {
    const controls = [
      `text-${this.props.id}`,
      `inline-submit-control-${this.props.id}`,
      `inline-cancel-control-${this.props.id}`,
    ]

    const activeElement = document.activeElement

    return controls.some((id) => document.getElementById(id) === activeElement)
  }

  doInlineSubmit() {
    if (this.state.loading === false) {
      if (this.props.children) {
        this.setState({ focused: true, loading: true })
        this.props.onSubmit(this.props.id, null, this.onSubmitComplete)
        return
      }

      if (this.props.value !== this.state.value) {
        if (ProfectusCommon.util.isNotEmpty(this.state.value)) {
          this.setState({ focused: true, loading: true })
          this.props.onSubmit(
            this.props.id,
            this.state.value,
            this.onSubmitComplete,
          )
        } else if (this.props.required !== false) {
          this.setState({ focused: true, error: 'This field is required' })
        }
      } else {
        this.setState({
          focused: false,
          error: null,
        })
      }
    }
  }

  doInlineCancel() {
    if (this.state.loading === false) {
      this.setState({
        focused: false,
        value: this.props.value,
        error: null,
      })
    }
  }

  controlFocused() {
    this.setState({ focused: true })
  }

  fieldValueClicked() {
    this.setState({ focused: true })
    if (ProfectusCommon.util.isEmpty(this.state.value)) {
      this.setState({ value: this.props.value })
    } else if (this.state.value !== this.props.value) {
      this.setState({ value: this.props.value })
    }

    ProfectusCommon.util.sleep(120).then(() => {
      const input = document.getElementById(`text-${this.props.id}`)
      if (input) {
        input.focus()
      }
    })
  }

  handleKeyup(event) {
    if (event.keyCode === 13) {
      this.doInlineSubmit()
    }
  }

  handleChange(event) {
    const newValue = event.currentTarget.value
    this.setState({ value: newValue })
  }

  handleDateChange(value) {
    this.setState({ value })

    ProfectusCommon.util.sleep(20).then(() => {
      this.dateOverlay.hide()
      this.setState({ focused: true })
      document.getElementById(`text-${this.props.id}`).focus()
    })
  }

  showDate() {
    return this.state.focused
  }

  render() {
    if (this.props.readOnly) {
      return (
        <div
          id={this.props.id}
          role="presentation"
          className="inline-field-group"
        >
          {this.props.value}
        </div>
      )
    }

    let errorClass = ''
    if (this.state.error) {
      errorClass = ' has-error'
    }

    let content = this.props.value
    if (ProfectusCommon.util.isEmpty(content)) {
      content = <span className="inline-placeholder">Click to edit</span>
    }

    const dateOverlay = (el) => {
      this.dateOverlay = el
    }

    let bordered = ''
    let datePickerPopover
    if (this.state.focused) {
      bordered = ' bordered'

      if (this.props.children) {
        content = this.props.children
      } else {
        datePickerPopover = (
          <Popover id={`${this.props.id}-popOver`}>
            <LocalDatePicker
              inline
              dateFormat={this.props.dateFormat}
              date={this.state.value}
              onChange={this.handleDateChange}
            />
          </Popover>
        )
        /*
                content = (

                    <OverlayTrigger trigger="focus" show={true} placement="bottom" overlay={pops} rootClose>
                        <input type="text" id={`text-${this.props.id}`} onKeyUp={this.handleKeyup} onBlur={this.fieldValueBlured} className={`fixed-values-input${errorClass}`} value={this.state.value} onChange={this.handleChange} />
                    </OverlayTrigger>
                );
*/
        if (this.props.textarea) {
          content = (
            <textarea
              type="text"
              id={`text-${this.props.id}`}
              onKeyUp={this.handleKeyup}
              onBlur={this.fieldValueBlured}
              className={`fixed-values-input${errorClass}`}
              value={this.state.value}
              onChange={this.handleChange}
            />
          )
        } else {
          content = (
            <input
              type="text"
              id={`text-${this.props.id}`}
              onKeyUp={this.handleKeyup}
              onBlur={this.fieldValueBlured}
              className={`fixed-values-input${errorClass}`}
              value={this.state.value}
              onChange={this.handleChange}
            />
          )
        }
      }
    }

    return (
      <div>
        <div className="inline-field-group">
          <div>
            <div
              id={this.props.id}
              role="presentation"
              onClick={this.fieldValueClicked}
              className={`fixed-values-input${errorClass}${bordered}`}
            >
              {content}
            </div>

            {this.props.date && this.state.focused && (
              <div>
                <OverlayTrigger
                  ref={dateOverlay}
                  trigger="click"
                  placement="bottom"
                  overlay={datePickerPopover}
                  onExiting={() => this.setState({ overlayShowing: false })}
                  onEntering={() => this.setState({ overlayShowing: true })}
                  rootClose
                >
                  <Button
                    id={`calendar-control-${this.props.id}`}
                    className={`inline-date inline-edit-control${errorClass}`}
                  >
                    <span>
                      <i className="fa fa-calendar" />
                    </span>
                  </Button>
                </OverlayTrigger>
              </div>
            )}
          </div>
        </div>

        <div
          id={`inline-edit-control-${this.props.id}`}
          className="inline-edit-controls"
        >
          {this.state.error && (
            <div className="pull-left has-error">
              <span className="help-block">{this.state.error}</span>
            </div>
          )}

          {this.state.focused && (
            <div className="pull-right">
              {this.state.loading && (
                <i className="fa fa-circle-o-notch fa-spin margin-right-five" />
              )}
              <Button
                id={`inline-submit-control-${this.props.id}`}
                className={`inline-edit-control${errorClass}`}
                onClick={this.doInlineSubmit}
                onFocus={this.controlFocused}
                onBlur={this.fieldValueBlured}
              >
                <span>
                  <i className="fa fa-check" />
                </span>
              </Button>
              <Button
                id={`inline-cancel-control-${this.props.id}`}
                className={`inline-edit-control right${errorClass}`}
                onClick={this.doInlineCancel}
                onFocus={this.controlFocused}
                onBlur={this.fieldValueBlured}
              >
                <span>
                  <i className="fa fa-times" />
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
}
