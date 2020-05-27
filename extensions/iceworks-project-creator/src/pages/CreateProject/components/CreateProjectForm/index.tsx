import * as React from 'react';
import { Form, Input } from '@alifd/next';
import styles from './index.module.scss';
import CustomIcon from '@/components/CustomIcon';

interface IProjectFormProps {
  field: any;
  onOpenFolderDialog: any;
}

class CreateProjectForm extends React.Component<IProjectFormProps> {
  render() {
    const { field, onOpenFolderDialog } = this.props;
    return (
      <Form field={field} className={styles.form} responsive fullWidth labelAlign="top">
        <Form.Item
          colSpan={12}
          label="项目名称"
          required
          requiredMessage="请输入项目名称"
          pattern={/^[a-z]([-_a-z0-9]*)$/i}
          patternMessage="请输入字母与数字组合，字母开头"
        >
          <Input placeholder="请输入项目名称" name="projectName" />
        </Form.Item>

        <Form.Item colSpan={12} label="项目路径" required requiredMessage="请选择项目路径">
          <Input placeholder="请选择项目路径" name="projectPath"
            innerAfter={<CustomIcon type="icon-folder" onClick={onOpenFolderDialog} style={{ cursor: 'pointer', marginRight: 4 }} />}
          />
        </Form.Item>
        {/* 
        <Form.Item colSpan={12}>
          {actions}
        </Form.Item> */}
      </Form>
    );
  }
}

export default CreateProjectForm;
