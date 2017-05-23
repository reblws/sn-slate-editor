import React from 'react';
import './App.css';

import { Editor, Plain } from 'slate';
import MarkdownPlugin from 'slate-markdown';

const markdown = MarkdownPlugin();

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = ({ state: Plain.deserialize('hey') });

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount () {
    if (window.parent !== window) {
      window.parent.postMessage({ status: 'ready' }, '*');
    }

    window.addEventListener('message', e => {
      window.noteId = e.data.id;
      const receivedText = Plain.deserialize(e.data.text);

      this.setState({
        state: receivedText
      });
    }, false);
  }

  onChange (state) {
    // Update local state
    this.setState({ state });

    // Send back to SN
    const noteToSendBack = Plain.serialize(this.state.state);

    if (window.parent !== window) {
      window.parent.postMessage({text: noteToSendBack, id: window.noteId}, '*');
    }
  }

  onKeyDown (event) {
    // Flesh this out later
    console.log(event.which);
  }

  render () {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        plugins={[markdown]}
      />
    );
  }
}

export default App;
