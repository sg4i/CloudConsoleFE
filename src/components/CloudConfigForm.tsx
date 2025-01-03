import React, { useState, useEffect } from 'react';
import { CloudConfig, CloudProvider, PROVIDER_CONFIGS } from '../types/config';

interface Props {
  onSubmit: (config: CloudConfig) => Promise<string>;
}

export const CloudConfigForm: React.FC<Props> = ({ onSubmit }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<CloudConfig>({
    provider: 'tencent',
    secretId: '',
    secretKey: '',
    token: '',
    roleArn: '',
    destination: PROVIDER_CONFIGS['tencent'].defaultDestination,
    loginUrl: PROVIDER_CONFIGS['tencent'].defaultLoginUrl,
  });

  // 自动生成 URL 的函数
  const generateUrl = async (newConfig: CloudConfig) => {
    // 验证必填字段
    if (!newConfig.secretId || !newConfig.secretKey) {
      setError('SecretId 和 SecretKey 为必填项');
      return;
    }

    // 验证 Token 和 RoleArn 至少填写一个
    if (!newConfig.token && !newConfig.roleArn) {
      setError('Token 和 RoleArn 必须填写一个');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(newConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成 URL 失败');
    } finally {
      setLoading(false);
    }
  };

  // 监听配置变化
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (config.secretId && config.secretKey && (config.token || config.roleArn)) {
        generateUrl(config);
      }
    }, 500); // 500ms 防抖

    return () => clearTimeout(debounceTimer);
  }, [config]);

  const handleChange =
    (field: keyof CloudConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      if (field === 'provider') {
        const provider = value as CloudProvider;
        const newConfig = {
          ...config,
          provider,
          destination: PROVIDER_CONFIGS[provider].defaultDestination,
          loginUrl: PROVIDER_CONFIGS[provider].defaultLoginUrl,
        };
        setConfig(newConfig);
      } else {
        const newConfig = { ...config, [field]: value };
        setConfig(newConfig);
      }
    };

  // 切换高级选项时重置为默认值
  const handleAdvancedToggle = () => {
    if (!showAdvanced) {
      // 展开高级选项时，确保使用当前服务商的默认值
      setConfig((prev) => ({
        ...prev,
        destination: PROVIDER_CONFIGS[prev.provider].defaultDestination,
        loginUrl: PROVIDER_CONFIGS[prev.provider].defaultLoginUrl,
      }));
    }
    setShowAdvanced(!showAdvanced);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-4">快速配置</h2>
      <p className="text-gray-400 mb-6">请选择云服务商并填写相关凭据信息</p>

      <div className="space-y-6 flex-grow">
        {/* Provider Selection */}
        <div>
          <label className="block text-gray-300 mb-2">云服务商</label>
          <div className="relative">
            <select
              value={config.provider}
              onChange={handleChange('provider')}
              className="w-full bg-[#2a3447] text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="tencent">腾讯云</option>
              <option value="alibaba">阿里云</option>
              <option value="aws">AWS</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Secret ID */}
        <div>
          <label className="block text-gray-300 mb-2">SecretId</label>
          <input
            type="text"
            value={config.secretId}
            onChange={handleChange('secretId')}
            className="w-full bg-[#2a3447] text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入 SecretId"
          />
        </div>

        {/* Secret Key */}
        <div>
          <label className="block text-gray-300 mb-2">SecretKey</label>
          <input
            type="password"
            value={config.secretKey}
            onChange={handleChange('secretKey')}
            className="w-full bg-[#2a3447] text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入 SecretKey"
          />
        </div>

        {/* Token */}
        <div>
          <label className="block text-gray-300 mb-2">Token（与 RoleArn 二选一）</label>
          <input
            type="text"
            value={config.token}
            onChange={handleChange('token')}
            className="w-full bg-[#2a3447] text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入 Token"
          />
        </div>

        {/* Role ARN */}
        <div>
          <label className="block text-gray-300 mb-2">RoleArn（与 Token 二选一）</label>
          <input
            type="text"
            value={config.roleArn}
            onChange={handleChange('roleArn')}
            className="w-full bg-[#2a3447] text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入 RoleArn"
          />
        </div>

        {/* Advanced Options */}
        <div className="mt-auto">
          <button
            type="button"
            onClick={handleAdvancedToggle}
            className="flex items-center text-gray-400 hover:text-white"
          >
            <svg
              className={`w-4 h-4 mr-2 transform transition-transform ${
                showAdvanced ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            高级选项
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">目标地址</label>
                <input
                  type="text"
                  value={config.destination}
                  onChange={handleChange('destination')}
                  className="w-full bg-[#2a3447] text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={PROVIDER_CONFIGS[config.provider].defaultDestination}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">登录 URL</label>
                <input
                  type="text"
                  value={config.loginUrl}
                  onChange={handleChange('loginUrl')}
                  className="w-full bg-[#2a3447] text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={PROVIDER_CONFIGS[config.provider].defaultLoginUrl}
                />
              </div>
            </div>
          )}
        </div>

        {error && <div className="text-red-500 bg-red-100/10 p-4 rounded-md">{error}</div>}

        {loading && (
          <div className="text-blue-400 bg-blue-100/10 p-4 rounded-md flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            正在生成访问链接...
          </div>
        )}
      </div>
    </div>
  );
};
