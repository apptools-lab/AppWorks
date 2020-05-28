import * as React from 'react';
import { Card } from '@alifd/next';
import styles from './index.module.scss';

interface ISelectedCardProps {
  title: string;
  content?: string | React.ReactNode;
  selected: boolean;
  width: number;
  onClick: any;
  media?: string | React.ReactNode;
}

const SelectedCard: React.FC<ISelectedCardProps> = ({ title, content, selected, width, onClick, media }) => {
  const cardBorderStyle = `1px solid ${selected ? '#1274e7' : '#e6e7eb'}`;
  return (
    <div>
      <Card
        free
        className={styles.card}
        style={{ width, border: cardBorderStyle }}
        onClick={onClick}
      >
        {selected && <img width={30} height={30} src={require('@/assets/success.svg')} className={styles.successIcon} />}
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
