import React from 'react';
import { Dialog, Field, Form, Input, Select } from '@alifd/next';
import styles from './index.module.scss';

interface IPageDetail {
  pageName: string;
  path?: string;
  parent?: string;
}

interface IRouter {
  path: string;
  component?: string;
  layout?: string;
  children?: IRouter[];
}

interface IPageDetailForm {
  isCreating: boolean;
  visible: boolean;
  routerConfig: IRouter[];
  isConfigurableRouter: boolean;
  onSubmit: (data: IPageDetail) => void;
  onClose: () => void;
}

const PageDetailForm: React.FC<IPageDetailForm> = ({
  isCreating,
  visible,
  routerConfig,
  isConfigurableRouter,
  onSubmit,
  onClose,
}) => {
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
        <Form.Item label="页面名称" required requiredMessage="请输入页面名称">
          <Input name="pageName" placeholder="请输入页面名称" disabled={isCreating} />
        </Form.Item>
        {isConfigurableRouter && (
          <Form.Item label="路由路径" required requiredMessage="请输入路由路径">
            <Input name="path" placeholder="请输入路由路径" disabled={isCreating} />
          </Form.Item>
        )}
        {isConfigurableRouter && !!includedChildrenRouterConfig.length && (
          <Form.Item label="父级路由" required requiredMessage="请选择父级路由">
            <Select name="parent" placeholder="请选择父级路由" disabled={isCreating}>
              {includedChildrenRouterConfig.map((route) => (
                <Select.Option value={route.path}>{route.component}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Dialog>
  );
};

export default PageDetailForm;
