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
  onMaterialSourceEdit: (values: IMaterialSource, index: number) => void;
  onMaterialSourceDelete: (index: number) => void;
}

const CustomMaterialSource: React.FC<ICustomMaterialSource> = ({
  sources = [],
  onMaterialSourceAdd,
  onMaterialSourceEdit,
  onMaterialSourceDelete
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [currentMaterialSource, setCurrentMaterialSource] = useState<IMaterialSource | object>({});
  const [currentSourceIndex, setCurrentSourceIndex] = useState<number>();
  const [operation, setOperation] = useState<Operation.Create | Operation.Edit>();

  const onDialogShow = () => setVisible(true);

  const onDialogCancel = () => setVisible(false);

  const onFormSubmit = (values: IMaterialSource) => {
    if (Operation.Create === operation) {
      onMaterialSourceAdd(values);
    }
    if (Operation.Edit === operation) {
      onMaterialSourceEdit(values, currentSourceIndex!)
    }
    onDialogCancel();
  }

  const onSourceValidator = (rule: object, value: string, callback: (errors?: string) => void) => {
    if (operation !== Operation.Create) {
      return callback();
    }
    if (sources.filter((item) => item.name === value).length) {
      return callback('已存在相同的物料源名称，请重新输入');
    }
    return callback();
  }

  const onSourceAdd = () => {
    setOperation(Operation.Create);
    setCurrentMaterialSource({});
    onDialogShow()
  }

  const onSourceEdit = (source: IMaterialSource, index: number) => {
    setOperation(Operation.Edit);
    setCurrentMaterialSource(source);
    setCurrentSourceIndex(index);
    onDialogShow();
  }

  const onSourceDelete = (index: number) => {
    Dialog.confirm({
      title: 'Confirm',
      content: '是否确定删除该物料源？',
      onOk: () => onMaterialSourceDelete(index)
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
          {sources.map((source: IMaterialSource, index: number) => (
            <List.Item
              media={<Avatar className={styles.listItemMedia}>{source.name.slice(0, 1).toLocaleUpperCase()}</Avatar>}
              extra={
                <div>
                  <img className={styles.icon} src={editIcon} alt="edit" onClick={() => onSourceEdit(source, index)} />
                  <img className={styles.icon} src={deleteIcon} alt="delete" onClick={() => onSourceDelete(index)} />
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
          onSourceValidator={onSourceValidator}
          onSubmit={onFormSubmit}
          onCancel={onDialogCancel}
        />
      </Suspense>
    </div>
  )
}
export default CustomMaterialSource;
