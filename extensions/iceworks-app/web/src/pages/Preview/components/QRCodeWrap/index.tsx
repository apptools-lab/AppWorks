import React from 'react';
import QRCode from 'qrcode.react';
import styles from './index.module.scss';

interface IProps {
  url: string
}

export default function (props: IProps) {
  const { url } = props;
  const { startUrl, startQRCodeInfo } = window.__PREVIEW__DATA__;

  return (
    <div className={styles.container}>
      {startUrl === url && startQRCodeInfo ? (
        Object.keys(startQRCodeInfo).map((title) => {
          return (
            <div className={styles.wrap}>
              <h3>{title}：</h3>
              <QRCode value={startQRCodeInfo[title]} />
            </div>
          );
        })
      ) : <QRCode value={url} />}
    </div>
  );
}
