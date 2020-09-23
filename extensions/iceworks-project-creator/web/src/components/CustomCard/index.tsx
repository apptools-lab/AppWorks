import React from 'react';
import { Card } from '@alifd/next';
import classnames from 'classnames';
import successIcon from '@/assets/success.svg';
import styles from './index.module.scss';

interface ICustomCard {
  title: string | React.ReactNode;
  selected: boolean;
  content?: string | React.ReactNode;
  style?: Record<string, unknown>;
  onClick?: any;
  media?: string;
}

const CustomCard: React.FC<ICustomCard> = ({
  selected,
  title,
  media = '',
  style = {},
  onClick = () => { },
  content = '',
}) => {
  return (
    <Card
      free
      style={{ ...style }}
      className={classnames(styles.card, { [styles.active]: selected })}
      onClick={onClick}
    >
      {selected && <img src={successIcon} className={styles.successIcon} alt="success" />}
      <Card.Media>
        {media && <img height={120} src={media} alt="screenshot" style={{ padding: '10px 10px 0' }} />}
      </Card.Media>
      <Card.Header title={title} />
      <Card.Content>
        <div className={styles.content}>{content}</div>
      </Card.Content>
    </Card>
  );
};

export default CustomCard;
