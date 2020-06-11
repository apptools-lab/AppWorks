import React, { useEffect } from 'react';
import { Box, Icon, Typography } from '@alifd/next';
import callService from '@/callService';
import styles from './index.module.scss';

interface IInitProjectSuccessProps {
  projectDir: string;
}

const InitProjectSuccess: React.FC<IInitProjectSuccessProps> = ({ projectDir }) => {
  useEffect(() => {
    callService('project', 'openLocalProjectFolder', projectDir);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box align="center">
      <Icon type="success-filling" size={50} className={styles.succesIcon} />
      <Typography.H1>项目创建完成</Typography.H1>
      <Typography.H5>正在自动跳转至项目...</Typography.H5>
    </Box>
  );
};

export default InitProjectSuccess;