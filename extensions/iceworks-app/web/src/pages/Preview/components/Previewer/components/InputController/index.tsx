import React, { useRef, useContext, useEffect } from 'react';
import { Input } from '@alifd/next';
import { Context } from '../../../../context';
import { RESPONSIVE_DEFAULT_HEIGHT, RESPONSIVE_DEFAULT_WIDTH, INPUT_HEIGHT, INPUT_WIDTH, DEVICE_WIDTH, DEVICE_HEIGHT, RESPONSIVE_DEVICE } from '../../../../../../constants';
import classNames from 'classnames';
import styles from './index.module.scss';

export default function InputController({ setInputWidth, setInputHeight, inputWidth, inputHeight }) {
  const saveCache = useRef(true);
  const { device, autoSetDeviceConfig, deviceWidth, deviceHeight } = useContext(Context);
  const responsiveWidthCache = useRef(RESPONSIVE_DEFAULT_WIDTH);
  const responsiveHeightCache = useRef(RESPONSIVE_DEFAULT_HEIGHT);

  function handlePixelChange(type, value?) {
    if (/d*/.test(value)) {
      switch (type) {
        case INPUT_WIDTH: setInputWidth(value); return;
        case INPUT_HEIGHT: setInputHeight(value); return;
        case DEVICE_WIDTH: autoSetDeviceConfig(inputWidth, undefined); return;
        case DEVICE_HEIGHT: autoSetDeviceConfig(undefined, inputHeight);
      }
    }
  }

  useEffect(() => {
    if (device === RESPONSIVE_DEVICE) {
      if (!saveCache.current) {
        setInputWidth(responsiveWidthCache.current);
        setInputHeight(responsiveHeightCache.current);
        autoSetDeviceConfig(responsiveWidthCache.current, responsiveHeightCache.current);
      }
      setInputWidth(deviceWidth);
      setInputHeight(deviceHeight);
      responsiveWidthCache.current = deviceWidth;
      responsiveHeightCache.current = deviceHeight;
      saveCache.current = true;
    } else {
      saveCache.current = false;
    }
  }, [device, deviceWidth, deviceHeight]);

  return (
    <div className={styles.inputController}>
      <Input
        className={classNames(styles.pixelsInput, styles.pixelsInputLeft)}
        value={inputWidth}
        disabled={device !== RESPONSIVE_DEVICE}
        onChange={pixel => handlePixelChange(INPUT_WIDTH, pixel)}
        onBlur={() => handlePixelChange(DEVICE_WIDTH)}
        onPressEnter={() => handlePixelChange(DEVICE_WIDTH)}
      />
      <span className={styles.iconTimesContainer}>
        <i className={styles.iconTimes} />
      </span>
      <Input
        className={classNames(styles.pixelsInput, styles.pixelsInputRight)}
        value={inputHeight}
        disabled={device !== RESPONSIVE_DEVICE}
        onChange={pixel => handlePixelChange(INPUT_HEIGHT, pixel)}
        onBlur={() => handlePixelChange(DEVICE_HEIGHT)}
        onPressEnter={() => handlePixelChange(DEVICE_HEIGHT)}
      />
    </div>
  );
}
