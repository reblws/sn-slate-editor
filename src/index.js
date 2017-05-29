import React from 'react';
import ReactDOM from 'react-dom';
import StandardNotesEditor from './StandardNotesEditor';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<StandardNotesEditor />, document.getElementById('root'));
registerServiceWorker();
