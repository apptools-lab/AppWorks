import React from 'react';
import { Checkbox, List, Box, Button, Divider } from '@alifd/next';
import HeaderTitle from '@/components/HeaderTitle';
import styles from './index.module.scss';

const ScaffoldLayout = () => {
  // const [visible, setVisible] = useState(false);
  // console.log(visible);

  return (
    <div className={styles.scaffoldLayout}>
      {/* <div className={styles.layoutSelect}>
        <Row align="center">
          <Col offset={1} span={4}>布局名称：</Col>
          <Col span={20}>
            <Input style={{ width: 200 }} />
          </Col>
        </Row>
      </div> */}

      <div className={styles.setting}>
        <div className={styles.title}>
          <HeaderTitle title="侧边菜单栏" />
          <Button type="primary" onClick={() => { }}>添加</Button>
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
            // title="两列列表单页面"
            >
              两列列表单页面
            </List.Item>
          </List>
        </div>
      </div>

      <div className={styles.setting}>
        <div className={styles.title}>
          <HeaderTitle title="顶部菜单栏" />
          <Button type="primary" onClick={() => { }}>添加</Button>
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

      {/* <Dialog visible={visible}>
        ffff
      </Dialog> */}
    </div>
  );
};

export default ScaffoldLayout;
