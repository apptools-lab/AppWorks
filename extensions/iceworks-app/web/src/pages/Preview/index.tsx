import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Previewer from './components/Previewer';
import { BLANK_URL } from './config';
import styles from './index.module.scss';

if (!window.__PREVIEW__DATA__) {
  window.__PREVIEW__DATA__ = {};
}

// Example：
// window.__PREVIEW__DATA__ = {
//   startUrl: ' http://xx.xx.xx.xx:3333/',
//   startQRCodeInfo: {
//     Web: 'http://xx.xx.xx.xx:3333/',
//     Weex: 'http://xx.xx.xx.xx:3333/weex/index.js?wh_weex=true',
//     Kraken: 'http://xx.xx.xx.xx:3333/kraken/index.js',
//   },
// };

export default function () {
  // @ts-ignore
  const [url, setUrl] = useState(window.__PREVIEW__DATA__.startUrl || BLANK_URL);
  const previewerRef = useRef(null);

  return (
    <div className={styles.container} >
      <Header url={url} setUrl={setUrl} refresh={() => { previewerRef.current.refresh(); }} />
      <Previewer ref={previewerRef} url={url} />
    </div>
  );
}
