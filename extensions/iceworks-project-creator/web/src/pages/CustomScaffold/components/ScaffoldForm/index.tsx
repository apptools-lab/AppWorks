import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Icon } from '@alifd/next';
import LayoutConfig from '../LayoutConfig';
import { Base64 } from 'js-base64';
import styles from './index.module.scss';

const Scaffoldform = ({ children, onChange, scaffoldValue }) => {
  const iframeRef = useRef(null);

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const onDrawerOpen = () => {
    setDrawerVisible(true);
  };

  const onDrawerClose = () => {
    setDrawerVisible(false);
  };

  const sendMessage = (content: string) => {
    iframeRef.current.contentWindow.postMessage(content, '/');
  };

  const injectIframeContent = () => {
    iframeRef.current.contentWindow.document.open();
    iframeRef.current.contentWindow.document.write(Base64.decode(window.iframeContent));
    iframeRef.current.contentWindow.document.close();
  };

  useEffect(() => {
    injectIframeContent();
  }, []);

  useEffect(() => {
    sendMessage(JSON.stringify(scaffoldValue));
  }, [scaffoldValue]);
  return (
    <div className={styles.scaffoldScaffold}>
      <div className={styles.content}>
        <iframe ref={iframeRef} className={styles.scaffoldTemplateIframe} frameBorder="0" name="scaffoldTemplate" />
        <div onClick={() => onDrawerOpen()} className={styles.drawerBtn}><Icon type="set" size="large" /></div>
        <Drawer
          visible={drawerVisible}
          placement="right"
          width={360}
          onClose={onDrawerClose}
        >
          <LayoutConfig value={scaffoldValue} onChange={onChange} />
        </Drawer>
      </div>
      <div className={styles.action}>{children}</div>
    </div>
  );
};

export default Scaffoldform;
