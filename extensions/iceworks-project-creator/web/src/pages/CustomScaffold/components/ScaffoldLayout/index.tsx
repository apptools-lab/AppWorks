import React, { useState } from 'react';
import { Checkbox, List, Box, Button, Divider, Dialog, Notification } from '@alifd/next';
import PageGenerator from '../PageGenerator';
import { MenuType } from '../../constants';
import HeaderTitle from '@/components/HeaderTitle';
import styles from './index.module.scss';

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
  const { asideMenu, headerMenu, layouts } = value;

  const [visible, setVisible] = useState(false);
  const [operationType, setOperationType] = useState<OperationType>('create');
  const [menuType, setMenuType] = useState<MenuType>('aside');
  const [pageConfig, setPageConfig] = useState<MenuItem>();

  // check if the router path existed
  const validate = (detail) => {
    if (asideMenu.concat(headerMenu).some(item => item.path === detail.path)) {
      const error = `已存在相同路由：${detail.path}`;
      Notification.error({
        content: error,
      });
      return error;
    }
  };

  const onPageGeneratorSubmit = (pageDetail) => {
    const error = validate(pageDetail);
    if (error) {
      return error;
    }
    const currentMenuList = menuType === 'aside' ? [...asideMenu] : [...headerMenu];

    if (operationType === 'create') {
      currentMenuList.push(pageDetail);
    }
    if (operationType === 'edit') {
      const targetIndex = currentMenuList.findIndex(item => item.path === pageDetail.path);
      currentMenuList[targetIndex] = pageDetail;
    }

    onChange({ [menuType === 'aside' ? 'asideMenu' : 'headerMenu']: currentMenuList });
    setVisible(false);

    return true;
  };
  const handleDeleteConfirmDialog = (type: MenuType, index: number) => {
    Dialog.confirm({
      title: 'Confirm',
      content: '确定删除该页面？',
      onOk: () => onPageDelete(type, index),
    });
  };

  const onPageDelete = (type: MenuType, index: number) => {
    const currentMenuList = menuType === 'aside' ? [...asideMenu] : [...headerMenu];
    currentMenuList.splice(index, 1);
    onChange({ [type === 'aside' ? 'asideMenu' : 'headerMenu']: currentMenuList });
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

  const onLayoutConfigChange = (layoutConfigs) => {
    onChange({ layouts: layoutConfigs });
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
              asideMenu.map((item, index) => (
                <List.Item
                  key={item.pageName}
                  extra={
                    <Box direction="row" align="center" style={{ whiteSpace: 'nowrap', height: '100%', paddingLeft: 100 }}>
                      <Button text type="primary" onClick={() => onPageEdit('edit', 'aside', item)}>编辑</Button>
                      <Divider direction="ver" />
                      <Button text type="primary" onClick={() => handleDeleteConfirmDialog('aside', index)}>删除</Button>
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
              headerMenu.map((item, index) => (
                <List.Item
                  key={item.pageName}
                  extra={
                    <Box direction="row" align="center" style={{ whiteSpace: 'nowrap', height: '100%', paddingLeft: 100 }}>
                      <Button text type="primary" onClick={() => onPageEdit('edit', 'header', item)}>编辑</Button>
                      <Divider direction="ver" />
                      <Button text type="primary" onClick={() => handleDeleteConfirmDialog('header', index)}>删除</Button>
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
        <HeaderTitle title="Layout 组件" />
        <div className={styles.content}>
          <Checkbox.Group value={layouts} itemDirection="ver" onChange={onLayoutConfigChange}>
            <Checkbox value="branding">Logo 组件</Checkbox>
            <Checkbox value="headerAvatar">用户头像组件</Checkbox>
            <Checkbox value="footer">底部组件</Checkbox>
          </Checkbox.Group>
        </div>
      </div>
      <Dialog
        className={styles.dialog}
        visible={visible}
        title="搭建页面"
        onCancel={() => setVisible(false)}
        onClose={() => setVisible(false)}
        footer={false}
      >
        <PageGenerator
          onSubmit={onPageGeneratorSubmit}
          value={pageConfig}
        />
      </Dialog>
    </div >
  );
};

export default ScaffoldLayout;
