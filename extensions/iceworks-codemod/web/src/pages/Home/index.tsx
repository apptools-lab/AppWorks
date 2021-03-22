import React from 'react';
import { LocaleProvider } from '@/i18n';
import CodeMods from './components/CodeMods';

const Dashboard = () => {
  return (
    <div>
      <div>
        <h1>
          Code Modify
        </h1>
        <p>
          A collection of codemod scripts that help update APIs.
        </p>
      </div>
      <CodeMods />
    </div>
  );
};

const IntlCreateProject = () => {
  return (
    <LocaleProvider>
      <Dashboard />
    </LocaleProvider>
  );
};

export default IntlCreateProject;
