import * as React from 'react';
import { Card } from '@alifd/next';
import classNames from 'classnames';
import styles from './index.module.scss';

interface ISelectCardProps {
  title: string;
  content?: string | React.ReactNode;
  selected: boolean;
  style?: object;
  onClick?: any;
  media?: string | React.ReactNode;
}

const SelectCard: React.FC<ISelectCardProps> = ({ title, content, selected, onClick, media, style }) => {
  return (
    <div>
      <Card
        free
        style={{ ...style }}
        className={
          classNames(styles.card, { [styles.active]: selected })
        }
        onClick={onClick}
      >
        {selected && <img src={require('@/assets/success.svg')} className={styles.successIcon} />}
        <Card.Media>
          {media}
        </Card.Media>
        <Card.Header title={title} />
        <Card.Content>
          {content}
        </Card.Content>
      </Card>
    </div>
  );
};

export default SelectCard;
