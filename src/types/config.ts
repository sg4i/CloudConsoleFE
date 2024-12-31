export type CloudProvider = 'tencent' | 'alibaba' | 'aws';

export interface ProviderConfig {
  name: CloudProvider;
  defaultDestination: string;
  defaultLoginUrl: string;
}

export interface CloudConfig {
  provider: CloudProvider;
  secretId: string;
  secretKey: string;
  token?: string;
  roleArn?: string;
  destination?: string;
  loginUrl?: string;
}

export const PROVIDER_CONFIGS: Record<CloudProvider, ProviderConfig> = {
  tencent: {
    name: 'tencent',
    defaultDestination: 'https://console.cloud.tencent.com',
    defaultLoginUrl: '',
  },
  alibaba: {
    name: 'alibaba',
    defaultDestination: 'https://home.console.aliyun.com',
    defaultLoginUrl: 'https://account.aliyun.com/login',
  },
  aws: {
    name: 'aws',
    defaultDestination: 'https://console.aws.amazon.com',
    defaultLoginUrl: 'https://signin.aws.amazon.com',
  },
};
