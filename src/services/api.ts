import axios from 'axios';
import { CloudConfig } from '../types/config';

// 根据环境选择baseURL
const getBaseURL = () => {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? '' // 生产环境使用相对路径
      : process.env.REACT_APP_API_URL || 'http://localhost:8080'; // 开发环境使用完整URL
  return `${baseUrl}/api`; // 统一添加/api路径
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

export const generateRoleLoginURL = async (config: CloudConfig): Promise<string> => {
  try {
    const response = await api.post('/v1/role_login', {
      provider: config.provider,
      secret_id: config.secretId,
      secret_key: config.secretKey,
      token: config.token,
      role_arn: config.roleArn,
      desiontion: config.destination,
      login_url: config.loginUrl,
    });
    return response.data.url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '生成URL失败');
    }
    throw error;
  }
};
