import React from 'react';
import { useIntl } from 'react-intl';
import Exception from '../Exception';

export default function Forbidden() {
  const intl = useIntl();

  return (
    <Exception
      statusCode="403"
      image="https://img.alicdn.com/tfs/TB11TaSopY7gK0jSZKzXXaikpXa-200-200.png"
      description={intl.formatMessage({ id: 'web.codemod.forbidden' })}
    />
  );
}
