'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Sparkles, Home, Check } from 'lucide-react';
import {
  budgetOptions,
  themes,
  sceneOptions,
  regionOptions,
  tabooOptions,
} from '@/lib/mock-data';

export default function BlindBoxPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Budget
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [customBudget, setCustomBudget] = useState('');

  // Step 2: Theme
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  // Step 3: Scene
  const [selectedScenes, setSelectedScenes] = useState<string[]>([]);
  const [sceneSearch, setSceneSearch] = useState('');

  // Step 4: Region
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [visitedPlaces, setVisitedPlaces] = useState('');

  // Step 5: Taboos
  const [selectedTaboos, setSelectedTaboos] = useState<string[]>([]);
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  const steps = ['预算', '主题', '场景', '区域', '禁忌'];

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedBudget || customBudget;
      case 1:
        return selectedThemes.length > 0;
      case 2:
        return selectedScenes.length > 0;
      case 3:
        return selectedRegion;
      case 4:
        return selectedTaboos.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartBlindBox = () => {
    router.push('/blindbox/result');
  };

  const filteredScenes = sceneOptions.filter((scene) =>
    scene.name.toLowerCase().includes(sceneSearch.toLowerCase())
  );

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const toggleScene = (scene: string) => {
    setSelectedScenes((prev) =>
      prev.includes(scene) ? prev.filter((s) => s !== scene) : [...prev, scene]
    );
  };

  const toggleTaboo = (taboo: string) => {
    setSelectedTaboos((prev) =>
      prev.includes(taboo) ? prev.filter((t) => t !== taboo) : [...prev, taboo]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* Header with Home Link */}
      <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <Home size={20} />
          <span className="text-sm">返回首页</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                  index < currentStep
                    ? 'bg-blue-500 text-white'
                    : index === currentStep
                      ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStep ? (
                  <Check size={20} />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="ml-2">
                <p
                  className={`text-sm font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition ${
                    index < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
          {/* Step 1: Budget */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="text-blue-500" size={28} />
                你这次旅行的预算是？
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {budgetOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedBudget(option.value);
                      setCustomBudget('');
                    }}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedBudget === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  或输入自定义预算
                </label>
                <input
                  type="text"
                  value={customBudget}
                  onChange={(e) => {
                    setCustomBudget(e.target.value);
                    if (e.target.value) setSelectedBudget(null);
                  }}
                  placeholder="例如：5000-10000元"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Theme */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                你喜欢什么主题的旅行？
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => toggleTheme(theme.id)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      selectedThemes.includes(theme.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{theme.emoji}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {theme.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Scene */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                你心仪的旅行场景是？
              </h2>

              <input
                type="text"
                value={sceneSearch}
                onChange={(e) => setSceneSearch(e.target.value)}
                placeholder="搜索场景..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              />

              <div className="flex flex-wrap gap-3">
                {filteredScenes.map((scene) => (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => toggleScene(scene.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition font-medium ${
                      selectedScenes.includes(scene.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <span aria-hidden>{scene.emoji}</span>
                    {scene.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Region */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                你偏好哪个区域？
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {regionOptions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      selectedRegion === region.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{region.emoji}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {region.name}
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  近期去过的地方
                </label>
                <input
                  type="text"
                  value={visitedPlaces}
                  onChange={(e) => setVisitedPlaces(e.target.value)}
                  placeholder="例如：北京、上海、杭州"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 5: Taboos */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                有什么是你不想要的？
              </h2>

              <div className="flex flex-wrap gap-3 mb-6">
                {tabooOptions.map((taboo) => (
                  <button
                    key={taboo.id}
                    type="button"
                    onClick={() => toggleTaboo(taboo.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition font-medium ${
                      selectedTaboos.includes(taboo.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <span aria-hidden>{taboo.emoji}</span>
                    {taboo.name}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  其他要求
                </label>
                <textarea
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="告诉我们更多关于你的偏好..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              <ChevronLeft size={20} />
              返回
            </button>
          )}

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleStartBlindBox}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg transition font-semibold ml-auto ${
                canProceed()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Sparkles size={20} />
              开启盲盒
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg transition font-semibold ml-auto ${
                canProceed()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              下一步
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
