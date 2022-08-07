import React from 'react'
import { ReactComponent as IconClose } from '../../assets/IconClose.svg'
import OutsideClickHandler from 'react-outside-click-handler'
import ClaimDetailsVerticalIconMenu from '../../components/ClaimDetailsVerticalIconMenu'

const Modal = ({
  isShow = false,
  title = '',
  onClose = () => {},
  externalActiveKeyTab,
}) => {
  if (!isShow) return <></>
  return (
    <div className="rft-claim-reversal-details">
      <OutsideClickHandler onOutsideClick={onClose}>
        <div className="rft-claim-reversal-details_content">
          <div className="rft-claim-reversal-details_title">{title}</div>
          <div className="rft-claim-cancel-details_field">
            <ClaimDetailsVerticalIconMenu
              externalActiveKeyTab={externalActiveKeyTab}
              id={this.state.claim.id}
              claim={this.state.claim}
              transitionDataFields={this.state.transitionDataFields}
              profileCompleteness={this.state.profileCompleteness}
              childClaims={this.state.childClaims}
              schema={this.state.schema}
              onUpdate={this.handleUpdate}
              canEdit={
                this.state.claim.state &&
                this.state.claim.state.name === 'Draft'
              }
            />
          </div>
          <IconClose onClick={onClose} />
        </div>
      </OutsideClickHandler>
    </div>
  )
}

export default Modal
