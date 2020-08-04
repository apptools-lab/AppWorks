import React from 'react';
import { Dialog, Form, Input, Button } from '@alifd/next';
import { IMaterialSource } from '@iceworks/material-utils';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from './MaterialSourceForm.module.scss';

interface IMaterialSourceForm {
  title: string;
  value: IMaterialSource | object;
  visible: boolean;
  onSubmit: (value: any) => void;
  onCancel: () => void;
}

const MaterialSourceForm: React.FC<IMaterialSourceForm> = ({ title, value, onSubmit, visible, onCancel }) => {
  const intl = useIntl();
  const onFormSubmit = (values, errors) => {
    if (errors) {
      return;
    }
    onSubmit(values);
  };

  return (
    <Dialog
      footer={false}
      visible={visible}
      title={title}
      className={styles.dialog}
      onCancel={onCancel}
      onClose={onCancel}
    >
      <Form value={value} fullWidth className={styles.form}>
        <Form.Item
          label={intl.formatMessage({ id: 'web.iceworksApp.MaterialSourceForm.materialNameLabel' })}
          required
          requiredMessage={intl.formatMessage({ id: 'web.iceworksApp.MaterialSourceForm.materialName' })}
        >
          <Input
            name="name"
            placeholder={intl.formatMessage({ id: 'web.iceworksApp.MaterialSourceForm.materialName' })}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'web.iceworksApp.MaterialSourceForm.materiaURLLabel' })}
          required
          requiredMessage={intl.formatMessage({ id: 'web.iceworksApp.MaterialSourceForm.materiaURL' })}
          format="url"
        >
          <Input
            name="source"
            placeholder={intl.formatMessage({ id: 'web.iceworksApp.MaterialSourceForm.materiaURL' })}
          />
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'web.iceworksApp.MaterialSourceForm.materialDescriptionLabel' })}>
          <Input.TextArea
            name="description"
            placeholder={intl.formatMessage({ id: 'web.iceworksApp.MaterialSourceForm.materialDescription' })}
          />
        </Form.Item>
        <Form.Item className={styles.formBtns}>
          <Form.Submit type="primary" onClick={onFormSubmit} validate>
            <FormattedMessage id="web.iceworksApp.MaterialSourceForm.confirm" />
          </Form.Submit>
          <Button onClick={onCancel} className={styles.btn}>
            <FormattedMessage id="web.iceworksApp.MaterialSourceForm.cancel" />
          </Button>
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export default MaterialSourceForm;
