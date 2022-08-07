import React from 'react';
import {
  screen,
  waitFor
} from '@testing-library/react';
import Tooltip from "..";
import { render } from "../../../../../utils/testing";
import '@testing-library/jest-dom'

describe('Tooltip', () => {
  it('matches snapshot', () => {
    const { container } = render(<Tooltip />)
    // eslint-disable-next-line testing-library/no-container
    expect(container.cloneNode(true)).toMatchSnapshot();
  })
  it('should show title', async () => {
    render(<Tooltip title="Hello World"/>)

    const tooltipText = await waitFor(() => screen.findByText('Hello World'))
    expect(tooltipText).toBeInTheDocument();
  })
})