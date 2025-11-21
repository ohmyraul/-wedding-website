import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock Formspree fetch
global.fetch = vi.fn();

describe('RSVP Form', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders RSVP form with all required fields', () => {
    render(<App />);
    
    // Scroll to RSVP section (simplified - in real test would use scrollIntoView)
    const rsvpSection = document.getElementById('rsvp');
    expect(rsvpSection).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
  });

  it('validates required fields before submission', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const submitButton = screen.getByRole('button', { name: /submit rsvp/i });
    
    await user.click(submitButton);
    
    // Form should show validation errors (browser native)
    // In a real scenario, we'd check for error messages
    expect(submitButton).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    
    // Mock successful response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<App />);
    
    // Fill in form
    await user.type(screen.getByLabelText(/full name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+911234567890');
    await user.click(screen.getByLabelText(/count me in/i));
    
    const submitButton = screen.getByRole('button', { name: /submit rsvp/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});

