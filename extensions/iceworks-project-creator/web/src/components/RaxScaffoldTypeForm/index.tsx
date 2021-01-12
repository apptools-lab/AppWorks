import React, { useState, useEffect } from 'react';
import { Balloon, Radio } from '@alifd/next';
import { useIntl } from 'react-intl';
import MenuCard from '@/components/MenuCard';
import { IProjectField } from '@/types';
import { webAppTypes, crossEndAppTypes } from './config';
import styles from './index.module.scss';

interface IScaffoldTypeForm {
  value: IProjectField;
  disabled: boolean;
  onChange: (value: Record<string, unknown>) => void;
}

const RaxScaffoldTypeForm: React.FC<IScaffoldTypeForm> = ({ value, disabled, onChange }) => {
  const intl = useIntl();

  const [radioValue, setRadioValue] = useState('web');
  const [selectedAppType, setSelectedAppType] = useState(() => {
    if (value.ejsOptions && value.ejsOptions.appType) {
      return value.ejsOptions.appType;
    }
    return webAppTypes[0].type;
  });

  const onRadioChange = (key) => {
    setRadioValue(key as string);
    onChange({ ejsOptions: { ...value.ejsOptions }, pubAppType: key });
  };

  const onAppTypeClick = (appType) => {
    const currentType = appType.type;
    setSelectedAppType(currentType);
    onChange({ ejsOptions: { ...value.ejsOptions, appType: currentType } });
  };

  const AppList = ({ appTypes }) => {
    return (
      <div className={styles.row}>
        {
          appTypes.map(appType => {
            const selected = selectedAppType === appType.type;
            return (
              <Balloon
                align="t"
                key={appType.type}
                trigger={
                  <MenuCard
                    disabled={disabled}
                    selected={selected}
                    title={appType.title}
                    subTitle={appType.subTitle}
                    icon={appType.icon}
                    onClick={() => onAppTypeClick(appType)}
                  />
                }
                closable={false}
                triggerType="hover"
              >
                {appType.description}
              </Balloon>
            );
          })
        }
      </div>
    );
  };
  useEffect(() => {
    // init value
    onChange({ ejsOptions: { appType: selectedAppType }, pubAppType: radioValue });
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {intl.formatMessage({ id: 'web.iceworksProjectCreator.RaxScaffoldTypeForm.targetTitle' })}
      </div>
      <Radio.Group value={radioValue} onChange={onRadioChange} className={styles.radioGroup}>
        <Radio value="web">{intl.formatMessage({ id: 'web.iceworksProjectCreator.RaxScaffoldTypeForm.webAppTitle' })}</Radio>
        <Radio value="crossEnd">{intl.formatMessage({ id: 'web.iceworksProjectCreator.RaxScaffoldTypeForm.crossEndTitle' })}</Radio>
      </Radio.Group>
      <AppList appTypes={radioValue === 'web' ? webAppTypes : crossEndAppTypes} />
    </div>
  );
};

export default RaxScaffoldTypeForm;
