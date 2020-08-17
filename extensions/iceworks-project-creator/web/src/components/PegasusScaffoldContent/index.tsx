import React, { useEffect } from 'react';
import callService from '@/callService';

import styles from './index.module.scss';

const PAYLOAD = {
  keywords: { value: ['webbased-rax'] },
  terminal: { value: ['mobile', 'pc'] },
};
const URL = `https://banff.alibaba-inc.com/iframe/component?from=imgcook&fullScreen=true&payload=${encodeURIComponent(
  JSON.stringify(PAYLOAD)
)}`;

const test = {
  'type': 'init',
  'data': {
    'id': 53493,
    'result': {
      'status': 'done',
      'gmtCreate': 1597636540832
    },
    'useGenerator': true,
    'group': 'alimod',
    'project': 'yangfeng-test4'
  }
};

export default () => {

  const testFn = () => {
    console.log('click');
    callService('pegasus', 'init', test);
  }

  useEffect(() => {
    // 监听天马 iframe 事件
    window.addEventListener('message', (event) => {
      if (event.origin && (event.origin.includes('banff') || event.origin.includes('pegasus'))) {
        if (event.data.type === 'init' && event.data.data.id) {
          console.log('创建天马模块完毕...');
          callService('pegasus', 'init', event.data);
        }
      }
    });
  }, []);

  return (
    <div className={styles.container} onClick={testFn}>
      <iframe title="PegasusScaffoldContent" className={styles.content} src={URL} />
    </div>
  );
};
