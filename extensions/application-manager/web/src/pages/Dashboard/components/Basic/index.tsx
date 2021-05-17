import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Loading } from '@alifd/next';
import callService from '@/callService';
import pageStore from '@/pages/Dashboard/store';
import ServerError from '../ServerError';
import styles from './index.module.scss';

export default () => {
  const [state, dispatchers] = pageStore.useModel('info');
  const effectsState = pageStore.useModelEffectsState('info');
  const { basic, git, def, inited } = state;
  const { name, type, framework, path, feedbackLink } = basic;
  const { remoteUrl, branch, isGit } = git;
  const { defUrl, idpUrl, isDef } = def;

  function handleOpenLocalPath() {
    callService('common', 'openInExternalFinder', path);
  }

  useEffect(() => {
    dispatchers.refresh();
  }, []);

  return (
    <Loading className={styles.container} visible={effectsState.refresh.isLoading || !inited}>
      <h2>
        <FormattedMessage id="web.applicationManager.Dashboard.basic.title" />
        {feedbackLink &&
        <a href={feedbackLink} target="_blank" className={styles.goto}>
          <FormattedMessage id="web.applicationManager.Dashboard.basic.feedback" /> &gt;
        </a>}
      </h2>
      {!effectsState.refresh.error ?
        <div className={styles.main}>
          <div className={styles.header}>
            <h3>{name}</h3>
            {/* <div className={styles.description}>
              {description}
            </div> */}
          </div>
          <div className={styles.infos}>
            <div className={styles.info}>
              <h3><FormattedMessage id="web.applicationManager.Dashboard.basic.list.project.title" /></h3>
              <ul>
                <li>
                  <strong><FormattedMessage id="web.applicationManager.Dashboard.basic.list.project.type" /></strong>
                  <span>{type}</span>
                </li>
                <li>
                  <strong><FormattedMessage id="web.applicationManager.Dashboard.basic.list.project.framework" /></strong>
                  <span>{framework}</span>
                </li>
                <li>
                  <strong><FormattedMessage id="web.applicationManager.Dashboard.basic.list.project.path" /></strong>
                  <span className={styles.projectPath} onClick={handleOpenLocalPath}>{path}</span>
                </li>
              </ul>
            </div>
            {isGit &&
            <div className={styles.info}>
              <h3><FormattedMessage id="web.applicationManager.Dashboard.basic.list.git.title" /></h3>
              <ul>
                <li>
                  <strong><FormattedMessage id="web.applicationManager.Dashboard.basic.list.git.remoteUrl" /></strong>
                  <a href={remoteUrl}>{remoteUrl}</a>
                </li>
                <li>
                  <strong><FormattedMessage id="web.applicationManager.Dashboard.basic.list.git.branch" /></strong>
                  <span>{branch}</span>
                </li>
              </ul>
            </div>}
            {isDef &&
            <div className={styles.info}>
              <h3><FormattedMessage id="web.applicationManager.Dashboard.basic.list.def.title" /></h3>
              <ul>
                <li>
                  <strong><FormattedMessage id="web.applicationManager.Dashboard.basic.list.def.defUrl" /></strong>
                  <a href={defUrl}>{defUrl}</a>
                </li>
                <li>
                  <strong><FormattedMessage id="web.applicationManager.Dashboard.basic.list.def.idpUrl" /></strong>
                  <a href={idpUrl}>{idpUrl}</a>
                </li>
              </ul>
            </div>}
          </div>
        </div> :
        <ServerError />
      }
    </Loading>
  );
};
