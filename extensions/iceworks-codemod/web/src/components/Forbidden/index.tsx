import React from 'react';
import Exception from '../Exception';

export default function Forbidden() {
  return (
    <Exception
      statusCode="403"
      image="https://img.alicdn.com/tfs/TB11TaSopY7gK0jSZKzXXaikpXa-200-200.png"
      description="服务器好像挂了你要等会了"
    />
  );
}
