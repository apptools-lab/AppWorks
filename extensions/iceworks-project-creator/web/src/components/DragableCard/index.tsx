import React, { useRef } from 'react';
import { Card } from '@alifd/next';
import classnames from 'classnames';
import { XYCoord } from 'dnd-core';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import successIcon from '@/assets/success.svg';
import styles from './index.module.scss';

interface DragItem {
  index: number
  id: string
  type: string
}

interface IDragableCardProps {
  title: string | React.ReactNode;
  content?: string | React.ReactNode;
  selected: boolean;
  style?: Record<string, unknown>;
  onClick?: any;
  media?: string;
  index: number;
  id: string;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

const DragableCard: React.FC<IDragableCardProps> = ({
  title,
  content,
  selected,
  onClick,
  media,
  style,
  moveCard,
  index,
  id,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'card',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div ref={ref}>
      <Card
        free
        style={{ ...style, opacity }}
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
    </div>
  );
};

export default DragableCard;
