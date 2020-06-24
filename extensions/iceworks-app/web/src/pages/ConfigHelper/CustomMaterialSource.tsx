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
  onMaterialSourceAdd: (values: IMaterialSource) => void;
  onMaterialSourceEdit: (values: IMaterialSource, originMaterialSource: IMaterialSource) => void;
  onMaterialSourceDelete: (materialSource: IMaterialSource) => void;
}

const CustomMaterialSource: React.FC<ICustomMaterialSource> = ({
  sources = [],
  onMaterialSourceAdd,
  onMaterialSourceEdit,
  onMaterialSourceDelete
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [currentMaterialSource, setCurrentMaterialSource] = useState<IMaterialSource | object>({});
  const [operation, setOperation] = useState<Operation.Create | Operation.Edit>();

  const onDialogShow = () => setVisible(true);

  const onDialogCancel = () => setVisible(false);

  const onFormSubmit = (values: IMaterialSource) => {
    if (Operation.Create === operation) {
      onMaterialSourceAdd(values);
    }
    if (Operation.Edit === operation) {
      onMaterialSourceEdit(values, currentMaterialSource as IMaterialSource)
    }
    onDialogCancel();
  }

  const onSourceAdd = () => {
    setOperation(Operation.Create);
    setCurrentMaterialSource({});
    onDialogShow()
  }

  const onSourceEdit = (materialSource: IMaterialSource) => {
    setOperation(Operation.Edit);
    setCurrentMaterialSource(materialSource);
    onDialogShow();
  }

  const onSourceDelete = (materialSource: IMaterialSource) => {
    Dialog.confirm({
      title: 'Confirm',
      content: '是否确定删除该物料源？',
      onOk: () => onMaterialSourceDelete(materialSource)
    });
  }
  const dialogTitle = `${operation === Operation.Edit ? '编辑' : '新增'}物料源`
  return (
    <div className={styles.customMaterialSource}>
      <div className={styles.row}>
        <div className={styles.label}>自定义物料源</div>
        <div className={styles.btn}><Button onClick={onSourceAdd}><Icon type="add" />添加</Button></div>
      </div>
      <div className={styles.sourcesList}>
        <List size="small">
          {sources.map((source: IMaterialSource) => (
            <List.Item
              media={<Avatar className={styles.listItemMedia}>{source.name.slice(0, 1).toLocaleUpperCase()}</Avatar>}
              extra={
                <div>
                  <img className={styles.icon} src={editIcon} alt="edit" onClick={() => onSourceEdit(source)} />
                  <img className={styles.icon} src={deleteIcon} alt="delete" onClick={() => onSourceDelete(source)} />
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
