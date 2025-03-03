import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

test('renders Navbar and Dashboard components', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Verify that the Navbar is present
  expect(screen.getByRole('navigation')).toBeInTheDocument();

  // Verify that the Dashboard (default route) is displayed
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});