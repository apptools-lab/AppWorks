import React from 'react';
import { Dialog, Form, Input, Button, Balloon, Icon } from '@alifd/next';
import { IMaterialSource } from '@appworks/material-utils';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from './index.module.scss';

interface IMaterialSourceForm {
  title: string;
  value: IMaterialSource | Record<string, unknown>;
  visible: boolean;
  onSubmit: (value: any) => void;
  onCancel: () => void;
  loading: boolean;
}

const MaterialSourceForm: React.FC<IMaterialSourceForm> = ({ title, value, onSubmit, visible, onCancel, loading }) => {
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
      title={
        <div>
          {title}
          <Balloon
            trigger={<Icon type="help" size="small" style={{ marginLeft: 6 }} />}
            align="r"
            alignEdge
            triggerType="hover"
          >
            <a href="https://ice.work/docs/materials/about" target="_blank">
              <FormattedMessage id="web.applicationManager.ConfigHelper.customMaterialSource.help" />
            </a>
          </Balloon>
        </div>
      }
      className={styles.dialog}
      onCancel={onCancel}
      onClose={onCancel}
    >
      <Form value={value} fullWidth className={styles.form}>
        <Form.Item
          label={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.MaterialSourceForm.materialNameLabel' })}
          required
          requiredMessage={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.MaterialSourceForm.materialName' })}
        >
          <Input
            name="name"
            placeholder={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.MaterialSourceForm.materialName' })}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.MaterialSourceForm.materiaURLLabel' })}
          required
          requiredMessage={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.MaterialSourceForm.materiaURL' })}
          format="url"
        >
          <Input
            name="source"
            placeholder={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.MaterialSourceForm.materiaURL' })}
          />
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.MaterialSourceForm.materialDescriptionLabel' })}>
          <Input.TextArea
            name="description"
            placeholder={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.MaterialSourceForm.materialDescription' })}
          />
        </Form.Item>
        <Form.Item className={styles.formBtns}>
          <Form.Submit type="primary" onClick={onFormSubmit} validate loading={loading}>
            <FormattedMessage id="web.applicationManager.ConfigHelper.MaterialSourceForm.confirm" />
          </Form.Submit>
          <Button onClick={onCancel} className={styles.btn} disabled={loading}>
            <FormattedMessage id="web.applicationManager.ConfigHelper.MaterialSourceForm.cancel" />
          </Button>
        </Form.Item>
      </Form>
    </Dialog>
  );
};

export default MaterialSourceForm;
