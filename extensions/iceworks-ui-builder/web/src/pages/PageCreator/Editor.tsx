import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import styles from './Editor.module.scss';

export default class Editor extends React.Component {
  render() {
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <div className={styles.wrap}>
        <MonacoEditor
          height="400"
          language="javascript"
          theme="vs-dark"
          options={options}
          {...this.props}
        />
      </div>
    );
  }
}