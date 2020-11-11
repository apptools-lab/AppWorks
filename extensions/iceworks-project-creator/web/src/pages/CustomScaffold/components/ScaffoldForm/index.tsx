import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Icon } from '@alifd/next';
import LayoutConfig from '../LayoutConfig';
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
    iframeRef.current.contentWindow.document.write(`
    <!DOCTYPE html>

    <html>
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge,chrome=1" />
      <meta name="viewport" content="width=device-width" />
      <title>Iceworks Application Creator -- Scaffold Template</title>
      <link rel="shortcut icon" href="/favicon.png">

      <style>
        body {
          background-color: #fff;
          color: #000;
          margin: 0;
        }
      </style>
    </head>

    <body>
      <div id="ice-container"></div>
      <script>
        console.log('window.parent', window.parent);
        const script = document.createElement('script');
        script.type = "text/javascript";
        script.src = (window.parent.__ICEWORKS_RESOURCE__ && window.parent.__ICEWORKS_RESOURCE__.iframeScriptUri) || '/js/scaffoldtemplate.js';
        const body = document.getElementsByTagName('body');
        body[0].appendChild(script);

        const link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = (window.parent.__ICEWORKS_RESOURCE__ && window.parent.__ICEWORKS_RESOURCE__.iframeStyleUri) || 'css/scaffoldtemplate.css';
        const head = document.getElementsByTagName('head');
        head[0].appendChild(link);
      </script>
    </body>

    </html>
    `);
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
          width={400}
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
