import React, { useState, useEffect } from 'react';
import { Select } from '@alifd/next';

const { Option } = Select;

interface IProps {
  url: string;
  setUrl: any;
}

export default function (props: IProps) {
  let pageSelect = null;

  const { startQRCodeInfo } = window.__PREVIEW__DATA__;

  if (startQRCodeInfo && startQRCodeInfo.web && startQRCodeInfo.web.length > 1) {
    const { url, setUrl } = props;
    const [pageUrl, setPageUrl] = useState('');

    useEffect(() => {
      const newUrl = startQRCodeInfo.web.find(u => url.indexOf(u) === 0);
      if (newUrl) {
        setPageUrl(newUrl);
      } else {
        setPageUrl('');
      }
    }, [url]);

    const onChange = (value) => {
      setUrl(value);
      setPageUrl(value);
    };

    pageSelect = (
      <Select
        value={pageUrl}
        onChange={onChange}
        size="medium"
        hasBorder={false}
        label="page:"
        valueRender={(item: any) => <p style={{ color: '#01C1B2' }}>{item.label}</p>}
      >
        {startQRCodeInfo.web.map((webUrl: string) => {
          return <Option key={webUrl} value={webUrl}>{webUrl.substring(webUrl.lastIndexOf('/') + 1).replace('.html', '')}</Option>;
        })}
      </Select>
    );
  }
  return pageSelect;
}
