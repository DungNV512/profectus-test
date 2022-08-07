import React from 'react'

const AuditTypeContent = ({ variants = 'primary', children }) => {
  if (variants === 'secondary') {
    return (
      <div>
        <div className="rft-block-money">
          <div className="rft-block-money-1">{children}</div>
          <div className="rft-block-money-2">{children}</div>
          <div className="rft-block-money-3">{children}</div>
        </div>
        <div className="rft-block-other">
          <div className="rft-block-tag">{children}</div>

          <div className="rft-type-claim-common rft-CA-block-process-date">
            {children}
          </div>
          <div className="rft-CA-block-gl-net-pay">{children}</div>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="rft-block-money">
        <div className="rft-block-money-1">{children}</div>
        <div className="rft-block-money-2">{children}</div>
        <div className="rft-block-money-3">{children}</div>
      </div>
      <div className="rft-block-other">
        <div className="rft-block-tag">{children}</div>
        <div className="rft-block-claim-reason">{children}</div>

        <div className="rft-block-invoice-number">{children}</div>

        <div className="rft-block-start-date">{children}</div>
        <div className="rft-block-end-date">{children}</div>
        <div className="rft-block-currency">{children}</div>
        <div className="rft-block-merch">{children}</div>
        <div className="rft-block-classification">{children}</div>
        <div className="rft-block-SKU">{children}</div>
      </div>
    </div>
  )
}

export default AuditTypeContent
