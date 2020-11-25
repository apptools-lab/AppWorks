import * as React from 'react';
import { Card } from '@alifd/next';
import classnames from 'classnames';
import successIcon from '@/assets/success.svg';
import styles from './index.module.scss';

interface IMaterialSourceCardProps {
  title: string | React.ReactNode;
  selected: boolean;
  onClick?: any;
  media?: string;
}

const MaterialSourceCard: React.FC<IMaterialSourceCardProps> = ({ title, selected, onClick, media }) => {
  return (
    <div className={styles.container}>
      <Card
        free
        className={classnames(styles.card, { [styles.active]: selected })}
        onClick={onClick}
      >
        {selected && <img src={successIcon} className={styles.successIcon} alt="success" />}
        <Card.Media>
          {media && <img height={120} src={media} alt="screenshot" style={{ padding: '10px 10px 0' }} />}
        </Card.Media>
        <Card.Header title={title} />
      </Card>
    </div>
  );
};

export default MaterialSourceCard;
