import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Previewer from './components/Previewer';
import { Context } from './context';
import { BLANK_URL } from './config';
import styles from './index.module.scss';
import callService from '../../callService';

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
  // debugComment Reset To Black URL
  const [url, setUrl] = useState(window.__PREVIEW__DATA__.startUrl || BLANK_URL);
  const [useMobileDevice, setUseMobileDevice] = useState(false);
  const previewerRef = useRef(null);

  useEffect(() => {
    async function initPreview() {
      const { useMobileDebug } = await callService('debug', 'getDebugConfig');
      setUseMobileDevice(useMobileDebug);
    }
    initPreview();
  }, []);

  function reverseMobileDeviceConfig() {
    setUseMobileDevice(!useMobileDevice);
    console.log('Reversed. now useMobileDevice is ', !useMobileDevice);
  }

  return (
    <Context.Provider value={{ url, setUrl, previewerRef }}>
      <div className={styles.container} >
        <Header reverseMobileDeviceConfig={reverseMobileDeviceConfig} />
        <Previewer ref={previewerRef} useMobileDevice={useMobileDevice} />
      </div>
    </Context.Provider>
  );
}
