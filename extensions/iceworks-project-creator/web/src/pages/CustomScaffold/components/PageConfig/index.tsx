import React, { useState } from 'react';
import { List, Box, Button, Divider, Dialog, Notification } from '@alifd/next';
import { useIntl, FormattedMessage } from 'react-intl';
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

const PageConfig = ({ onChange, value }) => {
  const { asideMenu, headerMenu } = value;

  const intl = useIntl();

  const [visible, setVisible] = useState(false);
  const [operationType, setOperationType] = useState<OperationType>('create');
  const [menuType, setMenuType] = useState<MenuType>('aside');
  const [pageConfig, setPageConfig] = useState<MenuItem>();

  // check if the router path existed
  const validate = (detail) => {
    if (asideMenu.concat(headerMenu).some(item => item.path === detail.path)) {
      const error = intl.formatMessage({
        id: 'web.iceworksProjectCreator.customScaffold.routerExists.error',
      }, {
        path: detail.path,
      });
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
      content: intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.deletePage.confirm.content' }),
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

  return (
    <div className={styles.scaffoldLayout}>
      <div className={styles.setting}>
        <div className={styles.title}>
          <HeaderTitle title={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.asideMenu.title' })} />
          <Button type="primary" onClick={() => onPageEdit('create', 'aside')}>
            <FormattedMessage id="web.iceworksProjectCreator.add.title" />
          </Button>
        </div>
        <div className={styles.content}>
          <List size="small">
            {
              asideMenu.map((item, index) => (
                <List.Item
                  key={item.pageName}
                  extra={
                    <Box direction="row" align="center" style={{ whiteSpace: 'nowrap', height: '100%', paddingLeft: 100 }}>
                      <Button text type="primary" onClick={() => onPageEdit('edit', 'aside', item)}>
                        <FormattedMessage id="web.iceworksProjectCreator.edit.title" />
                      </Button>
                      <Divider direction="ver" />
                      <Button text type="primary" onClick={() => handleDeleteConfirmDialog('aside', index)}>
                        <FormattedMessage id="web.iceworksProjectCreator.delete.title" />
                      </Button>
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
          <HeaderTitle title={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.headerMenu.title' })} />
          <Button type="primary" onClick={() => onPageEdit('create', 'header')}>
            <FormattedMessage id="web.iceworksProjectCreator.add.title" />
          </Button>
        </div>
        <div className={styles.content}>
          <List size="small">
            {
              headerMenu.map((item, index) => (
                <List.Item
                  key={item.pageName}
                  extra={
                    <Box direction="row" align="center" style={{ whiteSpace: 'nowrap', height: '100%', paddingLeft: 100 }}>
                      <Button text type="primary" onClick={() => onPageEdit('edit', 'header', item)}>
                        <FormattedMessage id="web.iceworksProjectCreator.edit.title" />
                      </Button>
                      <Divider direction="ver" />
                      <Button text type="primary" onClick={() => handleDeleteConfirmDialog('header', index)}>
                        <FormattedMessage id="web.iceworksProjectCreator.delete.title" />
                      </Button>
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
      <Dialog
        className={styles.dialog}
        visible={visible}
        title={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.generatePage.title' })}
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

export default PageConfig;
