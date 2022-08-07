import React from 'react';
import { render } from "../../utils/testing";
import Select from "../Select";

describe('Select', () => {
  it('matches snapshot', () => {
    const { container } = render(<Select />)
    // eslint-disable-next-line testing-library/no-container
    expect(container.cloneNode(true)).toMatchSnapshot();
  })
})