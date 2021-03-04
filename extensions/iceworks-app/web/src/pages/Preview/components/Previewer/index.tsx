import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import LoadingPercent from '../LoadingPercent';
import { Context } from '../../context';
import { BLANK_URL } from '../../config';
import styles from './index.module.scss';
import MobileDeviceToolbar, { convertNumToPixel, convertPixelToNum } from '../MobileDeviceToolbar';

const REFRESH_TIMEOUT = 50;
const RESIZE_DELAY = 100;
const FULL_SCREEN = '100%';

const throttle = (fn, delay = RESIZE_DELAY) => {
  let timer;

  return function () {
    if (timer) {
      return;
    }
    const args = arguments;
    timer = setTimeout(function () {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
};

function Previewer({ useMobileDevice }, ref) {
  const { url } = useContext(Context);
  const frameRef = useRef(null);
  const containerBaseWidth = useRef(100);
  const containerBaseHeight = useRef(100);
  const loadingPercentRef = useRef(null);
  const [iframeWidth, setIframeWidth] = useState(FULL_SCREEN);
  const [iframeHeight, setIframeHeight] = useState(FULL_SCREEN);
  const [iframeContainerWidth, setIframeContainerWidth] = useState(FULL_SCREEN);
  const [iframeContainerHeight, setIframeContainerHeight] = useState(FULL_SCREEN);
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
   * 对于设备，响应式布局可伸缩不可缩放，其余设备不可伸缩，
   * 因此在移动端设备中，伸缩和缩放属性是互斥的
   * @param newWidth Number iframe 宽度
   * @param newHeight Number iframe 高度
   */
  const setIframe = (newWidth, newHeight, currentResizable = true) => {
    const scalable = !currentResizable;
    setResizable(currentResizable);
    const width = newWidth !== undefined ? newWidth : convertPixelToNum(iframeContainerWidth);
    const height = newHeight !== undefined ? newHeight : convertPixelToNum(iframeContainerWidth);
    const currentScalingRatio = scalable ?
      Math.min(
        window.innerWidth / (width * 1.2),
        (window.innerHeight - 50) / (height * 1.2),
        1,
      ) : 1;
    setIframeContainerWidth(convertNumToPixel(width * currentScalingRatio));
    setIframeContainerHeight(convertNumToPixel(height * currentScalingRatio));
    setScalingRatio(currentScalingRatio);
  };

  const handleRndResizeStart = () => {
    containerBaseWidth.current = convertPixelToNum(iframeContainerWidth, false);
    containerBaseHeight.current = convertPixelToNum(iframeContainerHeight,
      false);
  };

  const handleRndResize = (...args) => {
    const delta = args[3];
    const { width, height } = delta;
    setIframe(
      (containerBaseWidth.current + (width * 2)) / scalingRatio,
      (containerBaseHeight.current + (height * 2)) / scalingRatio,
    );
  };

  /**
   * 例如：在 100*100 容器中，放置了一个 125*125 的iframe
   * 那么首先需要将其缩放 80%
   * 由于 125*125 的中心为 72.5，72.5 我们需要将其缩放到 50，50 上， 因此需要向左上角移动 22.5
   * 这个偏移量的偏移系数计算公式为：（(1 - 缩放量) / 2 ）/ 缩放量
   */
  const getIframeTranslateCSS = () => {
    const offsetRatio = -(1 - scalingRatio) / 2 / scalingRatio * 100;
    return `scale(${scalingRatio}) translateX(${offsetRatio}%) translateY(${offsetRatio}%)`;
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
    startLoading();
  }, [url]);

  useEffect(() => {
    async function switchDebugModel() {
      if (!useMobileDevice) {
        setIframeContainerHeight(FULL_SCREEN);
        setIframeContainerWidth(FULL_SCREEN);
        setIframeWidth(FULL_SCREEN);
        setIframeHeight(FULL_SCREEN);
      } else if (iframeContainerWidth !== FULL_SCREEN && iframeContainerHeight !== FULL_SCREEN) {
        setIframeWidth(
          convertNumToPixel(convertPixelToNum(iframeContainerWidth) / scalingRatio),
        );
        setIframeHeight(
          convertNumToPixel(convertPixelToNum(iframeContainerHeight) / scalingRatio),
        );
      }
    }
    switchDebugModel();
  }, [useMobileDevice, iframeContainerWidth, iframeContainerHeight]);

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

  return (
    <div className={styles.container}>
      <LoadingPercent ref={loadingPercentRef} />
      <MobileDeviceToolbar
        deviceHeight={convertPixelToNum(iframeContainerHeight)}
        deviceWidth={convertPixelToNum(iframeContainerWidth)}
        setDeviceConfig={setIframe}
        useMobileDevice={useMobileDevice}
        scrollingRatio={scalingRatio}
      />
      <div className={styles.frameContainer}>
        <Rnd
          size={{ width: iframeContainerWidth, height: iframeContainerHeight }}
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
            style={{
              width: iframeWidth,
              height: iframeHeight,
              transform: getIframeTranslateCSS() }}
          />
        </Rnd>
      </div>
    </div>
  );
}

export default forwardRef(Previewer);
