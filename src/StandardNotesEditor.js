import React from 'react';
import { Editor, Plain } from 'slate';
import MarkdownPlugin from 'slate-markdown';

const markdownPlugin = MarkdownPlugin({
  sizes: [
    '2em',    // h1
    '1.75em', // h2
    '1.5em',  // h3
    '1.25em', // h4
    '1em',    // h5
  ],
});

class StandardNotesEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({ state: Plain.deserialize('') });
    this.onChange = this.onChange.bind(this);
    this.onDocumentChange = this.onDocumentChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    // Create SN listeners
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
    // Update local editor state
    this.setState({ state });
  }

  onDocumentChange() {
    // Send changed note back to SN
    const noteToSendBack = Plain.serialize(this.state.state);

    if (window.parent !== window) {
      window.parent.postMessage({
        text: noteToSendBack,
        id: window.noteId,
      }, '*');
    }
  }

  onKeyDown(event, data, state) {
    // Watch for tab
    if (event.which !== 9) return;

    event.preventDefault();

    const newState = state
      .transform()
      .insertText('\t')
      .apply();

    return newState;
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
        onDocumentChange={this.onDocumentChange}
        onKeyDown={this.onKeyDown}
        plugins={[markdownPlugin]}
      />
    );
  }
}

export default StandardNotesEditor;
