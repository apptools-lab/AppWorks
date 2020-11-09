import React, { useState } from 'react';
import { Dialog, Field, Form, Input, Select, Balloon, Icon } from '@alifd/next';
import callService from '../../callService';
import { useIntl, FormattedMessage } from 'react-intl';
import { IMenuType, IPageDetailForm } from '../../types';
import styles from './index.module.scss';

const PageDetailForm: React.FC<IPageDetailForm> = ({
  isCreating,
  visible,
  routerConfig,
  isConfigurableRouter,
  onSubmit,
  onClose,
}) => {
  const intl = useIntl();

  const [menuTypes, setMenuTypes] = useState<IMenuType[]>([]);
  const field = Field.useField({
    values: {},
  });

  const submit = async () => {
    const { errors } = await field.validatePromise();
    if (errors) {
      return;
    }

    onSubmit(field.getValues());
  };

  const onLayoutChange = async (value: string) => {
    // find selected layout routers
    const router = includedChildrenRouterConfig.find(item => item.path === value);
    if (router) {
      const layoutName = router.component;
      if (!layoutName) {
        return;
      }

      const { headerMenuConfig, asideMenuConfig } = await callService('menu', 'getAllConfig', layoutName);
      const layoutMenuTypes: IMenuType[] = [];
      if (asideMenuConfig) {
        layoutMenuTypes.push({
          value: 'asideMenuConfig',
          label: intl.formatMessage({
            id: 'web.iceworksMaterialHelper.RouterDetailForm.asideMenuConfig.label',
          }),
        });
      }
      if (headerMenuConfig) {
        layoutMenuTypes.push({
          value: 'headerMenuConfig',
          label: intl.formatMessage({
            id: 'web.iceworksMaterialHelper.RouterDetailForm.headerMenuConfig.label',
          }),
        });
      }
      setMenuTypes(layoutMenuTypes);
    }
  };

  const includedChildrenRouterConfig = routerConfig.filter((item) => !!item.children);
  return (
    <Dialog
      visible={visible}
      title="新增页面"
      className={styles.dialog}
      onOk={submit}
      okProps={{ loading: isCreating }}
      onCancel={onClose}
      closeable={false}
      autoFocus
      cancelProps={{ disabled: isCreating }}
    >
      <Form field={field} fullWidth className={styles.form}>
        <Form.Item
          label={intl.formatMessage({
            id: 'web.iceworksMaterialHelper.RouterDetailForm.pageName.label',
          })}
          required
          requiredMessage={intl.formatMessage({
            id: 'web.iceworksMaterialHelper.RouterDetailForm.pageName.requiredMessage',
          })}
        >
          <Input
            name="pageName"
            placeholder={intl.formatMessage({
              id: 'web.iceworksMaterialHelper.RouterDetailForm.pageName.placeholder',
            })}
            disabled={isCreating}
          />
        </Form.Item>
        {isConfigurableRouter && (
          <Form.Item
            label={intl.formatMessage({
              id: 'web.iceworksMaterialHelper.RouterDetailForm.path.label',
            })}
            required
            requiredMessage={intl.formatMessage({
              id: 'web.iceworksMaterialHelper.RouterDetailForm.path.requiredMessage',
            })}
          >
            <Input
              name="path"
              placeholder={intl.formatMessage({
                id: 'web.iceworksMaterialHelper.RouterDetailForm.path.placeholder',
              })}
              disabled={isCreating}
            />
          </Form.Item>
        )}
        {isConfigurableRouter && !!includedChildrenRouterConfig.length && (
          <Form.Item
            label={intl.formatMessage({
              id: 'web.iceworksMaterialHelper.RouterDetailForm.parent.label',
            })}
          >
            <Select
              name="parent"
              placeholder={intl.formatMessage({
                id: 'web.iceworksMaterialHelper.RouterDetailForm.parent.placeholder',
              })}
              disabled={isCreating}
              onChange={onLayoutChange}
            >
              {includedChildrenRouterConfig.map((route) => (
                <Select.Option value={route.path} key={route.path}>{route.component}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {isConfigurableRouter && field.getValue('parent') && !!menuTypes.length && (
          <Form.Item
            label={
              <span>
                <FormattedMessage id="web.iceworksMaterialHelper.RouterDetailForm.menuType.label" />
                <Balloon type="primary" trigger={<Icon type="help" size="small" className={styles.helpIcon} />} closable={false}>
                  <FormattedMessage id="web.iceworksMaterialHelper.RouterDetailForm.menuType.helpMessage" />
                </Balloon>
              </span>
            }
          >
            <Select
              name="menuType"
              placeholder={intl.formatMessage({
                id: 'web.iceworksMaterialHelper.RouterDetailForm.menuType.placeholder',
              })}
              disabled={isCreating}
            >
              {menuTypes.map((item: IMenuType) => (
                <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Dialog>
  );
};

export default PageDetailForm;
