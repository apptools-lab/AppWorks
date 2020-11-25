import React from 'react';
import { Link } from 'ice';
import styles from './index.module.scss';

export interface ILogoProps {
  image?: string;
  text?: string;
  url?: string;
}

export default function Logo({ image, text, url }: ILogoProps) {
  return (
    <div className="logo">
      <Link to={url || '/'} className={styles.logo}>
        { image && <img src={image} alt="logo" />}
        <span>{text}</span>
      </Link>
    </div>
  );
}
