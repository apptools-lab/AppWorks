import React from 'react';
import { Dialog, Form, Input, Button } from '@alifd/next';
import { IMaterialSource } from '@iceworks/material-utils';
import { FormattedMessage } from 'react-intl';
import styles from './MaterialSourceForm.module.scss';
import {i18n} from '../../i18n';


interface IMaterialSourceForm {
  title: string;
  value: IMaterialSource | object;
  visible: boolean;
  onSubmit: (value: any) => void;
  onCancel: () => void;
}

const MaterialSourceForm: React.FC<IMaterialSourceForm> = ({ title, value, onSubmit, visible, onCancel }) => {
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
        <Form.Item label={i18n.formatMessage({id:'web.iceworksApp.MaterialSourceForm.materialNameLabel'})} 
          required requiredMessage={i18n.formatMessage({id:'web.iceworksApp.MaterialSourceForm.materialName'})}>
          <Input name="name" placeholder={i18n.formatMessage({id:'web.iceworksApp.MaterialSourceForm.materialName'})} />
        </Form.Item>
        <Form.Item label={i18n.formatMessage({id:'web.iceworksApp.MaterialSourceForm.materiaURLLabel'})}
          required requiredMessage={i18n.formatMessage({id:'web.iceworksApp.MaterialSourceForm.materiaURL'})} format="url">
          <Input name="source" placeholder={i18n.formatMessage({id:'web.iceworksApp.MaterialSourceForm.materiaURL'})} />
        </Form.Item>
        <Form.Item label={i18n.formatMessage({id:'web.iceworksApp.MaterialSourceForm.materialDescriptionLabel'})}>
          <Input.TextArea name="description" placeholder={i18n.formatMessage({id:'web.iceworksApp.MaterialSourceForm.materialDescription'})} />
        </Form.Item>
        <Form.Item className={styles.formBtns}>
          <Form.Submit
            type="primary"
            onClick={onFormSubmit}
            validate
          >
            <FormattedMessage id="web.iceworksApp.MaterialSourceForm.confirm"/>
          </Form.Submit>
          <Button onClick={onCancel} className={styles.btn}>
            <FormattedMessage id="web.iceworksApp.MaterialSourceForm.cancel"/>
          </Button>
        </Form.Item>
      </Form>
    </Dialog>
  )
}

export default MaterialSourceForm;
