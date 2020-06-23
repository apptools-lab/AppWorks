import React, { useState, Suspense } from 'react';
import { Icon, List, Button } from '@alifd/next';
import { IMaterialSource } from '@iceworks/material-utils';
import MaterialSourceForm from './MaterialSourceForm';
import styles from './CustomMaterialSource.module.scss';

interface ICustomMaterialSource {
  sources: IMaterialSource[];
  onMaterialSourceAdd: (values: IMaterialSource) => void;
}

const CustomMaterialSource: React.FC<ICustomMaterialSource> = ({ sources = [], onMaterialSourceAdd }) => {
  const [visible, setVisible] = useState<boolean>(false);

  const onDialogShow = () => setVisible(true);

  const onDialogCancel = () => setVisible(false);

  const onFormSubmit = (values: IMaterialSource) => {
    console.log(values);
    onMaterialSourceAdd(values);
  }
  return (
    <div className={styles.customMaterialSource}>
      <div className={styles.row}>
        <div className={styles.label}>自定义物料源</div>
        <div className={styles.btn}><Button onClick={onDialogShow}><Icon type="add" />添加</Button></div>
      </div>
      <div className={styles.sourcesList}>
        <List size="small">
          {sources.map((source: IMaterialSource) => (
            <List.Item
              extra={<div><Icon type="add" /><Icon type="add" /></div>}
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
          visible={visible}
          onSubmit={onFormSubmit}
          onCancel={onDialogCancel}
        />
      </Suspense>
    </div>
  )
}
export default CustomMaterialSource;
