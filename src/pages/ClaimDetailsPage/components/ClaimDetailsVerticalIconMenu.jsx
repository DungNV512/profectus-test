import React from 'react'

import PropTypes from 'prop-types'
import TabContainer from '../../../SharedComponents/TabContainer'

import ClaimDetails from './ClaimDetails'
import ClaimProcessDetails from './ClaimProcessDetails'

export default class ClaimDetailsVerticalIconMenu extends React.Component {
  static get propTypes() {
    return {
      id: PropTypes.number,
      claim: PropTypes.object.isRequired,
      profileCompleteness: PropTypes.object.isRequired,
      childClaims: PropTypes.object.isRequired,
      canEdit: PropTypes.bool,
      transitionDataFields: PropTypes.object.isRequired,
      onUpdate: PropTypes.func.isRequired,
      onStateChanged: PropTypes.func.isRequired,
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
      canEdit: false,
      schema: { properties: [] },
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      activeKey: props.externalActiveKeyTab ? props.externalActiveKeyTab : 1,
    }

    this.handleTabContainerSelect = this.handleTabContainerSelect.bind(this)
    this.setActiveKeyForTabContainer =
      this.setActiveKeyForTabContainer.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const claim = nextProps.claim
    this.setActiveKeyForTabContainer(claim)
  }

  setActiveKeyForTabContainer(claim) {
    let resetActiveKeyToDefault = true

    if (claim.hasAnyProcess) {
      const workflowProcessDetailsByCode = claim.workflowProcessDetailsByCode
      const _this = this

      Object.values(workflowProcessDetailsByCode).forEach((processDetails) => {
        const workflowProcessSchemaDetails =
          processDetails.workflowProcessSchemaDetails
        const displayOrderIndex = workflowProcessSchemaDetails.displayOrderIndex
        const eventKeyFromDisplayOrderIndex = parseFloat(displayOrderIndex) + 1

        if (_this.state.activeKey === eventKeyFromDisplayOrderIndex) {
          resetActiveKeyToDefault = false
        }
      })

      if (resetActiveKeyToDefault) {
        _this.resetActiveKey()
      }
    }
  }

  resetActiveKey() {
    this.setState({ activeKey: 1 })
  }

  handleTabContainerSelect(selectedKey) {
    this.setState({ activeKey: selectedKey })
  }

  render() {
    const claimDetails = (
      <ClaimDetails
        id={this.props.claim.id}
        claim={this.props.claim}
        profileCompleteness={this.props.profileCompleteness}
        childClaims={this.props.childClaims}
        onChildClaimInfoClick={this.props.onChildClaimInfoClick}
        schema={this.props.schema}
        onUpdate={this.props.onUpdate}
        canEdit={this.props.canEdit}
      />
    )

    const claimDetailstabs = [
      { label: 'label', content: claimDetails, eventKey: 1 },
    ]

    const claim = this.props.claim
    if (claim.hasAnyProcess) {
      const workflowProcessDetailsByCode = claim.workflowProcessDetailsByCode

      Object.entries(workflowProcessDetailsByCode).forEach(
        ([processCode, processDetails]) => {
          const workflowProcessSchemaDetails =
            processDetails.workflowProcessSchemaDetails

          const claimProcessDetails = (
            <ClaimProcessDetails
              claimId={claim.id}
              processCode={processCode}
              processDetails={processDetails}
              transitionDataFields={this.props.transitionDataFields}
              onStateChanged={this.props.onStateChanged}
              headerText={`${workflowProcessSchemaDetails.name} details`}
            />
          )

          const displayOrderIndex =
            workflowProcessSchemaDetails.displayOrderIndex
          claimDetailstabs.splice(displayOrderIndex, 0, {
            label: 'glyphiconWithTooltip',
            content: claimProcessDetails,
            eventKey: parseFloat(displayOrderIndex) + 1,
          })
        },
      )
    }

    return (
      // <div>
      //   {this.state.activeKey}
      //   <TabContainer
      //     tabs={claimDetailstabs}
      //     activeKey={this.state.activeKey}
      //     onSelect={this.handleTabContainerSelect}
      //   />
      // </div>
      <TabContainer
        tabs={claimDetailstabs}
        activeKey={this.state.activeKey}
        onSelect={this.handleTabContainerSelect}
      />
    )
  }
}
