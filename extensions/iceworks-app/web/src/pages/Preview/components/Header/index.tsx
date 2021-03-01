import React, { useContext, useEffect, useState } from 'react';
import { Balloon, Icon, Input } from '@alifd/next';
import classNames from 'classnames';
import PageSelect from './PageSelect';
import QRCodeWrap from '../QRCodeWrap/';
import { UrlHistory } from './url-history';
import { Context } from '../../context';
import { BLANK_URL } from '../../config';

import styles from './index.module.scss';
import './icon.css';

// PC: https://www.tmall.com/
// H5: https://www.tmall.com/?wh_ttid=@phone
const PHONE_NODE_QUERY = 'wh_ttid=@phone';


const history = new UrlHistory();

export default function () {
  const { url, setUrl, previewerRef } = useContext(Context);

  const [inputUrl, setInputUrl] = useState(url);

  useEffect(() => {
    history.push(url);
  }, []);

  const setNewUrl = (newUrl: string, fromHistory = false) => {
    let target = newUrl;
    if (target !== BLANK_URL && !/https?:\/\//.test(newUrl)) {
      target = `https://${newUrl}`;
    }
    setUrl(target);
    setInputUrl(target);
    if (!fromHistory) {
      history.push(target);
    }
  };

  const handleEnter = (e) => {
    setNewUrl(e.target.value);
  };

  const handlePhoneIconClick = () => {
    let newUrl = '';
    if (new RegExp(PHONE_NODE_QUERY).test(url)) {
      newUrl = url.replace(PHONE_NODE_QUERY, '').replace(/[?|&]$/, '');
    } else {
      newUrl = `${url}${url.indexOf('?') === -1 ? '?' : '&'}${PHONE_NODE_QUERY}`;
    }
    setNewUrl(newUrl);
  };

  const getCacheUrl = (delta: number) => {
    if (history.canGo(delta)) {
      setNewUrl(history.go(delta), true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon} onClick={handlePhoneIconClick}>
        <i className={classNames(styles.headerIcon, styles.iconPhone)} />
      </div>
      <div className={classNames(styles.icon, { [styles.iconDisabled]: !history.canGo(-1) })} onClick={() => { getCacheUrl(-1); }}>
        <i className={classNames(styles.headerIcon, styles.iconLeft)} />
      </div>
      <div className={classNames(styles.icon, { [styles.iconDisabled]: !history.canGo(1) })} onClick={() => { getCacheUrl(1); }}>
        <i className={classNames(styles.headerIcon, styles.iconRight)} />
      </div>
      <Balloon
        trigger={(
          <div className={styles.icon} >
            <i className={classNames(styles.headerIcon, styles.iconQRCode)} />
          </div>
        )}
        triggerType="click"
        align="b"
        closable={false}
      >
        <div className={styles.QRCode}>
          <QRCodeWrap url={url} />
        </div>
      </Balloon>
      <div className={styles.icon} onClick={() => { previewerRef?.current.refresh(); }}>
        <Icon type="refresh" size="xs" />
      </div>
      <Input
        addonBefore={<PageSelect onChange={setNewUrl} />}
        value={inputUrl}
        size="medium"
        hasBorder={false}
        onChange={(value) => { setInputUrl(value); }}
        onPressEnter={handleEnter}
      />
    </div>
  );
}
