import React from 'react';
import { Dialog, Field, Form, Input } from '@alifd/next';
import { useIntl } from 'react-intl';
import { IPageDetailForm } from '@/types';
import styles from './index.module.scss';

const PageDetailForm: React.FC<IPageDetailForm> = ({
  isCreating,
  visible,
  onSubmit,
  onClose,
  values,
}) => {
  const intl = useIntl();

  const field = Field.useField({
    values,
  });

  const submit = async () => {
    const { errors } = await field.validatePromise();
    if (errors) {
      return;
    }

    onSubmit(field.getValues());
  };
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
            id: 'web.iceworksProjectCreator.RouterDetailForm.pageName.label',
          })}
          required
          requiredMessage={intl.formatMessage({
            id: 'web.iceworksProjectCreator.RouterDetailForm.pageName.requiredMessage',
          })}
        >
          <Input
            name="pageName"
            placeholder={intl.formatMessage({
              id: 'web.iceworksProjectCreator.RouterDetailForm.pageName.placeholder',
            })}
            disabled={isCreating}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'web.iceworksProjectCreator.RouterDetailForm.path.label',
          })}
          required
          requiredMessage={intl.formatMessage({
            id: 'web.iceworksProjectCreator.RouterDetailForm.path.requiredMessage',
          })}
        >
          <Input
            name="path"
            placeholder={intl.formatMessage({
              id: 'web.iceworksProjectCreator.RouterDetailForm.path.placeholder',
            })}
            disabled={isCreating}
          />
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export default PageDetailForm;
