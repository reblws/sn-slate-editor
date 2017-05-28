import React from 'react';
import './App.css';

import { Editor, Plain } from 'slate';
import MarkdownPlugin from 'slate-markdown';

const markdownPlugin = MarkdownPlugin({
  sizes: [
    '2em',    // h1
    '1.75em', // h2
    '1.5em',  // h3
    '1.25em', // h4
    '1em',     // Base
  ],
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({ state: Plain.deserialize('hey') });
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    if (window.parent !== window) {
      window.parent.postMessage({ status: 'ready' }, '*');
    }

    window.addEventListener('message', (event) => {
      window.noteId = event.data.id;
      const receivedText = Plain.deserialize(event.data.text);
      this.setState({
        state: receivedText,
      });
    }, false);
  }

  onChange(state) {
    // Update local state
    this.setState({ state });

    // Send back to SN
    const noteToSendBack = Plain.serialize(this.state.state);

    if (window.parent !== window) {
      window.parent.postMessage({ text: noteToSendBack, id: window.noteId }, '*');
    }
  }

  onKeyDown(event) {
    // Flesh this out later
    console.log(event.which);
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        plugins={[markdownPlugin]}
      />
    );
  }
}

export default App;
