import React from 'react';
import { Box, Button, Icon, Typography } from '@alifd/next';
import styles from './index.module.scss';

function InitProject(goInitial) {
  return (
    <Box align="center">
      <Icon type="success-filling" size={72} className={styles.succesIcon} />
      <Typography.H1>项目创建成功</Typography.H1>
      <Box margin={20} direction="row">
        <Button type="primary" style={{ marginRight: '5px' }} onClick={goInitial}>进入工作台</Button>
        <Button onClick={goInitial}>继续创建</Button>
      </Box>
    </Box>
  );
}

export default InitProject;