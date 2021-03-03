import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import LoadingPercent from '../LoadingPercent';
import { Context } from '../../context';
import { BLANK_URL } from '../../config';
import callService from '../../../../callService';
import styles from './index.module.scss';
import MobileDeviceToolbar from '../MobileDeviceToolbar';

const REFRESH_TIMEOUT = 200;

function Previewer({ useMobileDevice }, ref) {
  const { url } = useContext(Context);
  const frameRef = useRef(null);
  const loadingPercentRef = useRef(null);
  const [iframeWidth, setIframeWidth] = useState('100%');
  const [iframeHeight, setIframeHeight] = useState('100%');

  const startLoading = async () => {
    if (url !== BLANK_URL) {
      loadingPercentRef.current.start();
    }
  };

  useEffect(() => {
    startLoading();
    frameRef.current.addEventListener('load', (e) => {
      if (e.target.src !== BLANK_URL) {
        loadingPercentRef.current.end();
      }
    });
  }, []);

  useEffect(() => {
    async function switchDebugModel() {
      if (!useMobileDevice) {
        setIframeHeight('100%');
        setIframeWidth('100%');
      } else {
        const { defaultResponsiveHeight, defaultResponsiveWidth } = await callService('debug', 'getDeviceConfig');
        setIframeWidth(`${defaultResponsiveWidth}px`);
        setIframeHeight(`${defaultResponsiveHeight}px`);
      }
    }
    switchDebugModel();
  }, [useMobileDevice]);

  useImperativeHandle(ref, () => ({
    getFrameRef: () => {
      return frameRef;
    },
    refresh: () => {
      startLoading();
      // https://stackoverflow.com/questions/86428/what-s-the-best-way-to-reload-refresh-an-iframe
      frameRef.current.src = BLANK_URL;
      setTimeout(() => {
        frameRef.current.src = url;
      }, REFRESH_TIMEOUT);
    },
  }));

  useEffect(() => {
    startLoading();
  }, [url]);

  return (
    <div className={styles.container}>
      <LoadingPercent ref={loadingPercentRef} />
      <MobileDeviceToolbar
        deviceHeight={iframeHeight}
        deviceWidth={iframeWidth}
        setDeviceHeight={setIframeHeight}
        setDeviceWidth={setIframeWidth}
        useMobileDevice={useMobileDevice}
      />
      <div className={styles.frameContainer}>
        <iframe
          className={styles.frame}
          style={{ height: iframeHeight, width: iframeWidth, margin: 'auto' }}
          ref={frameRef}
          src={url}
        />
      </div>
    </div>
  );
}

export default forwardRef(Previewer);
