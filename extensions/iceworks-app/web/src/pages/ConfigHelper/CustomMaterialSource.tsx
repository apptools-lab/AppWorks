import React, { useState, Suspense } from 'react';
import { Icon, List, Button, Dialog, Avatar } from '@alifd/next';
import { IMaterialSource } from '@iceworks/material-utils';
import { FormattedMessage, useIntl } from 'react-intl';
import editIcon from '../../../public/assets/edit.svg';
import deleteIcon from '../../../public/assets/delete.svg';
import MaterialSourceForm from './MaterialSourceForm';
import styles from './CustomMaterialSource.module.scss';

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
}

const CustomMaterialSource: React.FC<ICustomMaterialSource> = ({
  sources = [],
  onSourceAdd,
  onSourceEdit,
  onSourceDelete,
}) => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);
  const [currentMaterialSource, setCurrentMaterialSource] = useState<IMaterialSource | object>({});
  const [operation, setOperation] = useState<Operation.Create | Operation.Edit>();

  const onDialogShow = () => setVisible(true);

  const onDialogCancel = () => setVisible(false);

  const onFormSubmit = (values: IMaterialSource) => {
    if (Operation.Create === operation) {
      onSourceAdd(values);
    }
    if (Operation.Edit === operation) {
      onSourceEdit(values, currentMaterialSource as IMaterialSource);
    }
    onDialogCancel();
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
      content: intl.formatMessage({ id: 'web.iceworksApp.customMaterialSource.confirmDelete' }),
      onOk: () => onSourceDelete(materialSource),
    });
  };
  const dialogTitle =
    operation === Operation.Edit
      ? intl.formatMessage({ id: 'web.iceworksApp.customMaterialSource.editMaterialSource' })
      : intl.formatMessage({ id: 'web.iceworksApp.customMaterialSource.addMaterialSource' });
  return (
    <div className={styles.customMaterialSource}>
      <div className={styles.row}>
        <span className={styles.label}>
          <FormattedMessage id="web.iceworksApp.customMaterialSource.customMaterialSource" />
        </span>
        <div className={styles.btn}>
          <Button onClick={onAdd}>
            <Icon type="add" />
            <FormattedMessage id="web.iceworksApp.customMaterialSource.add" />
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
      <Suspense fallback={intl.formatMessage({ id: 'web.iceworksApp.customMaterialSource.loading' })}>
        <MaterialSourceForm
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
