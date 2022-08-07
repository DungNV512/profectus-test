import React from 'react'
import PropTypes from 'prop-types'
import Select from '../../../SharedComponents/Select'
import InlineEditableField from './InlineEditableField'
import ClaimDetailValue from './ClaimDetailValue'
import moment from 'moment'
import numeral from 'numeral'
import ProfectusCommon from '../../../utils'
export default class ClaimProcessDetails extends React.PureComponent {
  constructor(props) {
    super(props)

    this.getDisplayProperty = this.getDisplayProperty.bind(this)
    this.getProcessDataFieldsByOrderIndex =
      this.getProcessDataFieldsByOrderIndex.bind(this)
    this.getField = this.getField.bind(this)
    this.getProcessPropertySchema = this.getProcessPropertySchema.bind(this)
    this.getFormattedValueByType = this.getFormattedValueByType.bind(this)
    this.handleSelected = this.handleSelected.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.initializeState = this.initializeState.bind(this)
  }

  static get propTypes() {
    return {
      claimId: PropTypes.number.isRequired,
      processDetails: PropTypes.object.isRequired,
      processCode: PropTypes.string.isRequired,
      transitionDataFields: PropTypes.object.isRequired,
      headerText: PropTypes.string.isRequired,
      onStateChanged: PropTypes.func.isRequired,
    }
  }

  componentWillReceiveProps() {
    this.initializeState()
  }

  componentWillMount() {
    this.initializeState()
  }

  initializeState() {
    const processCode = this.props.processCode
    const processDetails = this.props.processDetails
    const processDataFields =
      processDetails.workflowProcessDatafields.processDataFields

    Object.keys(processDataFields).forEach((attributeName) => {
      const processAttributeName = `processAttributes.${processCode}.${attributeName}`
      const value = processDataFields[attributeName]
      this.setState({
        [processAttributeName]: value,
      })
    })
  }

  handleSelected(processAttributeName, event) {
    this.setState({ [processAttributeName]: event.value })
  }

  getDisplayProperty(groupName, attributeName) {
    let displayProperty = attributeName

    if (
      this.props.transitionDataFields &&
      this.props.transitionDataFields.properties
    ) {
      this.props.transitionDataFields.properties.forEach((processAttriubte) => {
        if (
          processAttriubte.groupName === groupName &&
          processAttriubte.attributeName === attributeName
        ) {
          displayProperty = processAttriubte.displayName
        }
      })
    }

    return displayProperty
  }

  getProcessPropertySchema(groupName, attributeName) {
    let processPropertySchema = ''
    if (
      this.props.transitionDataFields &&
      this.props.transitionDataFields.properties
    ) {
      this.props.transitionDataFields.properties.forEach((processAttriubte) => {
        if (
          processAttriubte.groupName === groupName &&
          processAttriubte.attributeName === attributeName
        ) {
          processPropertySchema = processAttriubte
        }
      })
    }

    return processPropertySchema
  }

  getOrderIndex(groupName, attributeName) {
    let orderIndex = 1

    if (
      this.props.transitionDataFields &&
      this.props.transitionDataFields.properties
    ) {
      this.props.transitionDataFields.properties.forEach((processAttriubte) => {
        if (
          processAttriubte.groupName === groupName &&
          processAttriubte.attributeName === attributeName
        ) {
          orderIndex = processAttriubte.orderIndex
        }
      })
    }

    return orderIndex
  }

  getProcessDataFieldsByOrderIndex(processCode, processDataFields) {
    const processDataFieldsByOrderIndex = new Map()

    Object.keys(processDataFields).forEach((key) => {
      const orderIndex = this.getOrderIndex(processCode, key)
      processDataFieldsByOrderIndex.set(key, orderIndex)
    })

    return new Map(
      [...processDataFieldsByOrderIndex.entries()].sort((a, b) => a[1] - b[1]),
    )
  }

