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
  }, [projectDir]);
  return (
    <Box align="center">
      <Icon type="success-filling" size={72} className={styles.succesIcon} />
      <Typography.H1>Project has been created.</Typography.H1>
      <Typography.H5>About to automatically jump to the project...</Typography.H5>
    </Box>
  );
};

export default InitProjectSuccess;