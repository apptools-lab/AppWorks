import { Input, Select, Drawer } from '@alifd/next';
import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import callService from '../../../../callService';
import MobileDeviceManager from '../MobileDeviceManager';

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

const defaultDeviceData = [
  {
    label: 'iphone X',
    value: '375*812',
    customizeDevice: false,
  },
  {
    label: 'Galaxy S5',
    value: '360*640',
    customizeDevice: false,
  },
];

const NUMBERS_OF_DEFAULT_DEVICES = defaultDeviceData.length;

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
  const [inputDeviceWidth, setInputDeviceWidth] = useState(RESPONSIVE_DEFAULT_WIDTH);
  const [inputDeviceHeight, setInputDeviceHeight] = useState(RESPONSIVE_DEFAULT_HEIGHT);
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
    width = isNaN(width) || width === undefined ? RESPONSIVE_DEFAULT_WIDTH : width;
    height = isNaN(width) || height === undefined ? RESPONSIVE_DEFAULT_HEIGHT : height;

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

  function setFullDeviceData(devices) {
    setDeviceData([responsiveItem, ...defaultDeviceData, ...devices, editItem]);
    callService('debug', 'setUserDevices', { devices });
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
    if (useMobileDevice) {
      setDeviceConfig(inputDeviceWidth, inputDeviceHeight, resizable.current);
    }
  }, [useMobileDevice]);

  useEffect(() => {
    async function loadMobileToolBar() {
      const { userDevices } = await callService('debug', 'getUserDevices');
      setDevice(RESPONSIVE);
      setInputDeviceWidth(RESPONSIVE_DEFAULT_WIDTH);
      setInputDeviceHeight(RESPONSIVE_DEFAULT_HEIGHT);
      setDeviceConfig(
        RESPONSIVE_DEFAULT_WIDTH,
        RESPONSIVE_DEFAULT_HEIGHT,
        resizable.current,
      );
      setFullDeviceData(userDevices);
      setLoading(false);
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
                className={styles.scroll}
              />
            </div>

            <div className={styles.iconReverseContainer}>
              <i className={styles.iconReverse} onClick={handleReverseIconClick} />
            </div>

            <Drawer
              visible={showDeviceDrawer}
              placement={'right'}
              onClose={() => { setShowDeviceDrawer(false); }}
            >
              <MobileDeviceManager
                deviceData={deviceData.slice(1, -1)}
                setDeviceData={setFullDeviceData}
                numberOfDefaultDevices={NUMBERS_OF_DEFAULT_DEVICES}
              />
            </Drawer>
          </div>
        </div> : <></>
      }
    </>
  );
}

