import React, { useContext, useState, useEffect } from 'react';
import { Select } from '@alifd/next';
import { Context } from '../../context';

const { Option } = Select;

interface IProps {
  onChange: any;
}

export default function (props: IProps) {
  const { startQRCodeInfo } = window.__PREVIEW__DATA__;

  const { url } = useContext(Context);
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    const newUrl = startQRCodeInfo?.web?.find(u => url.indexOf(u) === 0);
    if (newUrl) {
      setPageUrl(newUrl);
    } else {
      setPageUrl('');
    }
  }, [url]);

  return startQRCodeInfo?.web?.length > 1 ? (
    <Select
      value={pageUrl}
      onChange={(val) => { props.onChange(val); }}
      size="medium"
      hasBorder={false}
      label="page:"
      valueRender={(item: any) => <p style={{ color: '#01C1B2' }}>{item.label}</p>}
    >
      {startQRCodeInfo.web.map((webUrl: string) => {
        return <Option key={webUrl} value={webUrl}>{webUrl.substring(webUrl.lastIndexOf('/')).replace(/\/([^.]+)(\.html)?/, '$1')}</Option>;
      })}
    </Select>
  ) : null;
}
