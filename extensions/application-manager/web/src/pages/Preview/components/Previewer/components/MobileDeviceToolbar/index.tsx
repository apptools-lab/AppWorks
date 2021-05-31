import React, { useState, useEffect, useContext } from 'react';
import { Select, Drawer } from '@alifd/next';
import DeviceManager from '../DevicesManager';
import { Context } from '../../../../context';
import InputController from '../InputController';
import { editItem, EDIT_DEVICE, FULL_SCREEN, responsiveItem, RESPONSIVE_DEFAULT_HEIGHT, RESPONSIVE_DEFAULT_WIDTH, RESPONSIVE_DEVICE } from '../../../../../../constants';
import styles from './index.module.scss';

export default function MobileDeviceToolbar({ deviceWidth, deviceHeight, useMobileDevice, scrollingRatio }) {
  const { setDevice, device, autoSetDeviceConfig, deviceData } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [inputWidth, setInputWidth] = useState(RESPONSIVE_DEFAULT_WIDTH);
  const [inputHeight, setInputHeight] = useState(RESPONSIVE_DEFAULT_HEIGHT);
  const [showDeviceDrawer, setShowDeviceDrawer] = useState(false);

  const scrollingRatioItem = {
    // @ts-ignore
    label: `fit: ${parseInt(scrollingRatio * 100)}%`,
  };

  const selectDeviceItems = [responsiveItem, ...deviceData, editItem];

  async function handleDeviceChange(value, type, currentDeviceData) {
    const currentDevice = currentDeviceData.label;
    let [width, height] = value.split('*');
    width = isNaN(width) || width === undefined ? RESPONSIVE_DEFAULT_WIDTH : width;
    height = isNaN(width) || height === undefined ? RESPONSIVE_DEFAULT_HEIGHT : height;

    if (value === EDIT_DEVICE) {
      setShowDeviceDrawer(true);
    } else {
      setDevice(currentDevice);
      setInputWidth(width);
      setInputHeight(height);
      autoSetDeviceConfig(width, height, currentDevice);
    }
  }

  function handleReverseIconClick() {
    autoSetDeviceConfig(deviceHeight, deviceWidth);
    setInputWidth(inputHeight);
    setInputHeight(inputWidth);
  }

  useEffect(() => {
    if (useMobileDevice) {
      autoSetDeviceConfig(inputWidth, inputHeight);
    } else {
      autoSetDeviceConfig(FULL_SCREEN, FULL_SCREEN);
    }
  }, [useMobileDevice]);

  useEffect(() => {
    async function loadMobileToolBar() {
      setDevice(RESPONSIVE_DEVICE);
      setInputWidth(RESPONSIVE_DEFAULT_WIDTH);
      setInputHeight(RESPONSIVE_DEFAULT_HEIGHT);
      setLoading(false);
    }
    loadMobileToolBar();
  }, []);

  useEffect(() => {
    window.onresize = function () {
      if (useMobileDevice) {
        autoSetDeviceConfig(inputWidth, inputHeight);
      }
    };
  }, [inputWidth, inputHeight]);

  return (
    <Context.Provider value={{ ...useContext(Context), deviceWidth, deviceHeight }}>
      {useMobileDevice && !loading ?
        <div className={styles.container}>
          <div className={styles.delimiter} />
          <div className={styles.toolbar}>
            <div className={styles.miniToolBar}>
              <Select
                value={device}
                className={styles.selector}
                dataSource={selectDeviceItems}
                onChange={handleDeviceChange}
              />
              <InputController
                inputWidth={inputWidth}
                inputHeight={inputHeight}
                setInputWidth={setInputWidth}
                setInputHeight={setInputHeight}
              />
            </div>
            <Select
              value={scrollingRatioItem.label}
              dataSource={[scrollingRatioItem]}
              className={styles.scroll}
            />
            <div className={styles.iconReverseContainer}>
              <i className={styles.iconReverse} onClick={handleReverseIconClick} />
            </div>
          </div>

          <Drawer
            visible={showDeviceDrawer}
            placement="right"
            onClose={() => { setShowDeviceDrawer(false); }}
          >
            <DeviceManager />
          </Drawer>
        </div> : <></>
        }
    </Context.Provider>
  );
}

