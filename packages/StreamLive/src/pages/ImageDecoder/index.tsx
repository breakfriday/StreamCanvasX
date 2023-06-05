import { definePageConfig } from 'ice';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useRef } from 'react';


const columns: Array<ProColumns<GithubRepoItem>> = [
  {
    title: 'id',
    dataIndex: 'id',
    ellipsis: true,
    width: 80,
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: 'Stars',
    dataIndex: 'star',
    width: 200,
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    width: 200,
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
    ],
  },
];

const ImageDecoder: React.FC = () => {
  return (

    <div>this is the test</div>

  );
};

export default ImageDecoder;


