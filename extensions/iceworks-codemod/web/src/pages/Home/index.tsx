import React from 'react';
import { LocaleProvider } from '@/i18n';
import CodeMods from './components/CodeMods';
import styles from './index.module.scss';

const Home = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1>
          CodeMod
        </h1>
        <p>
          CodeMod(Code Modify) is a tool to assist you with large-scale codebase refactors that can be partially automated but still require human oversight and occasional intervention.
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
