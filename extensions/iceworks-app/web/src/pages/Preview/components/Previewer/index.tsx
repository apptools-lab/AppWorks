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
  const [device, setDevice] = useState('Responsive');
  const [deviceWidth, setDeviceWidth] = useState('100%');
  const [deviceHeight, setDeviceHeight] = useState('100%');
  const [loadingDevice, setLoadingDevice] = useState(true);
  const [deviceData, setDeviceData] = useState([]);

  const startLoading = async () => {
    if (url !== BLANK_URL) {
      loadingPercentRef.current.start();
      if (useMobileDevice) {
        const { defaultDevice, defaultDeviceHeight, defaultDeviceWidth, defaultDeviceData }
          = await callService('debug', 'getDeviceConfig');
        setDeviceWidth(defaultDevice);
        setDeviceHeight(defaultDeviceHeight);
        setDevice(defaultDeviceWidth);
        setDeviceData(defaultDeviceData);
        setLoadingDevice(false);
      }
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
    if (!useMobileDevice) {
      setDeviceHeight('100%');
      setDeviceWidth('100%');
    }
  }, [useMobileDevice]);

  useEffect(() => {

  }, [deviceData]);

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
      { !loadingDevice && useMobileDevice ?
        <MobileDeviceToolbar
          defaultDevice={device}
          deviceHeight={deviceHeight}
          deviceWidth={deviceWidth}
          setDeviceHeight={setDeviceHeight}
          setDeviceWidth={setDeviceWidth}
          deviceData={deviceData}
        />
        : null}
      <div style={{ height: deviceHeight, width: deviceWidth, margin: 'auto' }}>
        <iframe className={styles.frame} ref={frameRef} src={url} />
      </div>
    </div>
  );
}

export default forwardRef(Previewer);
