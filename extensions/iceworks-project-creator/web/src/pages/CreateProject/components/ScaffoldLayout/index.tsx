import React, { useState } from 'react';
import { Checkbox, List, Box, Button, Divider, Dialog } from '@alifd/next';
import PageGenerator from '../PageGenerator';
import HeaderTitle from '@/components/HeaderTitle';
import styles from './index.module.scss';

const ScaffoldLayout = () => {
  const [visible, setVisible] = useState(false);
  // console.log(visible);

  return (
    <div className={styles.scaffoldLayout}>
      <div className={styles.setting}>
        <div className={styles.title}>
          <HeaderTitle title="侧边菜单栏" />
          <Button type="primary" onClick={() => setVisible(true)}>添加</Button>
        </div>
        <div className={styles.content}>
          <List size="small">
            <List.Item
              extra={
                <Box direction="row" align="center" style={{ whiteSpace: 'nowrap', height: '100%', paddingLeft: 100 }}>
                  <Button text type="primary">编辑</Button>
                  <Divider direction="ver" />
                  <Button text type="primary">删除</Button>
                </Box>
              }
            // title="两列列表单页面"
            >
              两列列表单页面
            </List.Item>
            <List.Item
              extra={
                <Box direction="row" align="center" style={{ whiteSpace: 'nowrap', height: '100%', paddingLeft: 100 }}>
                  <Button text type="primary">编辑</Button>
                  <Divider direction="ver" />
                  <Button text type="primary">删除</Button>
                </Box>
              }
            >
              两列列表单页面
            </List.Item>
          </List>
        </div>
      </div>

      <div className={styles.setting}>
        <div className={styles.title}>
          <HeaderTitle title="顶部菜单栏" />
          <Button type="primary" onClick={() => setVisible(true)}>添加</Button>
        </div>
        <div className={styles.content}>
          <List size="small">
            <List.Item
              extra={
                <Box direction="row" align="center" style={{ whiteSpace: 'nowrap', height: '100%', paddingLeft: 100 }}>
                  <Button text type="primary">编辑</Button>
                  <Divider direction="ver" />
                  <Button text type="primary">删除</Button>
                </Box>
              }
            // title="一列表单页面"
            >
              一列表单页面
            </List.Item>
          </List>
        </div>
      </div>

      <div className={styles.setting}>
        <HeaderTitle title="其他组件" />
        <div className={styles.content}>
          <Checkbox.Group itemDirection="ver" >
            <Checkbox value="Logo">Logo 组件</Checkbox>
            <Checkbox value="avatar">用户头像组件</Checkbox>
            <Checkbox value="notice">通知组件</Checkbox>
          </Checkbox.Group>
        </div>
      </div>

      {/* <div className={styles.footerSetting}>
        <div>页脚</div>
        <Button onClick={() => setVisible(true)}>弹窗</Button>
      </div> */}

      <Dialog
        visible={visible}
        title="搭建页面"
        onCancel={() => setVisible(false)}
        onClose={() => setVisible(false)}
      >
        <PageGenerator />
      </Dialog>
    </div>
  );
};

export default ScaffoldLayout;
