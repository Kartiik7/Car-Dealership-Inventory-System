/** @vitest-environment jsdom */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { cleanup, render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../components/Login';
import Register from '../components/Register';

const renderLogin = () =>
  render(
    <AuthContext.Provider value={{ user: null, token: '', login: vi.fn(), logout: vi.fn() }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  );

const renderRegister = () =>
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );

beforeEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe('Auth pages', () => {
  it('renders the Login form fields and submit button', () => {
    const { container } = renderLogin();
    const view = within(container);

    expect(view.getByLabelText(/email/i)).toBeInTheDocument();
    expect(view.getByLabelText(/password/i)).toBeInTheDocument();
    expect(view.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders the Register form fields', () => {
    const { container } = renderRegister();
    const view = within(container);

    expect(view.getByLabelText(/name/i)).toBeInTheDocument();
    expect(view.getByLabelText(/email/i)).toBeInTheDocument();
    expect(view.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits the Login form with mocked API response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'token' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { container } = renderLogin();
    const view = within(container);

    fireEvent.change(view.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(view.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(view.getByRole('button', { name: /login/i }));

    expect(fetchMock).toHaveBeenCalled();
  });

  it('shows an error message for invalid login credentials', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Invalid login credentials' }),
    }));

    const { container } = renderLogin();
    const view = within(container);

    fireEvent.change(view.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(view.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(view.getByRole('button', { name: /login/i }));

    expect(await view.findByText(/invalid login credentials/i)).toBeInTheDocument();
  });
});
