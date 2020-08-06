import React from 'react';
import { useIntl } from 'react-intl';
import callService from '../callService';
import { configHelperProvider } from '../pages/JSONForm/index';

const EditInFile = ({ name }) => {
  const { jsonFileName } = React.useContext(configHelperProvider);
  const intl = useIntl();
  const { defaultSchema } = React.useContext(configHelperProvider);
  const sendDefaultValue = () => {
    const editInJsonArgs = {};
    editInJsonArgs[name] = defaultSchema[name];
    callService('configService', 'editInJson', editInJsonArgs);
  };
  return (
    <a onClick={sendDefaultValue}>
      {intl.formatMessage({ id: 'web.iceworksConfigHelper.editInJson.editInJsonLink' }, { jsonFileName })}
    </a>
  );
};
export default EditInFile;
