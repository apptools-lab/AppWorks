import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import LoadingPercent from '../LoadingPercent';
import styles from './index.module.scss';

interface IProps {
  url: string
}

const REFRESH_HOLDER = 'about:blank';
const REFRESH_TIMEOUT = 200;

function Previewer(props: IProps, ref) {
  const { url } = props;

  const frameRef = useRef(null);
  const loadingPercentRef = useRef(null);

  const startLoading = () => {
    if (url !== REFRESH_HOLDER) {
      loadingPercentRef.current.start();
    }
  };

  useEffect(() => {
    startLoading();
    frameRef.current.addEventListener('load', (e) => {
      if (e.target.src !== REFRESH_HOLDER) {
        loadingPercentRef.current.end();
      }
    });
  }, []);

  useImperativeHandle(ref, () => ({
    getFrameRef: () => {
      return frameRef;
    },
    refresh: () => {
      startLoading();
      // https://stackoverflow.com/questions/86428/what-s-the-best-way-to-reload-refresh-an-iframe
      frameRef.current.src = REFRESH_HOLDER;
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
      <iframe className={styles.frame} ref={frameRef} src={url} />
    </div>
  );
}

export default forwardRef(Previewer);
