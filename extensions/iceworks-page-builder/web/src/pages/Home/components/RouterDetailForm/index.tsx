import React from 'react';
import { Dialog, Field, Form, Input, Select } from '@alifd/next';
import styles from './index.module.scss';

interface IPageDetail {
  pageName: string;
  path: string;
  parent: string;
  nagivationName?: string;
}

interface IPageDetailForm {
  isCreating: boolean;
  visible: boolean;
  routerConfig: IRouter[];
  onSubmit: (data: IPageDetail) => void;
  onClose: () => void;
}
export interface IRouter {
  path: string;
  component?: string;
  layout?: string;
  children?: IRouter[];
}

const PageDetailForm: React.FC<IPageDetailForm> = ({
  isCreating,
  visible,
  routerConfig,
  onSubmit,
  onClose,
}) => {
  const field = Field.useField({
    values: {}
  });

  const submit = async () => {
    const { errors } = await field.validatePromise();
    if (errors && errors.length > 0) {
      return;
    }

    onSubmit(field.getValues());
  };

  return (
    <Dialog
      visible={visible}
      title="新增页面"
      style={{ width: 500 }}
      onOk={submit}
      okProps={{ loading: isCreating }}
      onCancel={onClose}
      onClose={onClose}
      autoFocus
      cancelProps={{ disabled: isCreating }}
    >
      <Form field={field} fullWidth className={styles.form}>
        <Form.Item label="页面目录名" required requiredMessage="请输入页面目录名">
          <Input name="pageName" placeholder="请输入页面目录名" disabled={isCreating} />
        </Form.Item>
        <Form.Item label="路由路径" required requiredMessage="请输入路由路径">
          <Input name="path" placeholder="请输入路由路径" disabled={isCreating} />
        </Form.Item>
        <Form.Item label="父级路由" required requiredMessage="请选择父级路由">
          <Select name="parent" placeholder="请选择父级路由" disabled={isCreating}>
            {routerConfig.map(route => (
              <Select.Option value={route.path}>{route.component}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="页面导航名">
          <Input name="nagivationName" placeholder="请输入页面导航名" disabled={isCreating} />
        </Form.Item>
      </Form>
    </Dialog>
  )
}

export default PageDetailForm;
