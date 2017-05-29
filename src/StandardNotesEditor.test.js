import React from 'react';
import ReactDOM from 'react-dom';
import StandardNotesEditor from './StandardNotesEditor';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StandardNotesEditor />, div);
});
