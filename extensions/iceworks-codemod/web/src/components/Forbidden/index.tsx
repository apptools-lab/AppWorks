import React from 'react';
import Exception from '../Exception';

export default function Forbidden() {
  return (
    <Exception
      statusCode="403"
      image="https://img.alicdn.com/tfs/TB11TaSopY7gK0jSZKzXXaikpXa-200-200.png"
      description="执行失败，请联系插件维护者反馈问题"
    />
  );
}
