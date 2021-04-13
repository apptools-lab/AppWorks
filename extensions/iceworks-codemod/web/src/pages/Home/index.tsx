import React from 'react';
import { LocaleProvider } from '@/i18n';
import { useIntl } from 'react-intl';
import CodeMods from './components/CodeMods';
import styles from './index.module.scss';

const Home = () => {
  const intl = useIntl();
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1>
          CodeMod
        </h1>
        <p>
          {intl.formatMessage({ id: 'web.codemod.main.description' })}
        </p>
      </div>
      <div className={styles.codeMods}>
        <CodeMods />
      </div>
    </div>
  );
};

const IntlCreateProject = () => {
  return (
    <LocaleProvider>
      <Home />
    </LocaleProvider>
  );
};

export default IntlCreateProject;
