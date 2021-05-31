import React from 'react';
import QRCode from 'qrcode.react';
import styles from './index.module.scss';

interface IProps {
  url: string
}

// Don't show MiniApp urls
const KEY_MAP = {
  web: { title: 'Web' }, // Primary key
  kraken: { title: 'Kraken' },
  weex: { title: 'Weex' },
};

function getCurrentQRCodeInfo(url: string) {
  const currentQRCodeInfo = [];
  const { startQRCodeInfo } = window.__PREVIEW__DATA__;

  if (startQRCodeInfo) {
    const primaryIndex = (startQRCodeInfo.web || []).findIndex(webUrl => url === webUrl);

    // If web dev server url exist render QRCode
    if (primaryIndex > -1) {
      Object.keys(startQRCodeInfo).forEach((infoKey) => {
        if (KEY_MAP[infoKey]) {
          currentQRCodeInfo.push({
            title: KEY_MAP[infoKey].title,
            // Rax project can have different mpa targets, spa only have one preview url
            value: startQRCodeInfo[infoKey][primaryIndex] || startQRCodeInfo[infoKey][0],
          });
        }
      });
    }
  }
  return currentQRCodeInfo;
}

export default function (props: IProps) {
  const { url } = props;
  const currentQRCodeInfo = getCurrentQRCodeInfo(url);

  return (
    <div className={styles.container}>
      { currentQRCodeInfo.length > 0 ? (currentQRCodeInfo.map((QRCodeInfo) => {
        return (
          <div className={styles.wrap} key={QRCodeInfo.title}>
            <h3>{QRCodeInfo.title}：</h3>
            <QRCode value={QRCodeInfo.value} />
          </div>
        );
      })) : <QRCode value={url} />}
    </div>
  );
}
