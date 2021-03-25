import React from 'react';
import Exception from '../Exception';

export default function ServerError() {
  return (
    <Exception
      statusCode="500"
      image="https://img.alicdn.com/tfs/TB1RRSUoET1gK0jSZFrXXcNCXXa-200-200.png"
      description="执行失败，请联系插件维护者反馈问题"
    />
  );

}
