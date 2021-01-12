import React, { useEffect, useState } from 'react';
import callService from '@/callService';
import styles from './index.module.scss';

export default () => {
  const [basicInfo, setBasicInfo] = useState({ name: '', description: '', type: '', framework: '', path: '' });
  const { name, description, type, framework, path } = basicInfo;
  const [gitInfo, setGitInfo] = useState({ repository: '', branch: '', isGit: false });
  const { repository, branch, isGit } = gitInfo;
  const [defInfo, setDefInfo] = useState({ idpUrl: '', defUrl: '', isDef: false });
  const { defUrl, idpUrl, isDef } = defInfo;

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
    getProjectBaseInfo();
    getProjectGitInfo();
    getProjectDefInfo();
  }, []);

  return (
    <div className={styles.container}>
      <h2>
        基础信息
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
            <h3>项目信息</h3>
            <ul>
              <li>
                <strong>类型</strong>
                <span>{type}</span>
              </li>
              <li>
                <strong>框架</strong>
                <span>{framework}</span>
              </li>
              <li>
                <strong>本地路径</strong>
                <a href={path}>{path}</a>
              </li>
            </ul>
          </div>
          {isGit &&
          <div className={styles.info}>
            <h3>Git 信息</h3>
            <ul>
              <li>
                <strong>仓库路径</strong>
                <a href={repository}>{repository}</a>
              </li>
              <li>
                <strong>当前分支</strong>
                <span>{branch}</span>
              </li>
            </ul>
          </div>}
          {isDef &&
          <div className={styles.info}>
            <h3>DEF 信息</h3>
            <ul>
              <li>
                <strong>工程平台</strong>
                <a href={defUrl}>{defUrl}</a>
              </li>
              <li>
                <strong>研发数据</strong>
                <a href={idpUrl}>{idpUrl}</a>
              </li>
            </ul>
          </div>}
        </div>
      </div>
    </div>
  );
};
