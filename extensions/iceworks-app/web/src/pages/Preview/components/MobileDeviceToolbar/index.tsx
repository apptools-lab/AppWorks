import { Input, Select, Drawer } from '@alifd/next';
import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import callService from '../../../../callService';

const TEMP_WIDTH = 'tempWidth';
const TEMP_HEIGHT = 'tempHeight';
const DEVICE_WIDHT = 'deviceWidth';
const DEVICE_HEIGHT = 'deviceHeight';
const RESPONSIVE = 'Responsive';
const RESPONSIVE_DEFAULT_WIDTH = '300';
const RESPONSIVE_DEFAULT_HEIGHT = '640';

const responsiveItem = {
  label: RESPONSIVE,
  value: RESPONSIVE,
};

const editItem = {
  label: 'Edit',
  value: 'Edit',
};

export function convertNumToPixel(num) {
  return `${num}px`;
}

export function convertPixelToNum(pixel, returnInteger = true) {
  try {
    return returnInteger ? parseInt(pixel.slice(0, -2)) : parseFloat(pixel.slice(0, -2));
  } catch (e) {
    console.log(`convert ${pixel} Failed`);
    return 100;
  }
}

export default function MobileDeviceToolbar({ deviceWidth, deviceHeight, setDeviceConfig, useMobileDevice, scrollingRatio }) {
  const resizable = useRef(true);
  const saveResponsiveData = useRef(true);
  const responsiveWidthCache = useRef(RESPONSIVE_DEFAULT_WIDTH);
  const responsiveHeightCache = useRef(RESPONSIVE_DEFAULT_HEIGHT);
  const [inputDeviceWidth, setInputDeviceWidth] = useState(deviceWidth);
  const [inputDeviceHeight, setInputDeviceHeight] = useState(deviceHeight);
  const [isDeviceSelected, setIsDeviceSelected] = useState(false);
  const [device, setDevice] = useState(RESPONSIVE);
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeviceDrawer, setShowDeviceDrawer] = useState(false);

  const scrollingRatioItem = {
    // @ts-ignore
    label: `fit: ${parseInt(scrollingRatio * 100)}%`,
  };

  function handlePixelChange(type, value?) {
    console.log(type, value);
    if (/d*/.test(value)) {
      switch (type) {
        case TEMP_WIDTH: setInputDeviceWidth(value); return;
        case TEMP_HEIGHT: setInputDeviceHeight(value); return;
        case DEVICE_WIDHT: setDeviceConfig(inputDeviceWidth, undefined, resizable.current); return;
        case DEVICE_HEIGHT: setDeviceConfig(undefined, inputDeviceHeight, resizable.current);
      }
    }
  }

  async function handleDeviceChange(value, type, currentDeviceData) {
    const currentDevice = currentDeviceData.label;
    let [width, height] = value.split('*');
    if (value === 'Edit') {
      setShowDeviceDrawer(true);
    } else {
      if (currentDevice === RESPONSIVE) {
        width = responsiveWidthCache.current;
        height = responsiveHeightCache.current;
        setIsDeviceSelected(false);
      } else {
        setIsDeviceSelected(true);
      }
      setDevice(currentDevice);
      setInputDeviceWidth(width);
      setInputDeviceHeight(height);
      resizable.current = currentDevice === RESPONSIVE;
      setDeviceConfig(width, height, resizable.current);
      console.log('switching Device ===> ', currentDevice);
    }
  }

  function handleReverseIconClick() {
    setDeviceConfig(deviceHeight, deviceWidth, resizable.current);
    setInputDeviceWidth(inputDeviceHeight);
    setInputDeviceHeight(inputDeviceWidth);
  }

  useEffect(() => {
    if ((!useMobileDevice && device === RESPONSIVE) || (useMobileDevice && device !== RESPONSIVE)) {
      saveResponsiveData.current = false;
    } else if (useMobileDevice && device === RESPONSIVE) {
      setInputDeviceWidth(deviceWidth);
      setInputDeviceHeight(deviceHeight);
      responsiveWidthCache.current = deviceWidth;
      responsiveHeightCache.current = deviceHeight;
      console.log('save Res Config ===> ', deviceWidth, deviceHeight);
      saveResponsiveData.current = true;
    }
  }, [scrollingRatio, deviceWidth, deviceHeight, useMobileDevice]);

  useEffect(() => {
    async function loadMobileToolBar() {
      if (useMobileDevice) {
        const { defaultDevice, defaultDeviceData }
        = await callService('debug', 'getDeviceConfig');
        setDevice(defaultDevice);
        setInputDeviceWidth(RESPONSIVE_DEFAULT_WIDTH);
        setInputDeviceHeight(RESPONSIVE_DEFAULT_HEIGHT);
        setDeviceConfig(
          RESPONSIVE_DEFAULT_WIDTH,
          RESPONSIVE_DEFAULT_HEIGHT,
          resizable.current,
        );
        setDeviceData([responsiveItem, ...defaultDeviceData, editItem]);
        setLoading(false);
      }
    }
    loadMobileToolBar();
  }, []);

  useEffect(() => {
    const autoAdjustDevice = !resizable.current;
    if (autoAdjustDevice) {
      window.onresize = function () {
        if (useMobileDevice) {
          console.log('Window Changed ...', inputDeviceWidth, inputDeviceHeight);
          setDeviceConfig(
            inputDeviceWidth,
            inputDeviceHeight,
            resizable.current,
          );
        }
      };
    }
  }, [inputDeviceHeight, inputDeviceWidth, resizable.current]);


  return (
    <>
      {useMobileDevice && !loading ?
        <div className={styles.container}>
          <div className={styles.delimiter} />
          <div className={styles.toolbar}>
            <Select
              value={device}
              className={styles.selector}
              dataSource={deviceData}
              onChange={handleDeviceChange}
            />
            <div className={styles.pixelsContainer}>
              <Input
                className={styles.pixelsInput}
                value={inputDeviceWidth}
                disabled={isDeviceSelected}
                onChange={pixel => handlePixelChange(TEMP_WIDTH, pixel)}
                onPressEnter={() => handlePixelChange(DEVICE_WIDHT)}
              />
              x
              <Input
                className={styles.pixelsInput}
                value={inputDeviceHeight}
                disabled={isDeviceSelected}
                onChange={pixel => handlePixelChange(TEMP_HEIGHT, pixel)}
                onPressEnter={() => handlePixelChange(DEVICE_HEIGHT)}
              />
              <Select
                value={scrollingRatioItem.label}
                dataSource={[scrollingRatioItem]}
              />
            </div>
            <div onClick={handleReverseIconClick} >
              <i className={styles.iconReverse} />
            </div>

            <Drawer
              visible={showDeviceDrawer}
              placement={'right'}
              onClose={() => { setShowDeviceDrawer(false); }}
            >
              Edit Devices Here
            </Drawer>
          </div>
        </div> : <></>
      }
    </>
  );
}

