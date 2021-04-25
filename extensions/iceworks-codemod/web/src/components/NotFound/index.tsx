import React from 'react';
import Exception from '../Exception';

export default function NotFound() {
  return (
    <Exception
      statusCode="404"
      image="https://img.alicdn.com/tfs/TB14c1VoET1gK0jSZFhXXaAtVXa-200-200.png"
      description="没有找到内容"
    />
  );
}
