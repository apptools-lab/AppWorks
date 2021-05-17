import React, { useState, useEffect } from 'react';
import { Balloon } from '@alifd/next';
import { useIntl } from 'react-intl';
import MenuCard from '@/components/MenuCard';
import { IProjectField } from '@/types';
import { webAppTypes, crossEndAppTypes, IAppType } from './config';
import styles from './index.module.scss';

interface IScaffoldTypeForm {
  value: IProjectField;
  disabled: boolean;
  onChange: (value: Record<string, unknown>) => void;
}

const RaxScaffoldTypeForm: React.FC<IScaffoldTypeForm> = ({ value, disabled, onChange }) => {
  const intl = useIntl();

  const [pubAppType, setPubAppType] = useState('web');
  const [selectedAppType, setSelectedAppType] = useState(() => {
    if (value.ejsOptions && value.ejsOptions.appType) {
      return value.ejsOptions.appType;
    }
    return webAppTypes[0].type;
  });

  const onAppTypeClick = (appType: IAppType) => {
    const { type, pubType } = appType;
    setSelectedAppType(type);
    setPubAppType(pubType);
    onChange({ ejsOptions: { ...value.ejsOptions, appType: type }, pubAppType: pubType });
  };

  const AppList = ({ appTypes }: { appTypes: IAppType[] }) => {
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
    onChange({ ejsOptions: { appType: selectedAppType }, pubAppType });
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {intl.formatMessage({ id: 'web.iceworksProjectCreator.RaxScaffoldTypeForm.targetTitle' })}
      </div>
      <div className={styles.subTitle}>{intl.formatMessage({ id: 'web.iceworksProjectCreator.RaxScaffoldTypeForm.webAppTitle' })}</div>
      <AppList appTypes={webAppTypes} />
      <div className={styles.subTitle}>{intl.formatMessage({ id: 'web.iceworksProjectCreator.RaxScaffoldTypeForm.crossEndTitle' })}</div>
      <AppList appTypes={crossEndAppTypes} />
    </div>
  );
};

export default RaxScaffoldTypeForm;
