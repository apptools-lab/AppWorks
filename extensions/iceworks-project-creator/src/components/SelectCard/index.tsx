import * as React from 'react';
import { Card } from '@alifd/next';
import styles from './index.module.scss';

interface ISelectedCardProps {
  title: string;
  content?: string | React.ReactNode;
  selected: boolean;
  style: object;
  onClick: any;
  media?: string | React.ReactNode;
}

const SelectedCard: React.FC<ISelectedCardProps> = ({ title, content, selected, onClick, media, style }) => {
  const cardSelectedBorderStyle = `1px solid ${selected ? '#1274e7' : '#e6e7eb'}`;
  return (
    <div>
      <Card
        free
        className={styles.card}
        style={{ border: cardSelectedBorderStyle, ...style }}
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

export default SelectedCard;
