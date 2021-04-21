import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@alifd/next';
import LayoutConfig from '../LayoutConfig';
import { Base64 } from 'js-base64';
import styles from './index.module.scss';

const Scaffoldform = ({ children, onChange, scaffoldValue }) => {
  const iframeRef = useRef(null);

  const [configVisible, setConfigVisible] = useState<boolean>(true);

  const onToggle = () => {
    setConfigVisible(!configVisible);
  };

  const sendMessage = (content: string) => {
    iframeRef.current.contentWindow.postMessage(content, '/');
  };

  const injectIframeContent = () => {
    iframeRef.current.contentWindow.document.open();
    iframeRef.current.contentWindow.document.write(Base64.decode(window.iframeContent));
    iframeRef.current.contentWindow.document.close();
    iframeRef.current.onload = () => {
      sendMessage(JSON.stringify(scaffoldValue));
    };
  };

  useEffect(() => {
    injectIframeContent();
  }, []);

  useEffect(() => {
    sendMessage(JSON.stringify(scaffoldValue));
  }, [scaffoldValue]);
  return (
    <div className={styles.scaffoldForm}>
      <div className={styles.content}>
        <iframe ref={iframeRef} className={styles.scaffoldTemplateIframe} frameBorder="0" name="scaffoldTemplate" />
        <div onClick={() => onToggle()} className={styles.configBtn}><Icon type="set" size="large" /></div>
        {
          configVisible && (
          <div className={styles.config}>
            <div onClick={() => onToggle()} className={styles.closeConfigBtn}><Icon type="arrow-right" size="large" /></div>
            <LayoutConfig value={scaffoldValue} onChange={onChange} />
          </div>
          )
        }
      </div>
      <div className={styles.action}>{children}</div>
    </div>
  );
};

export default Scaffoldform;
