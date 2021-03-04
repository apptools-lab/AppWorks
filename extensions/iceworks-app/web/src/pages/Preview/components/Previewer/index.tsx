import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import LoadingPercent from '../LoadingPercent';
import { Context } from '../../context';
import { BLANK_URL } from '../../config';
import callService from '../../../../callService';
import styles from './index.module.scss';
import MobileDeviceToolbar, { convertNumToPixel, convertPixelToNum } from '../MobileDeviceToolbar';

const REFRESH_TIMEOUT = 50;
const RESIZE_DELAY = 100;

const throttle = (fn, delay = RESIZE_DELAY) => {
  let timer;

  return function () {
    if (timer) {
      return;
    }
    const args = arguments;
    console.log('throttle arguments', arguments);
    timer = setTimeout(function () {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
};

function Previewer({ useMobileDevice }, ref) {
  const { url } = useContext(Context);
  const frameRef = useRef(null);
  const iframeBaseWidth = useRef(100);
  const iframeBaseHeight = useRef(100);
  const loadingPercentRef = useRef(null);
  const [iframeWidth, setIframeWidth] = useState('100%');
  const [iframeHeight, setIframeHeight] = useState('100%');
  const [scalingRatio, setScalingRatio] = useState(1);
  const [resizable, setResizable] = useState(true);

  const startLoading = async () => {
    if (url !== BLANK_URL) {
      loadingPercentRef.current.start();
    }
  };

  /**
   * 对 iframe 进行赋值时，为了保证显示效果
   * 应当使其长度不超过展示页面最大长度的83.33%、
   * 宽度不超过83.33%，
   * 对于设备，响应式布局可伸缩不可缩放，其余设备可不可伸缩
   * @param newWidth Number iframe 宽度
   * @param newHeight Number iframe 高度
   */
  const setIframe = (newWidth, newHeight, currentResizable = true) => {
    const scalable = !currentResizable;
    setResizable(currentResizable);
    console.log('set Resizable && scalable ===> ', currentResizable, scalable);
    const width = newWidth !== undefined ? newWidth : convertPixelToNum(iframeWidth);
    const height = newHeight !== undefined ? newHeight : convertPixelToNum(iframeWidth);
    const currentScalingRatio = scalable ?
      Math.min(
        window.innerWidth / (width * 1.2),
        (window.innerHeight - 50) / (height * 1.2),
        1,
      ) : 1;
    setIframeWidth(convertNumToPixel(width * currentScalingRatio));
    setIframeHeight(convertNumToPixel(height * currentScalingRatio));
    setScalingRatio(currentScalingRatio);
    console.log('ScalingRatio ===>', currentScalingRatio);
  };

  const handleRndResizeStart = () => {
    iframeBaseWidth.current = convertPixelToNum(iframeWidth, false);
    iframeBaseHeight.current = convertPixelToNum(iframeHeight,
      false);
  };

  const handleRndResize = (...args) => {
    const delta = args[3];
    console.log('resizeArguments', delta);
    const { width, height } = delta;
    setIframe(
      (iframeBaseWidth.current + (width * 2)) / scalingRatio,
      (iframeBaseHeight.current + (height * 2)) / scalingRatio,
    );
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
        setIframeWidth(convertNumToPixel(defaultResponsiveWidth));
        setIframeHeight(convertNumToPixel(defaultResponsiveHeight));
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
        deviceHeight={convertPixelToNum(iframeHeight)}
        deviceWidth={convertPixelToNum(iframeWidth)}
        setDeviceConfig={setIframe}
        useMobileDevice={useMobileDevice}
        scrollingRatio={scalingRatio}
      />
      <div className={styles.frameContainer}>
        <Rnd
          size={{ width: iframeWidth, height: iframeHeight }}
          disableDragging
          style={{ position: 'relative', margin: 'auto' }}
          enableResizing={useMobileDevice && resizable && {
            bottom: true,
            bottomLeft: false,
            bottomRight: true,
            left: false,
            right: true,
            top: false,
            topLeft: false,
            topRight: false,
          }}
          onResizeStart={handleRndResizeStart}
          onResize={throttle(handleRndResize)}
        >
          <iframe
            className={styles.frame}
            ref={frameRef}
            src={url}
            // style={{ height: iframeHeight, width: iframeWidth, margin: 'auto' }}
            // style = {{
            //   width: (useMobileDevice? convertPixelToNum(iframeWidth) / scalingRatio : '100%'),
            //   height: (use MobileDevice? convertPixelToNum(iframeHeight)/ scalingRatio : '100%'),
            //   transform: `scale(${scalingRatio})`}}
          />
        </Rnd>
      </div>
    </div>
  );
}

export default forwardRef(Previewer);
