import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Editor, Plain } from 'slate';


class App extends React.Component {

  state = {
    state: Plain.deserialize(''),
  }

  componentDidMount() {
    if(window.parent != window) {
      window.parent.postMessage({ status: "ready" }, '*');
    }

    window.addEventListener('message', e => {
      window.noteId = e.data.id;
      const receivedText = Plain.deserialize(e.data.text);

      this.setState({
        state: receivedText
      })

    }, false)
  }

  onChange = (state) => {
    // Update local state
    this.setState({ state });

    // Send back to SN
    const noteToSendBack = Plain.serialize(this.state.state);

    if (window.parent != window) {
      window.parent.postMessage({text: noteToSendBack, id: window.noteId}, '*');
    }
  }

  onKeydown = (event) => {
    // Flesh this out later
    console.log(event.which);
  }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
    )
  }
}

export default App;
