/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CarList from '../components/CarList';

const cars = [
  { _id: '1', make: 'Honda', model: 'Civic' },
  { _id: '2', make: 'Toyota', model: 'Corolla' },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CarList', () => {
  it('renders cars returned from the API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => cars,
    }));

    render(<CarList />);

    await waitFor(() => {
      expect(screen.getByText('Honda Civic')).toBeInTheDocument();
      expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    });
  });
});
