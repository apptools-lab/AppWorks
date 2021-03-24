import React from 'react';
import { LocaleProvider } from '@/i18n';
import CodeMods from './components/CodeMods';
import styles from './index.module.scss';

const Home = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1>
          Code Modify
        </h1>
        <p>
          A collection of codemod scripts that help update APIs.
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
