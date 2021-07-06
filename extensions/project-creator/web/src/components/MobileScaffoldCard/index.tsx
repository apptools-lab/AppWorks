import * as React from 'react';
import { Card } from '@alifd/next';
import classnames from 'classnames';
import successIcon from '@/assets/success.svg';
import styles from './index.module.scss';

interface IMobileScaffoldCardProps {
  title: string | React.ReactNode;
  content?: string | React.ReactNode;
  selected: boolean;
  style?: Record<string, unknown>;
  onClick?: any;
  media?: string;
  onDoubleClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const MobileScaffoldCard: React.FC<IMobileScaffoldCardProps> = ({
  title,
  content,
  selected,
  onClick,
  media,
  style,
  onDoubleClick = () => {},
}) => {
  return (
    <div className={styles.container} onDoubleClick={onDoubleClick}>
      <Card
        free
        style={{ ...style }}
        className={classnames(styles.card, { [styles.active]: selected })}
        onClick={onClick}
      >
        {selected && <img src={successIcon} className={styles.successIcon} alt="success" />}
        <Card.Media>{media && <img src={media} alt="screenshot" className={styles.media} />}</Card.Media>
        <Card.Header title={title} />
        <div className={styles.mark}>
          <div className={styles.content}>{content}</div>
        </div>
      </Card>
    </div>
  );
};

export default MobileScaffoldCard;
