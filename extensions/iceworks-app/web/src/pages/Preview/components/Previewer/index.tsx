import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import LoadingPercent from '../LoadingPercent';
import { Context } from '../../context';
import { BLANK_URL } from '../../config';
import styles from './index.module.scss';
import MobileDeviceToolbar from './components/MobileDeviceToolbar';
import { RESPONSIVE_DEVICE, FULL_SCREEN, DEVICE_PREVIEW_MARGIN } from '../../../../constants';
import { convertNumToPixel, convertPixelToNum, throttle } from '../../utils';

const REFRESH_TIMEOUT = 50;
const RESIZE_DELAY = 100;

function Previewer(props, ref) {
  const { url, useMobileDevice, deviceData } = useContext(Context);
  const frameRef = useRef(null);
  const loadingPercentRef = useRef(null);
  // 用于计算缩放
  const containerBaseWidth = useRef(100);
  const containerBaseHeight = useRef(100);
  const [deviceWidth, setDeviceWidth] = useState(FULL_SCREEN);
  const [deviceHeight, setDeviceHeight] = useState(FULL_SCREEN);
  const [scalingRatio, setScalingRatio] = useState(1);
  const [device, setDevice] = useState(RESPONSIVE_DEVICE);

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
   * 此外，最大支持100000px的输入
   * @param newWidth Number iframe 宽度
   * @param newHeight Number iframe 高度
   */
  const autoSetDeviceConfig = (newWidth, newHeight, currentDevice?) => {
    if (newWidth === FULL_SCREEN && newHeight === FULL_SCREEN) {
      setDeviceWidth(FULL_SCREEN);
      setDeviceHeight(FULL_SCREEN);
    } else {
      const currentResizable = (currentDevice || device) === RESPONSIVE_DEVICE;
      const scalable = !currentResizable;
      let width = newWidth !== undefined ? newWidth : convertPixelToNum(deviceWidth);
      let height = newHeight !== undefined ? newHeight : convertPixelToNum(deviceHeight);
      width = Math.min(width, 100000);
      height = Math.min(height, 100000);
      const currentScalingRatio = scalable ?
        Math.min(
          window.innerWidth / (width * (1 + DEVICE_PREVIEW_MARGIN * 2)),
          (window.innerHeight - 40) / (height * (1 + DEVICE_PREVIEW_MARGIN * 2)),
          1,
        ) : 1;
      setDeviceWidth(convertNumToPixel(width * currentScalingRatio));
      setDeviceHeight(convertNumToPixel(height * currentScalingRatio));
      setScalingRatio(currentScalingRatio);
    }
  };

  const handleRndResizeStart = () => {
    containerBaseWidth.current = convertPixelToNum(deviceWidth, false);
    containerBaseHeight.current = convertPixelToNum(deviceHeight, false);
  };

  const handleRndResize = (...args) => {
    const delta = args[3];
    const { width, height } = delta;
    autoSetDeviceConfig(
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
    if (deviceWidth === FULL_SCREEN && deviceHeight === FULL_SCREEN) {
      return '';
    } else {
      const offsetRatio = -(1 - scalingRatio) / 2 / scalingRatio * 100;
      return `scale(${scalingRatio}) translateX(${offsetRatio}%) translateY(${offsetRatio}%)`;
    }
  };

  const getIframePixelFromContainer = (containerPixel) => {
    return containerPixel === FULL_SCREEN ?
      FULL_SCREEN :
      convertNumToPixel(convertPixelToNum(containerPixel) / scalingRatio);
  };

  const getDeviceContainerHeight = () => {
    return `calc(100vh - ${useMobileDevice ? '70px' : '30px'})`;
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
    <Context.Provider value={{ ...useContext(Context), deviceData, autoSetDeviceConfig, device, setDevice }}>
      <div className={styles.container}>
        <LoadingPercent ref={loadingPercentRef} />
        <MobileDeviceToolbar
          deviceHeight={convertPixelToNum(deviceHeight)}
          deviceWidth={convertPixelToNum(deviceWidth)}
          useMobileDevice={useMobileDevice}
          scrollingRatio={scalingRatio}
        />
        <div className={styles.frameContainer} style={{ height: getDeviceContainerHeight() }}>
          <Rnd
            size={{ width: deviceWidth, height: deviceHeight }}
            disableDragging
            style={{ position: 'relative', margin: 'auto' }}
            enableResizing={useMobileDevice && (device === RESPONSIVE_DEVICE) && {
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
            onResize={throttle(handleRndResize, RESIZE_DELAY)}
          >
            <iframe
              className={styles.frame}
              ref={frameRef}
              src={url}
              style={{
                width: getIframePixelFromContainer(deviceWidth),
                height: getIframePixelFromContainer(deviceHeight),
                transform: getIframeTranslateCSS() }}
            />
          </Rnd>
        </div>
      </div>
    </Context.Provider>
  );
}

export default forwardRef(Previewer);
