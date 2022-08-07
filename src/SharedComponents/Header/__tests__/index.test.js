/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../utils/testing';
import Header from '../index';
import '@testing-library/jest-dom';

describe('Header', () => {
  it('renders a logo', () => {
    render(<Header />);

    const logoEl = screen.getByRole('img');
    expect(logoEl).toBeInTheDocument();
  });
});
