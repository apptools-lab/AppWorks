import React, { useState, Suspense } from 'react';
import { Icon, List, Button, Dialog, Avatar } from '@alifd/next';
import { IMaterialSource } from '@iceworks/material-utils';
import editIcon from '../../../public/assets/edit.svg';
import deleteIcon from '../../../public/assets/delete.svg';
import MaterialSourceForm from './MaterialSourceForm';
import styles from './CustomMaterialSource.module.scss';

enum Operation {
  Edit,
  Delete,
  Create
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
  onSourceDelete
}) => {
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
      onSourceEdit(values, currentMaterialSource as IMaterialSource)
    }
    onDialogCancel();
  }

  const onAdd = () => {
    setOperation(Operation.Create);
    setCurrentMaterialSource({});
    onDialogShow()
  }

  const onEdit = (materialSource: IMaterialSource) => {
    setOperation(Operation.Edit);
    setCurrentMaterialSource(materialSource);
    onDialogShow();
  }

  const onDelete = (materialSource: IMaterialSource) => {
    Dialog.confirm({
      title: 'Confirm',
      content: '是否确定删除该物料源？',
      onOk: () => onSourceDelete(materialSource)
    });
  }
  const dialogTitle = `${operation === Operation.Edit ? '编辑' : '新增'}物料源`
  return (
    <div className={styles.customMaterialSource}>
      <div className={styles.row}>
        <span className={styles.label}>自定义物料源</span>
        <div className={styles.btn}><Button onClick={onAdd}><Icon type="add" />添加</Button></div>
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
      <Suspense fallback="loading...">
        <MaterialSourceForm
          value={currentMaterialSource}
          title={dialogTitle}
          visible={visible}
          onSubmit={onFormSubmit}
          onCancel={onDialogCancel}
        />
      </Suspense>
    </div>
  )
}
export default CustomMaterialSource;
