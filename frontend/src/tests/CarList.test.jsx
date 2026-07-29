/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import CarList from '../components/CarList';

describe('CarList', () => {
  it('renders each car in the inventory', () => {
    const cars = [
      { _id: '1', make: 'Honda', model: 'Civic', year: 2021, price: 22000 },
      { _id: '2', make: 'Toyota', model: 'Corolla', year: 2022, price: 24000 },
    ];

    render(<CarList cars={cars} />);

    expect(screen.getByText('Honda')).toBeInTheDocument();
    expect(screen.getByText('Civic')).toBeInTheDocument();
    expect(screen.getByText('2021')).toBeInTheDocument();
    expect(screen.getByText('22000')).toBeInTheDocument();
    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Corolla')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('24000')).toBeInTheDocument();
  });

  it('renders an empty state when there are no cars', () => {
    render(<CarList cars={[]} />);

    expect(screen.getByText('No cars in inventory')).toBeInTheDocument();
  });
});
