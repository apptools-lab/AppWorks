import React, { useEffect } from 'react';
import { Box, Icon, Typography } from '@alifd/next';
import styles from './index.module.scss';
import callService from '@/service';

const InitProjectSuccess = ({ projectDir }) => {
  useEffect(() => {
    callService('openProjectFolder', projectDir);
  }, []);
  return (
    <Box align="center">
      <Icon type="success-filling" size={72} className={styles.succesIcon} />
      <Typography.H1>项目创建完成</Typography.H1>
      <Typography.H5>即将自动跳转至项目...</Typography.H5>
    </Box>
  );
};

export default InitProjectSuccess;