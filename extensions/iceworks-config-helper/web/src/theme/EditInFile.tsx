import React from 'react';
import { useIntl } from 'react-intl';
import callService from '../callService';
import { configHelperProvider } from '../pages/JSONForm/index';

const EditInFile = ({ name }) => {
  const { editingJSONFile } = React.useContext(configHelperProvider);
  const intl = useIntl();
  const { defaultSchema } = React.useContext(configHelperProvider);
  const sendDefaultValue = () => {
    const editInJsonArgs = {};
    editInJsonArgs[name] = defaultSchema[name];
    callService('config', 'editInJsonFile', editInJsonArgs);
  };
  return (
    <a onClick={sendDefaultValue}>
      {intl.formatMessage({ id: 'web.iceworksConfigHelper.editInJsonFile.editInJsonLink' }, { editingJSONFile })}
    </a>
  );
};
export default EditInFile;
