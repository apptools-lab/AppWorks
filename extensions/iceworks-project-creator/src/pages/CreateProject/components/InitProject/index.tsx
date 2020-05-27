import React from 'react';
import { Box, Button, Icon, Typography } from '@alifd/next';
import styles from './index.module.scss';

function InitProject(goInitial) {
  return (
    <Box align="center">
      <Icon type="success-filling" size={72} className={styles.succesIcon} />
      <Typography.H1>提交成功</Typography.H1>
      <Typography.Text>5s 后自动跳转至工单页</Typography.Text>
      <Box margin={20} direction="row">
        <Button type="primary" style={{ marginRight: '5px' }} onClick={goInitial}>返回主页</Button>
        <Button onClick={goInitial}>继续创建</Button>
      </Box>
    </Box>
  );
}

export default InitProject;