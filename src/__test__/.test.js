import React from 'react';
import { render, screen } from '@testing-library/react';
import UserComponent from '../screens/Masters/UserMaster/UserComponent';

test('renders UserComponent without errors', () => {
  render(<UserComponent />);
  
  // Use assertions to validate the rendered component
  const someElement = screen.getByTestId('some-element'); // Replace with an actual test ID or content
  expect(someElement).toBeInTheDocument();

  // Add more assertions as needed to test the component's behavior
});
