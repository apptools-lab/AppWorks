import React from 'react';
import { Checkbox } from '@alifd/next';
import { useIntl, FormattedMessage } from 'react-intl';
import HeaderTitle from '@/components/HeaderTitle';
import styles from './index.module.scss';

const LayoutConfig = ({ value, onChange }) => {
  const intl = useIntl();

  const onLayoutConfigChange = (layoutConfigs) => {
    onChange({ layouts: layoutConfigs });
  };
  return (
    <div className={styles.container}>
      <HeaderTitle title={intl.formatMessage({ id: 'web.iceworksProjectCreator.customScaffold.layoutComponent.title' })} />
      <div className={styles.content}>
        <Checkbox.Group value={value} itemDirection="ver" onChange={onLayoutConfigChange}>
          <Checkbox value="branding">
            <FormattedMessage id="web.iceworksProjectCreator.customScaffold.layoutComponent.logoComponent" />
          </Checkbox>
          <Checkbox value="headerAvatar">
            <FormattedMessage id="web.iceworksProjectCreator.customScaffold.layoutComponent.headerAvatarComponent" />
          </Checkbox>
          <Checkbox value="footer">
            <FormattedMessage id="web.iceworksProjectCreator.customScaffold.layoutComponent.footerComponent" />
          </Checkbox>
        </Checkbox.Group>
      </div>
    </div>
  )
}

export default LayoutConfig;

