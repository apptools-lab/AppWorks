import { Input, Select, Drawer } from '@alifd/next';
import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import callService from '../../../../callService';

const TEMP_WIDTH = 'tempWidth';
const TEMP_HEIGHT = 'tempHeight';
const DEVICE_WIDHT = 'deviceWidth';
const DEVICE_HEIGHT = 'deviceHeight';
const RESPONSIVE = 'Responsive';

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
  const resizable = useRef(false);
  const [tempDeviceWidth, setTempDeviceWidth] = useState(deviceWidth);
  const [tempDeviceHeight, setTempDeviceHeight] = useState(deviceHeight);
  const [isDeviceSelected, setIsDeviceSelected] = useState(false);
  const [device, setDevice] = useState(RESPONSIVE);
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeviceDrawer, setShowDeviceDrawer] = useState(false);

  const scrollingRatioItem = {
    label: `fit: ${parseInt(scrollingRatio * 100)}%`,
  };

  function handlePixelChange(type, value?) {
    console.log(type, value);
    if (/d*/.test(value)) {
      switch (type) {
        case TEMP_WIDTH: setTempDeviceWidth(value); return;
        case TEMP_HEIGHT: setTempDeviceHeight(value); return;
        case DEVICE_WIDHT: setDeviceConfig(tempDeviceWidth, undefined, resizable.current); return;
        case DEVICE_HEIGHT: setDeviceConfig(undefined, tempDeviceHeight, resizable.current);
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
        const DeviceConfig = await callService('debug', 'getDeviceConfig');
        width = DeviceConfig.defaultResponsiveWidth;
        height = DeviceConfig.defaultResponsiveHeight;
        setIsDeviceSelected(false);
      } else {
        setIsDeviceSelected(true);
      }
      setDevice(currentDevice);
      setTempDeviceWidth(width);
      setTempDeviceHeight(height);
      resizable.current = currentDevice === RESPONSIVE;
      setDeviceConfig(width, height, resizable.current);
      console.log('switching Deivce ===> ', currentDevice);
    }
  }

  function handleReverseIconClick() {
    setDeviceConfig(deviceHeight / scrollingRatio, deviceWidth / scrollingRatio, resizable.current, resizable.current);
    setTempDeviceWidth(tempDeviceHeight / scrollingRatio);
    setTempDeviceHeight(tempDeviceWidth / scrollingRatio);
  }

  useEffect(() => {
    if (useMobileDevice && device === RESPONSIVE) {
      console.log('Width & Height ===>', deviceHeight, deviceWidth, scrollingRatio);
      setTempDeviceWidth(deviceWidth / scrollingRatio);
      setTempDeviceHeight(deviceHeight / scrollingRatio);
    }
  }, [scrollingRatio, deviceWidth, deviceHeight]);

  useEffect(() => {
    async function loadMobileToolBar() {
      if (useMobileDevice) {
        const { defaultDevice, defaultResponsiveHeight, defaultResponsiveWidth, defaultDeviceData }
        = await callService('debug', 'getDeviceConfig');
        setDevice(defaultDevice);
        setTempDeviceHeight(defaultResponsiveWidth);
        setTempDeviceWidth(defaultResponsiveHeight);
        setDeviceConfig(
          defaultResponsiveWidth,
          defaultResponsiveHeight,
          resizable.current,
        );
        setDeviceData([responsiveItem, ...defaultDeviceData, editItem]);
        setLoading(false);
      }
    }
    loadMobileToolBar();
  }, []);

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
                value={tempDeviceWidth}
                disabled={isDeviceSelected}
                onChange={pixel => handlePixelChange(TEMP_WIDTH, pixel)}
                onPressEnter={() => handlePixelChange(DEVICE_WIDHT)}
              />
              x
              <Input
                className={styles.pixelsInput}
                value={tempDeviceHeight}
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

