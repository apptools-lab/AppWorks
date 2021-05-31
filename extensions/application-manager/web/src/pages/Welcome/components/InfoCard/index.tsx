import React from 'react';
import styles from './index.module.scss';

interface IInfoCardProps {
  image?: string;
  title: string;
  description: string;
  link?: string;
  linkName?: string;
}

const InfoCard: React.SFC<IInfoCardProps> = ({ title, description, link, linkName, image }) => {
  return (
    <div className={styles.infoCard}>
      <div className={styles.img}>
        <img src={image} alt="cardImage" />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.desc}>{description}</div>
        {linkName && (
          <a className={styles.link} href={link} target="_blank">
            {linkName}
          </a>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
