import React, { useState, useCallback } from 'react';
import { CloudConfigForm } from './components/CloudConfigForm';
import { CloudConfig } from './types/config';
import { generateRoleLoginURL } from './services/api';

const App: React.FC = () => {
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!generatedUrl) return;

    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(generatedUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.value = generatedUrl;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (e) {
          console.error('复制失败:', e);
        }
        document.body.removeChild(textArea);
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, [generatedUrl]);

  const handleSubmit = async (config: CloudConfig): Promise<string> => {
    const url = await generateRoleLoginURL(config);
    setGeneratedUrl(url);
    return url;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Header */}
      <header className="bg-[#1a2332] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">CloudConsole</h1>
            <nav className="space-x-6 flex items-center">
              <a href="#features" className="text-gray-300 hover:text-white">
                功能
              </a>
              <a href="#about" className="text-gray-300 hover:text-white">
                关于
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
                title="访问我们的 GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Centered */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">云控制台助手</h1>
          <p className="text-xl text-gray-400">一键登录各大云服务商控制台</p>
          <p className="text-base text-gray-500 mt-2">输入云账号凭据，快速获取临时访问链接</p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-1/2 lg:min-h-[600px] bg-[#1a2332] rounded-lg p-6">
            <CloudConfigForm onSubmit={handleSubmit} />
          </div>

          {/* Right Column - Result Section */}
          <div className="lg:w-1/2 lg:min-h-[600px]">
            <div className="h-full p-6 bg-[#1a2332] rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  {generatedUrl ? '控制台访问链接已生成' : '控制台访问链接'}
                </h3>
              </div>

              <div className="bg-[#2a3447] p-6 rounded-md min-h-[120px] flex items-center justify-center mb-6">
                {generatedUrl ? (
                  <p className="font-mono break-all">{generatedUrl}</p>
                ) : (
                  <div className="text-gray-500 text-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <p>完成配置后，这里将显示您的控制台访问链接</p>
                    <p className="text-sm mt-2">链接有效期为1小时</p>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={handleCopy}
                    disabled={!generatedUrl}
                    className={`flex-1 px-4 py-3 rounded transition-colors flex items-center justify-center relative
                      ${
                        generatedUrl
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-[#2a3447] text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {copySuccess ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        已复制
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        复制链接
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (generatedUrl) {
                        window.open(generatedUrl, '_blank');
                      }
                    }}
                    disabled={!generatedUrl}
                    className={`flex-1 px-4 py-3 rounded transition-colors flex items-center justify-center
                      ${
                        generatedUrl
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-[#2a3447] text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    立即访问
                  </button>
                </div>

                {/* Additional Info */}
                <div className="text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>链接生成后会自动更新此区域</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