  getField(attributeName, processCode) {
    const processAttributeSchema = this.getProcessPropertySchema(
      processCode,
      attributeName,
    )

    const fieldKey = `${processAttributeSchema.propertyName} - ${processAttributeSchema.attributeName}`

    const displayName = processAttributeSchema.displayName

    let isReadOnly = !processAttributeSchema.editable

    /* temp change by soham need to think about this */
    if (processCode === 'cancelAmount') {
      isReadOnly = true
    }

    const processAttributeName = `processAttributes.${processCode}.${attributeName}`

    if (ProfectusCommon.util.isNotEmpty(processAttributeSchema.lookupList)) {
      const lookupList = processAttributeSchema.lookupList.map((o) => ({
        value: o.key,
        label: o.value,
        attributeName: processAttributeSchema.attributeName,
      }))

      return (
        <ClaimDetailValue label={displayName} key={fieldKey}>
          <InlineEditableField
            id={processAttributeName}
            value={
              this.state[processAttributeName]
                ? this.getFormattedValueByType(
                    this.state[processAttributeName],
                    processAttributeSchema,
                  )
                : ''
            }
            onSubmit={this.handleSubmit}
            readOnly={isReadOnly}
          >
            <Select
              name={processAttributeSchema.attributeName}
              value={
                this.state[processAttributeName]
                  ? this.getFormattedValueByType(
                      this.state[processAttributeName],
                      processAttributeSchema,
                    )
                  : ''
              }
              multi={false}
              clearable={false}
              options={lookupList}
              onChange={(e) => this.handleSelected(processAttributeName, e)}
            />
          </InlineEditableField>
        </ClaimDetailValue>
      )
    }

    if (processAttributeSchema.type === 'DATE') {
      return (
        <ClaimDetailValue label={displayName} key={fieldKey}>
          <InlineEditableField
            id={processAttributeName}
            value={
              this.state[processAttributeName]
                ? this.getFormattedValueByType(
                    this.state[processAttributeName],
                    processAttributeSchema,
                  )
                : ''
            }
            onSubmit={this.handleSubmit}
            readOnly={isReadOnly}
            date
          />
        </ClaimDetailValue>
      )
    }

    if (attributeName.toLowerCase().includes('comment')) {
      return (
        <ClaimDetailValue label={displayName} key={fieldKey}>
          <InlineEditableField
            id={processAttributeName}
            value={
              this.state[processAttributeName]
                ? this.getFormattedValueByType(
                    this.state[processAttributeName],
                    processAttributeSchema,
                  )
                : ''
            }
            onSubmit={this.handleSubmit}
            readOnly={isReadOnly}
            textarea
          />
        </ClaimDetailValue>
      )
    }

    return (
      <ClaimDetailValue label={displayName} key={fieldKey}>
        <InlineEditableField
          id={processAttributeName}
          value={
            this.state[processAttributeName]
              ? this.getFormattedValueByType(
                  this.state[processAttributeName],
                  processAttributeSchema,
                )
              : ''
          }
          onSubmit={this.handleSubmit}
          readOnly={isReadOnly}
        />
      </ClaimDetailValue>
    )
  }

  getFormattedValueByType(fieldValue, processAttributeSchema) {
    switch (processAttributeSchema.type) {
      case 'ALPHANUMERIC':
        return fieldValue
      case 'DATE':
        return moment(fieldValue, 'YYYY-MM-DD').format(
          processAttributeSchema.dataFormat,
        )
      case 'NUMERIC':
        return numeral(fieldValue).format(processAttributeSchema.dataFormat)
      default:
        return fieldValue
    }
  }

  handleSubmit(fieldId, fieldValue, onComplete) {
    let value = fieldValue
    if (!value) {
      value = this.state[fieldId]
      if (value.value) {
        value = value.value
      }
    }

    const filedIdSplittedByDot = fieldId.split('.')

    const processCode = filedIdSplittedByDot[1]
    const attributeName = filedIdSplittedByDot[2]
    const processAttributeSchema = this.getProcessPropertySchema(
      processCode,
      attributeName,
    )

    if (processAttributeSchema.type === 'NUMERIC') {
      value = value.replace('$', '')
      value = value.replace(/,/g, '')
    }

    const update = {
      id: this.props.claimId,
      [fieldId]: value,
      singleFieldEdit: fieldId,
    }

    const url = `${window.location.href}/process/update`
    ProfectusCommon.ajax.patchJson(
      update,
      url,
      (data) => {
        const setValue =
          data.workflowProcessDetailsByCode[processCode]
            .workflowProcessDatafields.processDataFields[attributeName]

        this.setState({
          loading: false,
          [fieldId]: setValue,
        })

        onComplete({ ok: true })
        this.props.onStateChanged()
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

  render() {
    const header = (
      <span className="claim-details-header">{this.props.headerText}</span>
    )
    const processCode = this.props.processCode
    const processDetails = this.props.processDetails
    const processDataFields =
      processDetails.workflowProcessDatafields.processDataFields
    const processDataFieldsByOrderIndex = this.getProcessDataFieldsByOrderIndex(
      processCode,
      processDataFields,
    )

    return (
      <div>
        <div className="col-md-12 no-padding">{header}</div>
        <div className="row read-only-form form-horizontal inline-fields pad-left-10 col-md-9">
          {this.props.transitionDataFields &&
            this.props.transitionDataFields.properties &&
            [...processDataFieldsByOrderIndex].map((key) => {
              const attributeName = key[0]

              return this.getField(attributeName, processCode)
            })}
        </div>
      </div>
    )
  }
}
