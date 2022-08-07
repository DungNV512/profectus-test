import React from 'react'
import { Tooltip as TooltipBootstrap } from 'react-bootstrap'

const Tooltip = ({ title = '' }) => {
  return (
    <TooltipBootstrap
      id="claim-cancellation-glyph-tooltip"
      placement="bottom"
      className="in"
    >
      {title}
    </TooltipBootstrap>
  )
}

export default Tooltip
