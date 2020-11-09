import React, { useEffect, useRef } from 'react';
import { ResponsiveGrid } from '@alifd/next';
import LayoutConfig from '../LayoutConfig';
import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;

const Scaffoldform = ({ children, onChange, value }) => {
  const iframeRef = useRef(null);

  const injectIframeContent = () => {
    console.log(iframeRef.current)
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
    `
    );
    iframeRef.current.contentWindow.document.close();
  };

  useEffect(() => {
    injectIframeContent();
  }, []);
  return (
    <div className={styles.scaffoldScaffold}>
      <ResponsiveGrid gap={30} className={styles.grid}>
        <Cell colSpan={9}>
          <iframe ref={iframeRef} className={styles.scaffoldTemplateIframe} frameBorder="0"></iframe>
        </Cell>
        <Cell colSpan={3}>
          <LayoutConfig value={value.layouts} onChange={onChange} />
        </Cell>
      </ResponsiveGrid>
      <div className={styles.action}>{children}</div>
    </div>
  );
};

export default Scaffoldform;
