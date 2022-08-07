import React from 'react'
import { ReactComponent as IconBag } from './assets/IconBag.svg'
import { ReactComponent as IconCompany } from './assets/IconCompany.svg'
import { ReactComponent as IconDown } from './assets/IconDown.svg'
import { ReactComponent as IconRight } from './assets/IconRight.svg'

import { OverlayTrigger, Popover } from 'react-bootstrap'

import ClaimDetailsVerticalIconMenu from './components/ClaimDetailsVerticalIconMenu'
import ClaimValue from './components/ClaimValue'
import Modal from './sharedComponent/Modal'
import Tooltip from './sharedComponent/Tooltip'
import AuditTypeContent from './components/AuditTypeContent'
import moment from 'moment'

import ProfectusCommon from '../../utils'

class ClaimDetailsPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      claim: {},
      isLoading: false,
      childClaims: [],
      schema: undefined,
      transitionDataFields: undefined,
      triggerModal: 0,
      modalTitle: '',
    }

    this.newUICustomuized = React.createRef()

    this.handleUpdate = this.handleUpdate.bind(this)

    this.hasValidationError = this.hasValidationError.bind(this)

    this.project = this.project.bind(this)
    this.organisation = this.organisation.bind(this)

    this.loadField = ProfectusCommon.util.loadField.bind(this)
    this.load = this.load.bind(this)

    this.handleCloseNewModal = this.handleCloseNewModal.bind(this)

    this.onHandleOpenModal = this.onHandleOpenModal.bind(this)

    this.getSentToData = this.getSentToData.bind(this)
  }

  componentDidMount() {
    this.load()
  }

  onHandleOpenModal(type) {
    switch (type) {
      case 2:
        this.setState({
          triggerModal: 2,
          modalTitle: 'Claim Invoiced Details',
        })
        break
      case 3:
        this.setState({
          triggerModal: 3,
          modalTitle: 'Cancel amount details',
        })
        break
      case 4:
        this.setState({
          triggerModal: 4,
          modalTitle: 'Claim Reversal Details',
        })
        break
      case 5:
        this.setState({
          triggerModal: 5,
          modalTitle: 'Claim Cancel Details',
        })
        break

      default:
        this.setState({
          triggerModal: 0,
          modalTitle: '',
        })
        break
    }
  }

  handleCloseNewModal() {
    this.setState({
      triggerModal: 0,
      modalTitle: '',
    })
  }

  handleUpdate(fieldId, value) {
    const patchedClaim = ProfectusCommon.util.setValueOnPath(
      fieldId,
      value,
      this.state.claim,
    )
    this.setState({ claim: patchedClaim })
    this.load()
  }

  load() {
    this.loadField(`${window.location.href}read.json`, 'claim')
    this.loadField(`${window.location.href}child-claims.json`, 'childClaims')
    this.loadField(`${window.location.href}schema.json`, 'schema')
    this.loadField(
      `${window.location.href}schema-process-properties.json`,
      'transitionDataFields',
    )
  }

  hasValidationError(data) {
    let hasError = data.some((item) => !item.valid)
    return hasError
  }

  project() {
    let projectDetails = {}
    if (this.state.claim) {
      projectDetails = this.state.claim.projectDetails
    }
    return projectDetails
  }

  organisation() {
    let organisationDetails = {}
    const project = this.project()
    if (project) {
      organisationDetails = this.project().organisationDetails
    }
    return organisationDetails
  }

  renderClaimDetailsSection() {
    return (
      <ClaimDetailsVerticalIconMenu
        externalActiveKeyTab={1}
        id={this.state.claim.id}
        claim={this.state.claim}
        transitionDataFields={this.state.transitionDataFields}
        profileCompleteness={this.state.profileCompleteness}
        childClaims={this.state.childClaims}
        schema={this.state.schema}
        onUpdate={this.handleUpdate}
        canEdit={
          this.state.claim.state && this.state.claim.state.name === 'Draft'
        }
      />
    )
  }

  renderAuditTypeContent() {
    if (!this.state.claim.projectDetails) return <></>
    switch (this.state.claim.projectDetails.auditType.name) {
      case 'CC':
      case 'RA':
        return (
          <div>
            <AuditTypeContent>
              {this.renderClaimDetailsSection()}
            </AuditTypeContent>
          </div>
        )
      case 'CA':
      case 'SA':
        return (
          <div>
            <AuditTypeContent variants="secondary">
              {this.renderClaimDetailsSection()}
            </AuditTypeContent>
          </div>
        )
      default:
        break
    }
  }

  getSentToData(fieldName) {
    const sentToSchema =
      this.state.schema &&
      this.state.schema.properties.find(
        (item) => item.attributeName === fieldName,
      )
    const displayName = sentToSchema && sentToSchema.displayName
    const sentToTime =
      this.state.claim &&
      this.state.claim.attributes &&
      this.state.claim.attributes[fieldName] &&
      moment(this.state.claim.attributes[fieldName]).format(
        sentToSchema.dataFormat,
      )
    return { displayName, sentToTime }
  }

  render() {
    const claim = this.state.claim || {}
    const vendor = claim.vendorApplicationDetails || {}
    const company = claim.companyApplicationDetails || {}

    let companies
    if (!this.state.isLoading && claim && claim.vendorApplicationDetails) {
      if (company && claim.multiCompanyOrganisation) {
        companies = (
          <a
            href={`${window.location.pathname}/organisations/${
              this.organisation().key
            }/companies/${company.key}`}
          >
            {company.name}
          </a>
        )
      }
    }

    const showCancellationIcon =
      this.state.claim.amountCancellationAllowed ||
      this.state.claim.hasAnyAmountCancellation
    const currentAmountWithCancellationIcon = (
      <div className="rft-amount-money">
        <ClaimValue
          netClaimAmount={this.state.claim.currentClaimExTax}
          className="claim-value"
          tooltip={<Tooltip title="Claim amount excluding local taxes" />}
        />
      </div>
    )

    let originalAmount
    if (this.state.claim.currentClaimExTax !== this.state.claim.claimExTax) {
      let cssClassNameForOrigialClaimAmount = ''
      if (showCancellationIcon) {
        cssClassNameForOrigialClaimAmount = 'original-claim-amount'
      }
      originalAmount = (
        <div className={cssClassNameForOrigialClaimAmount}>
          <ClaimValue
            netClaimAmount={this.state.claim.claimExTax}
            className="claim-sub-value"
            tooltip={
              <Tooltip title="Original claim amount excluding local taxes" />
            }
          />
        </div>
      )
    }

    return (
      <div ref={this.newUICustomuized}>
        <Modal
          isShow={this.state.triggerModal}
          onClose={this.handleCloseNewModal}
          title={this.state.modalTitle}
          externalActiveKeyTab={this.state.triggerModal}
        />

        <div className="rft-container row-between-start rft-bg-white rft-pt-60 rft-font-family-roboto">
          <div className="rft-claim-detail-content">
            <div className="rft-claim-detail-big-id">
              {this.state.claim.claimNumber}
            </div>
            <div className="row-start-center rft-mb-20">
              {ProfectusCommon.util.isNotEmpty(companies) && (
                <div>
                  <div>
                    <div className="rft-company-name-container">
                      <IconCompany />
                      <span
                        style={{
                          marginLeft: '4px',
                        }}
                      >
                        {companies}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{ marginLeft: '8px', marginRight: '8px' }}
                    className="col-center-center"
                  >
                    <IconRight />
                  </div>
                </div>
              )}

              <div className="">
                <div className="row-start-center">
                  <IconBag />
                  {!this.state.isLoading && this.project() ? (
                    <div
                      style={{ marginLeft: '4px' }}
                      className="rft-claim-detail-link-top-text"
                    >
                      <a
                        href={`${window.location.pathname}/projects/${
                          this.project().id
                        }`}
                      >
                        {this.project().name}
                      </a>
                    </div>
                  ) : (
                    <span className="loading-content-blank smaller">
                      &nbsp;
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{ marginLeft: '8px', marginRight: '8px' }}
                className="col-center-center"
              >
                <IconRight />
              </div>
              <div>
                <div className="row-start-center">
                  <IconCompany />

                  {!this.state.isLoading && this.state.claim ? (
                    <span style={{ marginLeft: '4px' }}>
                      {this.state.claim.vendorApplicationDetails && (
                        <span>
                          <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip title="Vendor" />}
                          >
                            <a
                              href={`${
                                window.location.pathname
                              }/organisations/${
                                this.organisation().key
                              }/companies/${company.key}/vendors/${vendor.key}`}
                            >
                              <div className="rft-claim-detail-link-top-text">
                                {claim.vendorApplicationDetails.name}
                              </div>
                            </a>
                          </OverlayTrigger>
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="loading-content-blank small">&nbsp;</span>
                  )}
                </div>
              </div>
            </div>
            <div className="row-start-center rft-mb-18">
              {this.state.claim.claimCodeDetails && (
                <span className="rft-mr-28 rft-weight-600 rft-typo-14-21 rft-color-blue-300 rft-bg-blue-30 rft-radius-3 rft-pt-4 rft-pb-4 rft-pl-8 rft-pr-8">
                  {this.state.claim.claimCodeDetails.claimTypeDetails.name}
                </span>
              )}
              {this.state.claim.claimCodeDetails && (
                <div>
                  {this.state.claim.claimCodeDetails.claimTypeDetails.name ===
                    'Duplicates' && (
                    <div className="rft-duplicated-icon-container">
                      <div className="rft-duplicated-icon">
                        {this.renderClaimDetailsSection()}
                      </div>
                      <span className="rft-link1">Duplicate Details</span>
                    </div>
                  )}
                </div>
              )}

              {this.state.claim.state && (
                <div>
                  {this.state.claim.state.name === 'Cancelled' && (
                    <span
                      onClick={() => this.onHandleOpenModal(5)}
                      className="rft-link1"
                    >
                      Claim Cancel Details
                    </span>
                  )}
                </div>
              )}

              {this.state.claim.workflowProcessDetailsByCode && (
                <div>
                  {this.state.claim.workflowProcessDetailsByCode
                    .cancelAmount && (
                    <div>
                      {this.state.claim.workflowProcessDetailsByCode
                        .cancelAmount.workflowProcessDatafields && (
                        <span
                          onClick={() => this.onHandleOpenModal(3)}
                          className="rft-link1"
                        >
                          Cancel amount details
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {this.state.claim.workflowProcessDetailsByCode && (
                <div>
                  {this.state.claim.workflowProcessDetailsByCode
                    .claimInvoiced && (
                    <span
                      onClick={() => this.onHandleOpenModal(2)}
                      className="rft-link1"
                    >
                      Claim Invoiced Details
                    </span>
                  )}
                </div>
              )}

              {this.state.claim.hasReversal && (
                <span
                  onClick={() => this.onHandleOpenModal(4)}
                  className="rft-link1"
                >
                  Claim Reversal Details
                </span>
              )}
            </div>

            {this.state.claim.projectDetails && (
              <div>
                {this.state.claim.projectDetails.auditType.name === 'RA' && (
                  <div className="rft-claim-descripton-edit">
                    {this.renderAuditTypeContent()}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rft-claim-detail-menu">
            <div className="rft-bb-solid-blue-50 rft-pb-24">
              <div className="rft-mb-24">
                <div className="rft-mb-4 rft-amount-money-block">
                  {currentAmountWithCancellationIcon}
                  {originalAmount}
                </div>
                <div className="rft-typo-14-21 rft-color-blue-400 rft-weight-500">
                  Claim Amount
                </div>
              </div>
              <div className="rft-mb-16">
                <div className="rft-claim-work-flow_status ">Status</div>

                <div className="rft-claim-work-flow">
                  {this.state.claim.state && (
                    <div className="rft-claim-work-flow_fakebutton">
                      {this.state.claim.secondryTransition ? (
                        <span>
                          {this.state.claim.state && claim.state.name} (
                          {this.state.claim.secondryTransition.toState.name})
                        </span>
                      ) : (
                        <span>
                          {this.state.claim.state &&
                            this.state.claim.state.name}
                        </span>
                      )}
                      <IconDown />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="rft-assignne__title">Assignee</div>
                <div className="rft-assignne__button">
                  <span>Prida Singh</span>
                  <IconDown />
                </div>
              </div>
            </div>
            <div className="rft-sentto-block">
              <div className="rft-sentto-block_first">
                <div className="rft-sentto-block__title">
                  {this.getSentToData('sentToClient').displayName}
                </div>
                <div className="rft-sentto-block__value">
                  {this.getSentToData('sentToClient').sentToTime}
                </div>
              </div>
              <div>
                <div className="rft-sentto-block__title">
                  {this.getSentToData('sentToSupplier').displayName}
                </div>
                <div className="rft-sentto-block__value">
                  {this.getSentToData('sentToSupplier').sentToTime}
                </div>
              </div>
            </div>

            {this.renderAuditTypeContent()}
          </div>
        </div>
      </div>
    )
  }
}

export default ClaimDetailsPage
