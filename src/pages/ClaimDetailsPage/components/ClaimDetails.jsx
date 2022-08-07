import React from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Collapse, Glyphicon } from 'react-bootstrap'

import Select from '../../../SharedComponents/Select'
import InlineEditableField from './InlineEditableField'
import ClaimDetailValue from './ClaimDetailValue'
import moment from 'moment'
import numeral from 'numeral'
import ProfectusCommon from '../../../utils'

export default class ClaimDetails extends React.PureComponent {
  static get propTypes() {
    return {
      id: PropTypes.number,
      claim: PropTypes.object.isRequired,
      childClaims: PropTypes.object.isRequired,
      canEdit: PropTypes.bool,
      onUpdate: PropTypes.func.isRequired,
      onChildClaimInfoClick: PropTypes.func.isRequired,
      schema: PropTypes.shape(
        PropTypes.arrayOf(
          PropTypes.shape({
            alignment: PropTypes.string,
          }),
        ),
      ),
    }
  }

  static get defaultProps() {
    return {
      id: -1,
      attributes: {},
      currencyDetails: {},
      claimExTax: 0,
      claimTax: 0,
      canEdit: false,
      invoiceNumber: '',
      schema: { properties: [] },
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      showMore: true,
    }

    this.resize = this.resize.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSelected = this.handleSelected.bind(this)
    this.getHeaderFields = this.getHeaderFields.bind(this)

    this.getExtraFields = this.getExtraFields.bind(this)
    this.getField = this.getField.bind(this)
    this.getValue = this.getValue.bind(this)
    this.getCodeFromLookupList = this.getCodeFromLookupList.bind(this)
  }

  componentWillReceiveProps(props) {
    const properties = props.schema.properties

    properties.forEach((property) =>
      this.setState({
        [property.propertyName]: this.getValue(property),
      }),
    )
  }

  handleSubmit(fieldId, fieldValue, onComplete) {
    let value = fieldValue
    if (!value) {
      value = this.state[fieldId]
      if (value.value) {
        value = value.value
      }
    }

    value = value.replace('$', '')

    const update = {
      id: this.props.id,
      [fieldId]: value,
      singleFieldEdit: fieldId,
    }

    const url = `${window.location.href}/update`
    ProfectusCommon.ajax.patchJson(
      update,
      url,
      (data) => {
        let setValue = fieldId.split('.').reduce((a, v) => a[v], data)

        if (!setValue && fieldId === 'currency') {
          setValue = data.currencyDetails.id.toString()
        }

        this.setState({
          loading: false,
          [fieldId]: setValue,
        })

        onComplete({ ok: true })
        this.props.onUpdate(fieldId, setValue)
      },
      (xhr) => {
        const errors = xhr.responseJSON.fieldErrors
        const message = errors ? errors[0].message : 'invalid value for field'

        onComplete({
          ok: false,
          error: message,
        })

        this.setState({ loading: false })
      },
    )
  }

  resize() {
    const attachmentsPanel = document.getElementById('claim-attachments-panel')
    const detailsPanel = document.getElementById('claim-details-panel')
    attachmentsPanel.style.height = `${detailsPanel.clientHeight}px`

    const attachmentsList =
      document.getElementsByClassName('claim-attachments')[0]
    if (attachmentsList) {
      if (this.state.showMore === false) {
        attachmentsList.classList.add('claim-attachments-collapsed')
      } else {
        attachmentsList.classList.remove('claim-attachments-collapsed')
      }

      const heightBuffer = 75
      const defaultListHeight = 110

      const valuesPanel = document.getElementById('claim-details-values')
      const listMaxHeight = valuesPanel.clientHeight - heightBuffer

      if (
        defaultListHeight < listMaxHeight &&
        attachmentsList.clientHeight > listMaxHeight
      ) {
        attachmentsList.style.height = `${listMaxHeight}px`
        attachmentsList.style.overflowY = 'scroll'
      }
    }
  }

  getValue(property) {
    let value = ''
    const valueType = property.attribute === true ? 'attribute' : 'property'

    if (ProfectusCommon.util.isNotEmpty(this.props.claim.attributes)) {
      if (valueType === 'property') {
        value = this.props.claim[property.propertyName]
        if (ProfectusCommon.util.isNotEmpty(property.dtoMappingProperty)) {
          value = ProfectusCommon.util.getPropertyValueFromState(
            this.props.claim,
            property.dtoMappingProperty,
          )
        }
      } else {
        value = this.props.claim.attributes[property.attributeName]
      }
    }

    switch (property.type) {
      case 'ALPHANUMERIC':
        return value
      case 'DATE':
        return moment(value).format(property.dataFormat)
      case 'NUMERIC':
        return numeral(value).format(property.dataFormat)
      default:
        return value
    }
  }

  handleSelected(property, event) {
    this.setState({ [property.propertyName]: event.value })
  }

  getCodeFromLookupList(property, value) {
    if (
      ProfectusCommon.util.isNotEmpty(property.lookupList) &&
      ProfectusCommon.util.isNotEmpty(value)
    ) {
      const lookupObject = property.lookupList.find((o) => o.key === value)

      if (ProfectusCommon.util.isNotUndefined(lookupObject)) {
        return lookupObject.value
      }
    }
    return value
  }

