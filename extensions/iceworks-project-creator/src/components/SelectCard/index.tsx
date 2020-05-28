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
    <Card
      free
      className={styles.card}
      style={{ width, border: cardBorderStyle }}
      onClick={onClick}
    >
      <Card.Media>
        {media}
      </Card.Media>
      <Card.Header title={title} />
      <Card.Content>
        {content}
      </Card.Content>
    </Card>
  );
};

export default SelectedCard;
