import axios from 'axios';
import { CloudConfig } from '../types/config';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
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
