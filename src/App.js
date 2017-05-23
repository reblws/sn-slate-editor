import React from 'react';
import { Editor, Plain } from 'slate';
// import MarkdownPlugin from 'slate-markdown';
import Markdown from './lib/MarkdownRenderer';
import './App.css';


// const markdownPlugin = MarkdownPlugin({
//   sizes: [
//     '2em',    // h1
//     '1.75em', // h2
//     '1.5em',  // h3
//     '1.25em', // h4
//     '1em',     // Base
//   ],
// });

// const plugins = [markdownPlugin];

const SCHEMA = {
  marks: {
    bold: props => <strong>{props.children}</strong>,
    code: props => <code>{props.children}</code>,
    italic: props => <em>{props.children}</em>,
    underlined: props => <u>{props.children}</u>,
    deleted: props => <del>{props.children}</del>,
    added: props => <span>{props.children}</span>,
  },
  nodes: {
    paragraph: props => <p>{props.children}</p>,
    'block-quote': props => <blockquote>{props.children}</blockquote>,
    'horizontal-rule': props => <hr />,
    'bulleted-list': props => <ul>{props.children}</ul>,
    'ordered-list': props => <ol>{props.children}</ol>,
    'todo-list': props => <ul>{props.children}</ul>,
    'list-item': props => <li>{props.children}</li>,
    image: props => <img src={props.src} title={props.title} />,
    link: props => <a href={props.href}>{props.children}</a>,
    table: props => <table>{props.children}</table>,
    'table-row': props => <tr>{props.children}</tr>,
    'table-head': props => <th>{props.children}</th>,
    'table-cell': props => <td>{props.children}</td>,
    heading1: props => <h1>{props.children}</h1>,
    heading2: props => <h2>{props.children}</h2>,
    heading3: props => <h3>{props.children}</h3>,
    heading4: props => <h4>{props.children}</h4>,
    heading5: props => <h5>{props.children}</h5>,
    heading6: props => <h6>{props.children}</h6>,
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({ state: Markdown.deserialize('#hey') });
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    if (window.parent !== window) {
      window.parent.postMessage({ status: 'ready' }, '*');
    }

    window.addEventListener('message', (event) => {
      window.noteId = event.data.id;
      const receivedText = Markdown.deserialize(event.data.text);
      this.setState({
        state: receivedText,
      });
    }, false);
  }

  onChange(state) {
    // Update local state
    this.setState({ state });

    // Send back to SN
    const noteToSendBack = Markdown.serialize(this.state.state);

    if (window.parent !== window) {
      window.parent.postMessage({ text: noteToSendBack, id: window.noteId }, '*');
    }
  }

  // onKeyDown(event) {
  //   //  TODO: Write shortcutHandler function and use this function to call it
  // }

  render() {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        schema={SCHEMA}
      />
    );
  }
}

export default App;
