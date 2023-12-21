import React, { useState } from 'react';
import { definePageConfig, history, useAuth, useAppData } from 'ice';
import { message, Alert } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import styles from './index.module.css';
import type { LoginParams, LoginResult } from '@/interfaces/user';
import { login, fetchUserInfo } from '@/services/user';
import store from '@/store';
import logo from '@/assets/logo.png';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [loginResult, setLoginResult] = useState<LoginResult>({});
  const [, userDispatcher] = store.useModel('user');
  const [, setAuth] = useAuth();


  async function handleSubmit(values: LoginParams) {
    let { username, password } = values;
     history?.push(`/WebRTCChatHub?deviceId=${username}`);
  }
  return (
    <div className={styles.container}>
      <LoginForm
        title="chat meeting"
        subTitle="视频会议"
        onFinish={async (values) => {
          await handleSubmit(values as LoginParams);
        }}
      >
        {loginResult.success === false && (
          <LoginMessage
            content="账户或密码错误"
          />
        )}
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder={'用户名: gaodayuan'}
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'密码: 123'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />

        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div>
      </LoginForm>
    </div>
  );
};

export const pageConfig = definePageConfig(() => {
  return {
    title: '登录',
  };
});

export default Login;
