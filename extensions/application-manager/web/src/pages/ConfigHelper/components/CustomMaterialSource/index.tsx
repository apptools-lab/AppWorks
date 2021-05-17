import React, { useState, Suspense } from 'react';
import { Icon, List, Button, Dialog, Avatar, Balloon, Notification } from '@alifd/next';
import { IMaterialSource } from '@appworks/material-utils';
import { FormattedMessage, useIntl } from 'react-intl';
import editIcon from '../../../../../public/assets/edit.svg';
import deleteIcon from '../../../../../public/assets/delete.svg';
import MaterialSourceForm from '../MaterialSourceForm';
import styles from './index.module.scss';

enum Operation {
  Edit,
  Delete,
  Create,
}

interface ICustomMaterialSource {
  sources: IMaterialSource[];
  onSourceAdd: (values: IMaterialSource) => void;
  onSourceEdit: (values: IMaterialSource, originMaterialSource: IMaterialSource) => void;
  onSourceDelete: (materialSource: IMaterialSource) => void;
  addMaterialVisible?: boolean;
}

const CustomMaterialSource: React.FC<ICustomMaterialSource> = ({
  sources = [],
  onSourceAdd,
  onSourceEdit,
  onSourceDelete,
  addMaterialVisible = false,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(addMaterialVisible);
  const [currentMaterialSource, setCurrentMaterialSource] = useState<IMaterialSource | Record<string, unknown>>({});
  const [operation, setOperation] = useState<Operation.Create | Operation.Edit>();

  const onDialogShow = () => setVisible(true);

  const onDialogCancel = () => setVisible(false);

  const onFormSubmit = async (values: IMaterialSource) => {
    setLoading(true);
    try {
      if (Operation.Create === operation) {
        await onSourceAdd(values);
      }
      if (Operation.Edit === operation) {
        await onSourceEdit(values, currentMaterialSource as IMaterialSource);
      }
      onDialogCancel();
    } catch (error) {
      Notification.error({ content: error.message });
    } finally {
      setLoading(false);
    }
  };

  const onAdd = () => {
    setOperation(Operation.Create);
    setCurrentMaterialSource({});
    onDialogShow();
  };

  const onEdit = (materialSource: IMaterialSource) => {
    setOperation(Operation.Edit);
    setCurrentMaterialSource(materialSource);
    onDialogShow();
  };

  const onDelete = (materialSource: IMaterialSource) => {
    Dialog.confirm({
      title: 'Confirm',
      content: intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.customMaterialSource.confirmDelete' }),
      onOk: () => onSourceDelete(materialSource),
    });
  };
  const dialogTitle =
    operation === Operation.Edit
      ? intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.customMaterialSource.editMaterialSource' })
      : intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.customMaterialSource.addMaterialSource' });
  return (
    <div className={styles.customMaterialSource}>
      <div className={styles.row}>
        <span className={styles.label}>
          <FormattedMessage id="web.applicationManager.ConfigHelper.customMaterialSource.customMaterialSource" />
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
        </span>
        <div className={styles.btn}>
          <Button onClick={onAdd}>
            <Icon type="add" />
            <FormattedMessage id="web.applicationManager.ConfigHelper.customMaterialSource.add" />
          </Button>
        </div>
      </div>
      <div className={styles.sourcesList}>
        <List size="small">
          {sources.map((source: IMaterialSource) => (
            <List.Item
              media={<Avatar className={styles.listItemMedia}>{source.name.slice(0, 1).toLocaleUpperCase()}</Avatar>}
              extra={
                <div>
                  <img className={styles.icon} src={editIcon} alt="edit" onClick={() => onEdit(source)} />
                  <img className={styles.icon} src={deleteIcon} alt="delete" onClick={() => onDelete(source)} />
                </div>
              }
              title={source.name}
              key={source.name}
            >
              {source.description}
            </List.Item>
          ))}
        </List>
      </div>
      <Suspense fallback={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.customMaterialSource.loading' })}>
        <MaterialSourceForm
          loading={loading}
          value={currentMaterialSource}
          title={dialogTitle}
          visible={visible}
          onSubmit={onFormSubmit}
          onCancel={onDialogCancel}
        />
      </Suspense>
    </div>
  );
};
export default CustomMaterialSource;
