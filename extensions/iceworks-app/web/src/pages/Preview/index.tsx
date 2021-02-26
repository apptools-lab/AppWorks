import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Previewer from './components/Previewer';
import { Context } from './context';
import { BLANK_URL } from './config';
import styles from './index.module.scss';

if (!window.__PREVIEW__DATA__) {
  window.__PREVIEW__DATA__ = {};
}

// Example：
// window.__PREVIEW__DATA__ = {
//   startUrl: 'http://xx.xx.xx.xx:3333/',
//   startQRCodeInfo: {
//     web: ['http://xx.xx.xx.xx:3333/', 'http://xx.xx.xx.xx:3333/home', 'http://xx.xx.xx.xx:3333/detail'],
//     weex: ['http://xx.xx.xx.xx:3333/weex/index.js?wh_weex=true'],
//     kraken: ['http://xx.xx.xx.xx:3333/kraken/index.js'],
//   },
// };

export default function () {
  // @ts-ignore
  const [url, setUrl] = useState(window.__PREVIEW__DATA__.startUrl || BLANK_URL);
  const previewerRef = useRef(null);

  return (
    <Context.Provider value={{ url, setUrl, previewerRef }}>
      <div className={styles.container} >
        <Header />
        <Previewer ref={previewerRef} />
      </div>
    </Context.Provider>
  );
}
