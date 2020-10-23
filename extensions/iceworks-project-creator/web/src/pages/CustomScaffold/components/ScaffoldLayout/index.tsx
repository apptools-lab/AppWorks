import React, { useEffect, useState } from 'react';
import { Checkbox, List, Box, Button, Divider, Dialog, Message } from '@alifd/next';
import PageGenerator from '../PageGenerator';
import HeaderTitle from '@/components/HeaderTitle';
import styles from './index.module.scss';

type MenuType = 'aside' | 'header';
type OperationType = 'create' | 'edit';

interface MenuItem {
  pageName: string;
  path: string;
  blocks: any;
}

const defaultMenuItem = {
  pageName: '',
  path: '',
  blocks: [],
};
const ScaffoldLayout = ({ onChange, value }) => {
  const [visible, setVisible] = useState(false);
  const [asideMenuList, setAsideMenuList] = useState<MenuItem[]>([]);
  const [headerMenuList, setHeaderMenuList] = useState<MenuItem[]>([]);
  const [operationType, setOperationType] = useState<OperationType>('create');
  const [menuType, setMenuType] = useState<MenuType>('aside');
  const [pageConfig, setPageConfig] = useState<MenuItem>();

  useEffect(() => {
    const { asideMenu = [], headerMenu = [] } = value;
    setAsideMenuList(asideMenu);
    setHeaderMenuList(headerMenu);
  }, [value]);

  const onPageGeneratorSubmit = (pageValue) => {
    try {
      const currentMenuList = menuType === 'aside' ? [...asideMenuList] : [...headerMenuList];

      if (operationType === 'create') {
        currentMenuList.push(pageValue);
      }
      if (operationType === 'edit') {
        const { path } = pageValue;
        const targetIndex = currentMenuList.findIndex(item => item.path === path);
        currentMenuList[targetIndex] = pageValue;
      }
      onChange({ [menuType === 'aside' ? 'asideMenu' : 'headerMenu']: currentMenuList });
      setVisible(false);
    } catch (error) {
      Message.error(error.message);
    }
  };
  // TODO:
  const onPageDelete = () => {

  };

  const onPageEdit = (operation: OperationType, type: MenuType, menuItem?: MenuItem) => {
    setVisible(true);
    setMenuType(type);
    setOperationType(operation);
    if (operation === 'edit') {
      setPageConfig(menuItem);
    } else {
      setPageConfig(defaultMenuItem);
    }
  };

  return (
    <div className={styles.scaffoldLayout}>
      <div className={styles.setting}>
        <div className={styles.title}>
          <HeaderTitle title="侧边菜单栏" />
          <Button type="primary" onClick={() => onPageEdit('create', 'aside')}>添加</Button>
        </div>
        <div className={styles.content}>
          <List size="small">
            {
              asideMenuList.map(item => (
                <List.Item
                  extra={
                    <Box direction="row" align="center" style={{ whiteSpace: 'nowrap', height: '100%', paddingLeft: 100 }}>
                      <Button text type="primary" onClick={() => onPageEdit('edit', 'aside', item)}>编辑</Button>
                      <Divider direction="ver" />
                      <Button text type="primary" onClick={() => onPageDelete()}>删除</Button>
                    </Box>
                  }
                >
                  {item.pageName}
                </List.Item>
              ))
            }
          </List>
        </div>
      </div>

      <div className={styles.setting}>
        <div className={styles.title}>
          <HeaderTitle title="顶部菜单栏" />
          <Button type="primary" onClick={() => onPageEdit('create', 'header')}>添加</Button>
        </div>
        <div className={styles.content}>
          <List size="small">
            {
              headerMenuList.map(item => (
                <List.Item
                  extra={
                    <Box direction="row" align="center" style={{ whiteSpace: 'nowrap', height: '100%', paddingLeft: 100 }}>
                      <Button text type="primary" onClick={() => onPageEdit('edit', 'header', item)}>编辑</Button>
                      <Divider direction="ver" />
                      <Button text type="primary" onClick={() => onPageDelete()}>删除</Button>
                    </Box>
                  }
                >
                  {item.pageName}
                </List.Item>
              ))
            }
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
      <Dialog
        className={styles.dialog}
        visible={visible}
        title="搭建页面"
        onCancel={() => setVisible(false)}
        onClose={() => setVisible(false)}
      >
        <PageGenerator onSubmit={onPageGeneratorSubmit} value={pageConfig} />
      </Dialog>
    </div >
  );
};

export default ScaffoldLayout;
