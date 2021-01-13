import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import callService from '@/callService';
import styles from './index.module.scss';

export default () => {
  const [basicInfo, setBasicInfo] = useState({ name: '', description: '', type: '', framework: '', path: '' });
  const { name, description, type, framework, path } = basicInfo;
  const [gitInfo, setGitInfo] = useState({ repository: '', branch: '', isGit: false });
  const { repository, branch, isGit } = gitInfo;
  const [defInfo, setDefInfo] = useState({ idpUrl: '', defUrl: '', isDef: false });
  const { defUrl, idpUrl, isDef } = defInfo;
  const [feedbackLink, setFeedbackLink] = useState('');

  useEffect(() => {
    async function getProjectBaseInfo() {
      try {
        setBasicInfo(await callService('project', 'getProjectBaseInfo'));
      } catch (e) { /* ignore */ }
    }
    async function getProjectGitInfo() {
      try {
        setGitInfo(await callService('project', 'getProjectGitInfo'));
      } catch (e) { /* ignore */ }
    }
    async function getProjectDefInfo() {
      try {
        setDefInfo(await callService('project', 'getProjectDefInfo'));
      } catch (e) { /* ignore */ }
    }
    async function getFeedbackLink() {
      try {
        setFeedbackLink(await callService('project', 'getFeedbackLink'));
      } catch (e) { /* ignore */ }
    }
    getProjectBaseInfo();
    getProjectGitInfo();
    getProjectDefInfo();
    getFeedbackLink();
  }, []);

  return (
    <div className={styles.container}>
      <h2>
        <FormattedMessage id="web.iceworksApp.Dashboard.basic.title" />
        {feedbackLink &&
        <a href={feedbackLink} target="_blank" className={styles.goto}>
          <FormattedMessage id="web.iceworksApp.Dashboard.basic.feedback" /> &gt;
        </a>}
      </h2>
      <div className={styles.main}>
        <div className={styles.header}>
          <h3>{name}</h3>
          <div className={styles.description}>
            {description}
          </div>
        </div>
        <div className={styles.infos}>
          <div className={styles.info}>
            <h3><FormattedMessage id="web.iceworksApp.Dashboard.basic.list.project.title" /></h3>
            <ul>
              <li>
                <strong><FormattedMessage id="web.iceworksApp.Dashboard.basic.list.project.title" /></strong>
                <span>{type}</span>
              </li>
              <li>
                <strong><FormattedMessage id="web.iceworksApp.Dashboard.basic.list.project.title" /></strong>
                <span>{framework}</span>
              </li>
              <li>
                <strong><FormattedMessage id="web.iceworksApp.Dashboard.basic.list.project.title" /></strong>
                <a href={path}>{path}</a>
              </li>
            </ul>
          </div>
          {isGit &&
          <div className={styles.info}>
            <h3><FormattedMessage id="web.iceworksApp.Dashboard.basic.list.git.title" /></h3>
            <ul>
              <li>
                <strong><FormattedMessage id="web.iceworksApp.Dashboard.basic.list.git.repository" /></strong>
                <a href={repository}>{repository}</a>
              </li>
              <li>
                <strong><FormattedMessage id="web.iceworksApp.Dashboard.basic.list.git.branch" /></strong>
                <span>{branch}</span>
              </li>
            </ul>
          </div>}
          {isDef &&
          <div className={styles.info}>
            <h3><FormattedMessage id="web.iceworksApp.Dashboard.basic.list.def.title" /></h3>
            <ul>
              <li>
                <strong><FormattedMessage id="web.iceworksApp.Dashboard.basic.list.def.defUrl" /></strong>
                <a href={defUrl}>{defUrl}</a>
              </li>
              <li>
                <strong><FormattedMessage id="web.iceworksApp.Dashboard.basic.list.def.idpUrl" /></strong>
                <a href={idpUrl}>{idpUrl}</a>
              </li>
            </ul>
          </div>}
        </div>
      </div>
    </div>
  );
};
