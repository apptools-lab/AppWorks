import React from 'react';
import { useIntl } from 'react-intl';
import Exception from '../Exception';

export default function ServerError() {
  const intl = useIntl();
  return (
    <Exception
      statusCode="500"
      image="https://img.alicdn.com/tfs/TB1RRSUoET1gK0jSZFrXXcNCXXa-200-200.png"
      description={intl.formatMessage({ id: 'web.codemod.forbidden' })}
    />
  );

}
