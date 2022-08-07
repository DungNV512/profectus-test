import React from 'react';
import { render } from "../../utils/testing";
import TabContainer from "../TabContainer";

const MOCK_TABS = [
  {
    eventKey: 'tab-1',
    label: 'Tab 1',
    content: 'Tab 1'
  }
]

describe('TabContainer', () => {
  it('matches snapshot', () => {
    const { container } = render(<TabContainer tabs={MOCK_TABS}/>)
    // eslint-disable-next-line testing-library/no-container
    expect(container.cloneNode(true)).toMatchSnapshot();
  })
})