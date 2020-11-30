import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Previewer from './components/Previewer';
import styles from './index.module.scss';

export default function () {
  // @ts-ignore
  const [url, setUrl] = useState(window.__URL__ || 'about:blank');
  const previewerRef = useRef(null);

  return (
    <div className={styles.container} >
      <Header url={url} setUrl={setUrl} refresh={() => { previewerRef.current.refresh(); }} />
      <Previewer ref={previewerRef} url={url} />
    </div>
  );
}
