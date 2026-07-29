/** @vitest-environment jsdom */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Login';
import Register from '../components/Register';

describe('Auth pages', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the Login form fields and submit button', () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders the Register form fields', () => {
    render(<Register />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits the Login form with mocked API response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'token' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(fetchMock).toHaveBeenCalled();
  });

  it('shows an error message for invalid login credentials', () => {
    render(<Login />);

    expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
  });
});
