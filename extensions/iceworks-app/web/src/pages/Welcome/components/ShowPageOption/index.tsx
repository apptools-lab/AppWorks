import React, { useState, useEffect } from 'react';
import { Checkbox } from '@alifd/next';
import callService from '../../../../callService';
import styles from './index.module.scss';

export default () => {
  const [showWelcomePage, setShowWelcomePage] = useState<boolean>(true);

  const onChange = async (checked: boolean) => {
    await callService('common', 'saveDataToSettingJson', 'showWelcomePage', checked);
    setShowWelcomePage(checked);
  };

  useEffect(() => {
    async function getShowWelcomePage() {
      const value = await callService('common', 'getDataFromSettingJson', 'showWelcomePage', true);
      setShowWelcomePage(value);
    }
    getShowWelcomePage();
  }, []);
  return (
    <div className={styles.showPageOption}>
      <Checkbox onChange={onChange} checked={showWelcomePage}>显示欢迎页</Checkbox>
    </div>
  );
};
