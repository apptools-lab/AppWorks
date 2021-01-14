import React, { useEffect, useState } from 'react';
import { Grid, Icon } from '@alifd/next';
import { FormattedMessage, useIntl } from 'react-intl';
import callService from '@/callService';
import styles from './index.module.scss';

const { Row, Col } = Grid;

function Item({ name, version, outdated }) {
  const intl = useIntl();
  function handleUpgrade() {
    callService('common', 'executeCommand', 'iceworksApp.nodeDependencies.upgrade', { command: { arguments: ['', name] } });
  }
  return (
    <li>
      <strong>
        {name}
      </strong>
      :&nbsp;
      <span>
        {version}
      </span>
      { outdated && <Icon title={intl.formatMessage({ id: 'web.iceworksApp.Dashboard.framwork.list.core.upgrade' }, { outdated })} type="warning" style={{ color: '#FFA003', marginLeft: '6px' }} onClick={handleUpgrade} />}
    </li>
  );
}

function List({ title, data }) {
  return (
    <Col span="8">
      <h3 className={styles.title}>
        <FormattedMessage id={title} />
      </h3>
      <ul>
        {data.map((dep) => <Item key={dep.name} {...dep} />)}
      </ul>
    </Col>
  );
}

function Cores() {
  const [dependencies, setDependencies] = useState([]);
  async function getDependencies() {
    setDependencies(await callService('project', 'getCoreDependencies'));
  }
  useEffect(() => {
    getDependencies();
  }, []);
  return (<List
    title="web.iceworksApp.Dashboard.framwork.list.core.title"
    data={dependencies}
  />);
}

function Components() {
  const [dependencies, setDependencies] = useState([]);
  async function getDependencies() {
    setDependencies(await callService('project', 'getComponentDependencies'));
  }
  useEffect(() => {
    getDependencies();
  }, []);
  return (<List
    title="web.iceworksApp.Dashboard.framwork.list.component.title"
    data={dependencies}
  />);
}

function Plugins() {
  const [dependencies, setDependencies] = useState([]);
  async function getDependencies() {
    setDependencies(await callService('project', 'getPluginDependencies'));
  }
  useEffect(() => {
    getDependencies();
  }, []);
  return (<List
    title="web.iceworksApp.Dashboard.framwork.list.plugin.title"
    data={dependencies}
  />);
}

export default () => {
  function refresh() {
  }

  return (
    <div className={styles.container}>
      <h2>
        <FormattedMessage id="web.iceworksApp.Dashboard.framwork.title" />
        <Icon type="refresh" onClick={refresh} className={styles.refresh} size="small" />
      </h2>
      <div className={styles.main}>
        <Row>
          <Cores />
          <Components />
          <Plugins />
        </Row>
      </div>
    </div>
  );
};
