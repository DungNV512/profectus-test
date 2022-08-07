import React from 'react';
import { render } from "../../utils/testing";
import HTabContainer from "../HTabContainer";

const MOCK_TABS = [
  {
    eventKey: 'tab-1',
    label: 'Tab 1',
    content: 'Tab 1'
  }
]

describe('HTabContainer', () => {
  it('matches snapshot', () => {
    const { container } = render(<HTabContainer tabs={MOCK_TABS} />)
    // eslint-disable-next-line testing-library/no-container
    expect(container.cloneNode(true)).toMatchSnapshot();
  })
})