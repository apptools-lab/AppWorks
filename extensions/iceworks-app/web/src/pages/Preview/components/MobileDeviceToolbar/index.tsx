import { Input, Select, Icon } from '@alifd/next';
import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';

const TEMP_WIDTH = 'tempWidth';
const TEMP_HEIGHT = 'tempHeight';
const DEVICE_WIDHT = 'deviceWidth';
const DEVICE_HEIGHT = 'deviceHeight';

function convertNumToPixel(num) {
  return `${num}px`;
}

function convertPixelToNum(pixel) {
  try {
    console.log(`convert from ${pixel} to ${pixel.slice(0, -2)}`);
    return parseInt(pixel.slice(0, -2));
  } catch (e) {
    console.log(`convert ${pixel} Failed`);
    return 100;
  }
}

export default function PixelController({ deviceWidth, deviceHeight, setDeviceHeight, setDeviceWidth, device, setDevice, deviceData }) {
  const [tempDeviceWidth, setTempDeviceWidth] = useState(convertPixelToNum(deviceWidth));
  const [tempDeviceHeight, setTempDeviceHeight] = useState(convertPixelToNum(deviceHeight));
  const [isDeviceSelected, setIsDeviceSelected] = useState(false);

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

  useEffect(() => {
    if (device !== 'Responsive') {
      setIsDeviceSelected(true);
      const [width, height] = deviceData[device].split('*');
      setTempDeviceWidth(width);
      setTempDeviceHeight(height);
      setDeviceWidth(convertNumToPixel(width));
      setDeviceHeight(convertNumToPixel(height));
    } else {
      setIsDeviceSelected(false);
    }
  }, [device]);
  function handleDeviceChange(value) {
    if (value === 'Edit') {
      // add or delete device
    } else {
      setDevice(value);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.delimiter} />
      <div className={styles.toolbar}>
        <Select
          value={device}
          className={styles.selector}
          dataSource={deviceData}
          onChange={value => handleDeviceChange(value)}
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
        <Icon type="loading" className={styles.icon} />
      </div>
    </div>
  );
}