  getField(property, readOnly) {
    const isReadOnly = !property.editable || readOnly

    if (ProfectusCommon.util.isNotEmpty(property.lookupList)) {
      const lookupList = property.lookupList.map((o) => ({
        value: o.key,
        label: o.value,
      }))

      let selectedLookupObject = { value: '', label: '' }
      if (
        ProfectusCommon.util.isEmpty(this.state[property.propertyName]) &&
        ProfectusCommon.util.isNotEmpty(this.getValue(property))
      ) {
        selectedLookupObject = lookupList.find(
          (o) => o.label === this.getValue(property),
        )
        this.setState({ [property.propertyName]: selectedLookupObject.value })
      }

      return (
        <ClaimDetailValue
          label={property.displayName}
          key={property.displayName}
        >
          <InlineEditableField
            id={
              property.attribute
                ? property.propertyName.concat('.', property.attributeName)
                : property.propertyName
            }
            value={this.getCodeFromLookupList(
              property,
              this.state[property.propertyName],
            )}
            onSubmit={this.handleSubmit}
            readOnly={isReadOnly}
          >
            <Select
              name={property.propertyName}
              value={this.state[property.propertyName]}
              multi={false}
              clearable={false}
              options={lookupList}
              onChange={(e) => this.handleSelected(property, e)}
            />
          </InlineEditableField>
        </ClaimDetailValue>
      )
    }

    if (property.type === 'DATE') {
      return (
        <ClaimDetailValue
          label={property.displayName}
          key={property.displayName}
        >
          <InlineEditableField
            id={
              property.attribute
                ? property.propertyName.concat('.', property.attributeName)
                : property.propertyName
            }
            value={this.getValue(property)}
            onSubmit={this.handleSubmit}
            readOnly={isReadOnly}
            date
          />
        </ClaimDetailValue>
      )
    }

    return (
      <ClaimDetailValue label={property.displayName} key={property.displayName}>
        <InlineEditableField
          id={
            property.attribute
              ? property.propertyName.concat('.', property.attributeName)
              : property.propertyName
          }
          value={this.getValue(property)}
          onSubmit={this.handleSubmit}
          readOnly={isReadOnly}
        />
      </ClaimDetailValue>
    )
  }

  getHeaderFields(readOnly) {
    if (
      !this.props.schema ||
      !this.props.claim ||
      !this.props.claim.attributes
    ) {
      return null
    }

    const columnWidth = 6

    let fields = this.props.schema.properties.filter(
      (property) => property.header,
    )

    fields = fields.sort((a, b) => a.orderIndex - b.orderIndex)

    return (
      <span>
        <Col md={columnWidth} className="pad-top-15">
          {fields
            .filter((property) => property.groupName === 'left-column')
            .map((property) => this.getField(property, readOnly))}
        </Col>
        <Col md={columnWidth} className="pad-top-15">
          {fields
            .filter((property) => property.groupName === 'right-column')
            .map((property) => this.getField(property, readOnly))}
        </Col>
      </span>
    )
  }

  getExtraFields(readOnly) {
    if (
      !this.props.schema ||
      !this.props.claim ||
      !this.props.claim.attributes
    ) {
      return null
    }

    const columnWidth = 6

    let fields = this.props.schema.properties.filter(
      (property) => !property.header,
    )

    fields = fields.sort((a, b) => a.orderIndex - b.orderIndex)

    return (
      <span>
        <Col md={columnWidth}>
          {fields
            .filter((property) => property.groupName === 'left-column')
            .map((property) => this.getField(property, readOnly))}
        </Col>
        <Col md={columnWidth}>
          {fields
            .filter((property) => property.groupName === 'right-column')
            .map((property) => this.getField(property, readOnly))}
        </Col>
      </span>
    )
  }

  render() {
    const readOnly = !this.props.canEdit

    let claimDetailsHeader = (
      <span className="claim-details-header">Claim Details</span>
    )
    const claimCode = this.props.claim.claimCodeDetails

    let info
    if (ProfectusCommon.util.isNotEmpty(this.props.childClaims)) {
      info = (
        <span className="pad-left-10 pull-right">
          <a
            role="link"
            tabIndex={0}
            onClick={this.props.onChildClaimInfoClick}
          >
            <i className="fa fa-info-circle" />
          </a>
        </span>
      )
    }
    if (claimCode) {
      claimDetailsHeader = (
        <span className="claim-details-header">
          Claim Details &#183;{' '}
          <span className="claim-type-name">{claimCode.description}</span>
          {info}
        </span>
      )
    }
    return (
      <div>
        <div id="claim-details-values">
          {claimDetailsHeader}
          <div>
            <div>
              <div className="row read-only-form form-horizontal inline-fields">
                {this.getHeaderFields(readOnly)}
              </div>
            </div>

            <Collapse
              in={this.state.showMore}
              timeout={1500}
              onEntered={this.resize}
              onExited={this.resize}
            >
              <div>
                <div className="row read-only-form form-horizontal inline-fields">
                  {this.getExtraFields(readOnly)}
                </div>
              </div>
            </Collapse>
          </div>

          <div className="pull-right small">
            {this.state.showMore === true ? (
              <Button
                bsStyle="link"
                onClick={() => this.setState({ showMore: false })}
              >
                <Glyphicon glyph="chevron-up" />
                Show less
              </Button>
            ) : (
              <Button
                bsStyle="link"
                onClick={() => this.setState({ showMore: true })}
              >
                <Glyphicon glyph="chevron-down" />
                Show more
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }
}
