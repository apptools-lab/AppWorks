import * as React from 'react';
import { Icon, Input } from '@alifd/next';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { PLACEHOLDER_IMG } from '@iceworks/material-utils';
import { useIntl, FormattedMessage } from 'react-intl';
import * as styles from './index.module.scss';

export const BlockDragHandle = SortableHandle(({ title, screenshot }) => (
  <div className={styles.screenshot}>
    <img alt={title} src={screenshot} />
  </div>
));

export const SelectedBlock = SortableElement(
  ({ title, screenshot, name, onNameChange, onDelete, targetIndex, isSorting }) => {
    return (
      <div className={`${styles.item} ${isSorting ? styles.isSorting : ''}`}>
        <BlockDragHandle title={title} screenshot={screenshot || PLACEHOLDER_IMG} />
        <div className={styles.name}>
          <Input
            autoFocus
            value={name}
            className={styles.input}
            onChange={value => onNameChange(value, targetIndex)}
          />
          <Icon className={styles.icon} type="edit" />
        </div>
        <Icon className={styles.delete} type="ashbin" onClick={() => onDelete(targetIndex)} />
      </div>
    );
  },
);

const PageSelected = SortableContainer(({ blocks, onNameChange, onDelete, isSorting }) => {
  const intl = useIntl();
  return (
    <div className={styles.pageSelected}>
      {blocks.length ? (
        <div className={styles.list}>
          {
            blocks.map((block, index) => {
              return (
                <SelectedBlock
                  {...block}
                  key={block.name}
                  index={index}
                  targetIndex={index}
                  onNameChange={onNameChange}
                  onDelete={onDelete}
                  isSorting={isSorting}
                />
              );
            })
          }
        </div>
      ) : (
        <div className={styles.empty}>
          <img
            src="https://img.alicdn.com/tfs/TB1yGn2mYZnBKNjSZFrXXaRLFXa-182-149.png"
            alt="Block"
          />
          <FormattedMessage id='web.iceworksPageBuilder.Home.PageSelect.SelectFromRight'/>
        </div>
      )}
    </div>
  );
});

export default PageSelected;
