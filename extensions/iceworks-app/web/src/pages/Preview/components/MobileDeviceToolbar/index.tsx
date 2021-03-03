import { Input, Select, Icon } from '@alifd/next';
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

function convertNumToPixel(num) {
  return `${num}px`;
}

function convertPixelToNum(pixel) {
  try {
    return parseInt(pixel.slice(0, -2));
  } catch (e) {
    console.log(`convert ${pixel} Failed`);
    return 100;
  }
}

export default function MobileDeviceToolbar({ deviceWidth, deviceHeight, setDeviceHeight, setDeviceWidth, useMobileDevice }) {
  const isResponsiveDataSaved = useRef(false);
  const [tempDeviceWidth, setTempDeviceWidth] = useState(convertPixelToNum(deviceWidth));
  const [tempDeviceHeight, setTempDeviceHeight] = useState(convertPixelToNum(deviceHeight));
  const [isDeviceSelected, setIsDeviceSelected] = useState(false);
  const [device, setDevice] = useState(RESPONSIVE);
  const [deviceData, setDeviceData] = useState([]);
  const [loading, setLoading] = useState(true);

  function handlePixelChange(type, value?) {
    console.log(type, value);
    if (/d*/.test(value)) {
      switch (type) {
        case TEMP_WIDTH: setTempDeviceWidth(value); return;
        case TEMP_HEIGHT: setTempDeviceHeight(value); return;
        case DEVICE_WIDHT: setDeviceWidth(convertNumToPixel(tempDeviceWidth)); return;
        case DEVICE_HEIGHT: setDeviceHeight(convertNumToPixel(tempDeviceHeight));
      }
    }
  }

  async function handleDeviceChange(value, type, currentDeviceData) {
    const currentDevice = currentDeviceData.label;
    let [width, height] = value.split('*');
    if (value === 'Edit') {
      // add or delete device
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
      setDeviceWidth(convertNumToPixel(width));
      setDeviceHeight(convertNumToPixel(height));
    }
  }

  function handleReverseIconClick() {
    setDeviceHeight(deviceWidth);
    setDeviceWidth(deviceHeight);
    setTempDeviceWidth(tempDeviceHeight);
    setTempDeviceHeight(tempDeviceWidth);
  }

  useEffect(() => {
    async function loadMobileToolBar() {
      if (useMobileDevice) {
        const { defaultDevice, defaultResponsiveHeight, defaultResponsiveWidth, defaultDeviceData }
        = await callService('debug', 'getDeviceConfig');
        setDevice(defaultDevice);
        setTempDeviceHeight(defaultResponsiveWidth);
        setTempDeviceWidth(defaultResponsiveHeight);
        setDeviceWidth(convertNumToPixel(defaultResponsiveWidth));
        setDeviceHeight(convertNumToPixel(defaultResponsiveHeight));
        setDeviceData([responsiveItem, ...defaultDeviceData, editItem]);
        setLoading(false);
      }
    }
    loadMobileToolBar();
  }, []);

  useEffect(() => {
    console.log('device ==>', device);
    if (!useMobileDevice) {
      callService('debug', 'setDevice', { device });
      console.log('save Device...');
    }
    if (useMobileDevice && device === RESPONSIVE) {
      isResponsiveDataSaved.current = false;
    } else if ((!useMobileDevice && device === RESPONSIVE) || (!isResponsiveDataSaved.current && device !== RESPONSIVE)) {
      callService('debug', 'setResponsiveData', { deviceWidth, deviceHeight });
      isResponsiveDataSaved.current = true;
      console.log('save Responsive Info...');
    }
  }, [device, useMobileDevice]);

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
            </div>
            <Icon type="loading" onClick={handleReverseIconClick} className={styles.icon} />
          </div>
        </div> : <></>
      }
    </>

  );
}

