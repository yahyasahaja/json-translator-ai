'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Globe, Key, FileText, Copy, Check, Sparkles, Zap, Shield, Languages } from 'lucide-react';
import { saveAs } from 'file-saver';

interface Language {
  code: string;
  name: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'cs', name: 'Czech' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'et', name: 'Estonian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'be', name: 'Belarusian' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'sq', name: 'Albanian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'mt', name: 'Maltese' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ga', name: 'Irish' },
  { code: 'cy', name: 'Welsh' },
  { code: 'eu', name: 'Basque' },
  { code: 'ca', name: 'Catalan' },
  { code: 'gl', name: 'Galician' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'fa', name: 'Persian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'or', name: 'Odia' },
  { code: 'as', name: 'Assamese' },
  { code: 'ne', name: 'Nepali' },
  { code: 'si', name: 'Sinhala' },
  { code: 'my', name: 'Burmese' },
  { code: 'km', name: 'Khmer' },
  { code: 'lo', name: 'Lao' },
  { code: 'ka', name: 'Georgian' },
  { code: 'am', name: 'Amharic' },
  { code: 'sw', name: 'Swahili' },
  { code: 'zu', name: 'Zulu' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'tl', name: 'Filipino' },
  { code: 'haw', name: 'Hawaiian' },
  { code: 'mi', name: 'Maori' },
  { code: 'sm', name: 'Samoan' },
  { code: 'to', name: 'Tongan' },
  { code: 'fj', name: 'Fijian' },
  { code: 'ty', name: 'Tahitian' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ig', name: 'Igbo' },
  { code: 'ha', name: 'Hausa' },
  { code: 'so', name: 'Somali' },
  { code: 'om', name: 'Oromo' },
  { code: 'ti', name: 'Tigrinya' },
  { code: 'wo', name: 'Wolof' },
  { code: 'ff', name: 'Fulani' },
  { code: 'tw', name: 'Twi' },
  { code: 'ak', name: 'Akan' },
  { code: 'lg', name: 'Luganda' },
  { code: 'rn', name: 'Kirundi' },
  { code: 'rw', name: 'Kinyarwanda' },
  { code: 'ny', name: 'Chichewa' },
  { code: 'sn', name: 'Shona' },
  { code: 'nd', name: 'Ndebele' },
  { code: 'ss', name: 'Swati' },
  { code: 'st', name: 'Sesotho' },
  { code: 'tn', name: 'Setswana' },
  { code: 've', name: 'Venda' },
  { code: 'ts', name: 'Tsonga' },
  { code: 'xh', name: 'Xhosa' }
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [originalJson, setOriginalJson] = useState<string>('');
  const [translatedJson, setTranslatedJson] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [translationProgress, setTranslationProgress] = useState<{current: number, total: number} | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);
  const [translationStrategy, setTranslationStrategy] = useState<string>('');
  const [translationState, setTranslationState] = useState<{
    isResumable: boolean;
    originalJson: string;
    translatedJson: string;
    progress: {current: number, total: number};
    strategy: string;
    targetLanguage: string;
    apiKey: string;
    fileName: string;
  } | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save translation state to localStorage
  const saveTranslationState = (state: any) => {
    try {
      localStorage.setItem('json-translator-state', JSON.stringify({
        ...state,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save translation state:', error);
    }
  };

  // Load translation state from localStorage
  const loadTranslationState = () => {
    try {
      const saved = localStorage.getItem('json-translator-state');
      if (saved) {
        const state = JSON.parse(saved);
        // Check if state is not too old (24 hours)
        if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
          return state;
        }
      }
    } catch (error) {
      console.warn('Failed to load translation state:', error);
    }
    return null;
  };

  // Clear translation state
  const clearTranslationState = () => {
    try {
      localStorage.removeItem('json-translator-state');
    } catch (error) {
      console.warn('Failed to clear translation state:', error);
    }
  };

  // Check for resumable translation on component mount
  useEffect(() => {
    const savedState = loadTranslationState();
    if (savedState && savedState.isResumable) {
      setTranslationState(savedState);
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      setError('');

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setOriginalJson(content);
      };
      reader.readAsText(selectedFile);
    } else {
      setError('Please select a valid JSON file');
    }
  };

  const protectPatterns = (text: string): string => {
    // Protect patterns like [country_code], [something_underscored], etc.
    // Use a pattern that AI is very unlikely to translate
    return text.replace(/\[[^\]]+\]/g, (match) => `__PLACEHOLDER_${btoa(match)}__`);
  };

  const restorePatterns = (text: string): string => {
    // Restore protected patterns
    return text.replace(/__PLACEHOLDER_([A-Za-z0-9+/=]+)__/g, (match, encoded) => {
      try {
        return atob(encoded);
      } catch {
        return match;
      }
    });
  };

  const translateJson = async () => {
    if (!file || !apiKey || !originalJson) {
      setError('Please upload a JSON file and provide an API key');
      return;
    }

    // Check if mock mode is enabled
    const mockMode = apiKey === 'dummy';
    setIsMockMode(mockMode);
    setIsTranslating(true);
    setError('');

    try {
      const parsedJson = JSON.parse(originalJson);

      // Check file size and determine strategy
      const jsonSize = JSON.stringify(parsedJson).length;
      const stringCount = countStrings(parsedJson);
      const isLargeFile = jsonSize > 10000 || stringCount > 20; // Much lower threshold for batching

      // Save initial state for resumability
      const initialState = {
        isResumable: true,
        originalJson,
        translatedJson: '',
        progress: { current: 0, total: stringCount },
        strategy: isLargeFile ? 'Batching (100 strings per batch)' : 'Single Request',
        targetLanguage,
        apiKey,
        fileName: file.name
      };
      saveTranslationState(initialState);
      setTranslationState(initialState);

      if (isLargeFile) {
        // For large files, use batching strategy
        setTranslationStrategy('Batching (100 strings per batch)');
        await translateLargeJson(parsedJson);
      } else {
        // For small files, use single request
        setTranslationStrategy('Single Request');
        await translateSmallJson(parsedJson);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setIsTranslating(false);
      // Clear resumable state when translation completes
      clearTranslationState();
      setTranslationState(null);
    }
  };

  // Resume translation from saved state
  const resumeTranslation = async () => {
    if (!translationState) return;

    setIsTranslating(true);
    setError('');
    setApiKey(translationState.apiKey);
    setTargetLanguage(translationState.targetLanguage);
    setOriginalJson(translationState.originalJson);
    setTranslationProgress(translationState.progress);
    setTranslationStrategy(translationState.strategy);

    try {
      const parsedJson = JSON.parse(translationState.originalJson);
      await translateLargeJson(parsedJson);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resume failed');
    } finally {
      setIsTranslating(false);
      setIsCancelling(false);
      clearTranslationState();
      setTranslationState(null);
    }
  };

  // Cancel translation
  const cancelTranslation = () => {
    setIsCancelling(true);
    setIsTranslating(false);
    // Keep the state for resumption
  };

  const translateSmallJson = async (parsedJson: any) => {
    // Create a deep copy and protect patterns
    const protectedJson = JSON.parse(JSON.stringify(parsedJson), (key, value) => {
      if (typeof value === 'string') {
        return protectPatterns(value);
      }
      return value;
    });

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: protectedJson,
        targetLanguage,
        apiKey,
        strategy: 'single'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Translation failed');
    }

    const result = await response.json();

    // Restore protected patterns
    const restoredJson = JSON.parse(JSON.stringify(result.translatedJson), (key, value) => {
      if (typeof value === 'string') {
        return restorePatterns(value);
      }
      return value;
    });

    setTranslatedJson(JSON.stringify(restoredJson, null, 2));
  };

  const translateLargeJson = async (parsedJson: any) => {
    // Count total string values for progress tracking
    const stringCount = countStrings(parsedJson);
    setTranslationProgress({ current: 0, total: stringCount });

    // For large files, use batching strategy
    const translatedJson = await translateJsonWithBatching(parsedJson, stringCount);
    setTranslatedJson(JSON.stringify(translatedJson, null, 2));
    setTranslationProgress(null);
  };

  const translateJsonWithBatching = async (obj: any, totalCount: number): Promise<any> => {
    // Collect all strings first
    const stringsToTranslate: { path: string[], value: string }[] = [];
    const collectStrings = (current: any, path: string[] = []) => {
      if (typeof current === 'string' && current.trim() !== '') {
        stringsToTranslate.push({ path: [...path], value: current });
      } else if (Array.isArray(current)) {
        current.forEach((item, index) => {
          collectStrings(item, [...path, index.toString()]);
        });
      } else if (current && typeof current === 'object') {
        Object.entries(current).forEach(([key, value]) => {
          collectStrings(value, [...path, key]);
        });
      }
    };

    collectStrings(obj);

    // Batch strings into groups of 100 for maximum speed
    const batchSize = 100;
    const batches: { path: string[], value: string }[][] = [];
    for (let i = 0; i < stringsToTranslate.length; i += batchSize) {
      batches.push(stringsToTranslate.slice(i, i + batchSize));
    }

    // Translate each batch
    const translatedStrings = new Map<string, string>();
    let processedCount = 0;

    for (const batch of batches) {
      const batchTexts = batch.map(item => item.value);
      const batchPaths = batch.map(item => item.path);

      // Create batch request
      const batchRequest = {
        texts: batchTexts,
        targetLanguage,
        apiKey,
        strategy: 'batch'
      };

      // Retry logic for failed requests
      let response;
      let retries = 3;
      let lastError;

      while (retries > 0) {
        try {
          response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(batchRequest),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Translation failed');
          }

          break; // Success, exit retry loop
        } catch (error) {
          lastError = error;
          retries--;
          if (retries > 0) {
            console.warn(`Batch translation failed, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries))); // Exponential backoff
          }
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('Translation failed after retries');
      }

      const result = await response.json();

      // Store translated results
      batchPaths.forEach((path, index) => {
        translatedStrings.set(JSON.stringify(path), result.translatedTexts[index]);
      });

      processedCount += batch.length;
      const currentProgress = { current: processedCount, total: totalCount };
      setTranslationProgress(currentProgress);

      // Save progress to localStorage
      if (translationState) {
        // Create a temporary reconstruct function for progress saving
        const tempReconstruct = (current: any, path: string[] = []): any => {
          if (typeof current === 'string' && current.trim() !== '') {
            const translated = translatedStrings.get(JSON.stringify(path));
            return translated || current;
          } else if (Array.isArray(current)) {
            return current.map((item, index) => tempReconstruct(item, [...path, index.toString()]));
          } else if (current && typeof current === 'object') {
            const result: any = {};
            Object.entries(current).forEach(([key, value]) => {
              result[key] = tempReconstruct(value, [...path, key]);
            });
            return result;
          }
          return current;
        };

        const updatedState = {
          ...translationState,
          progress: currentProgress,
          translatedJson: JSON.stringify(tempReconstruct(obj), null, 2)
        };
        saveTranslationState(updatedState);
        setTranslationState(updatedState);
      }

      // Minimal delay between batches
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Reconstruct the JSON with translated strings
    const reconstructJson = (current: any, path: string[] = []): any => {
      if (typeof current === 'string' && current.trim() !== '') {
        const translated = translatedStrings.get(JSON.stringify(path));
        return translated || current;
      } else if (Array.isArray(current)) {
        return current.map((item, index) => reconstructJson(item, [...path, index.toString()]));
      } else if (current && typeof current === 'object') {
        const result: any = {};
        Object.entries(current).forEach(([key, value]) => {
          result[key] = reconstructJson(value, [...path, key]);
        });
        return result;
      }
      return current;
    };

    return reconstructJson(obj);
  };

  const countStrings = (obj: any): number => {
    if (typeof obj === 'string') {
      // Only count non-empty strings
      return obj.trim() === '' ? 0 : 1;
    } else if (Array.isArray(obj)) {
      return obj.reduce((count: number, item: any) => count + countStrings(item), 0);
    } else if (obj && typeof obj === 'object') {
      return Object.values(obj).reduce((count: number, value: any) => count + countStrings(value), 0);
    }
    return 0;
  };

  const translateJsonRecursively = async (obj: any, currentCount: number, totalCount: number): Promise<any> => {
    if (typeof obj === 'string') {
      // Only translate non-empty strings
      if (obj.trim() === '') {
        return obj;
      }

      // Update progress
      setTranslationProgress({ current: currentCount + 1, total: totalCount });

      // Translate individual string values
      const protectedText = protectPatterns(obj);

      // Debug logging
      console.log('Translating text:', protectedText);

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: protectedText,
          targetLanguage,
          apiKey,
          strategy: 'text-only'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Translation error:', errorData);
        throw new Error(errorData.error || 'Translation failed');
      }

      const result = await response.json();

      // Minimal delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 5));

      return restorePatterns(result.translatedText);
    } else if (Array.isArray(obj)) {
      // Preserve array structure
      const translatedArray = [];
      let count = currentCount;
      for (let i = 0; i < obj.length; i++) {
        translatedArray[i] = await translateJsonRecursively(obj[i], count, totalCount);
        count += countStrings(obj[i]);
      }
      return translatedArray;
    } else if (obj && typeof obj === 'object') {
      // Preserve object structure
      const translatedObj: any = {};
      let count = currentCount;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          translatedObj[key] = await translateJsonRecursively(obj[key], count, totalCount);
          count += countStrings(obj[key]);
        }
      }
      return translatedObj;
    } else {
      // Return primitive values as-is (numbers, booleans, null, undefined)
      return obj;
    }
  };

  const downloadTranslatedJson = () => {
    if (translatedJson) {
      const blob = new Blob([translatedJson], { type: 'application/json' });
      const fileName = file?.name?.replace('.json', '') || 'translated';
      saveAs(blob, `${fileName}_${targetLanguage}.json`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-full">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent ml-4">
              JSON Translator
            </h1>
          </div>
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-yellow-400 mr-2" />
            <p className="text-2xl font-semibold text-white">AI Powered Translation</p>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your JSON files into multiple languages instantly.
            <span className="text-purple-300 font-semibold"> Preserves structure</span>,
            <span className="text-pink-300 font-semibold"> protects placeholders</span>, and
            <span className="text-blue-300 font-semibold"> delivers accuracy</span>.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Controls */}
            <div className="xl:col-span-1 space-y-6">
              {/* File Upload */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  Upload JSON File
                </h2>
                <div
                  className="border-2 border-dashed border-purple-300/50 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400/70 transition-all duration-300 hover:bg-purple-500/10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-white mb-2">
                    {file ? file.name : 'Drag files here or click to upload'}
                  </p>
                  <p className="text-sm text-gray-300">Supports .json format files, up to 10MB</p>
                </div>
              </div>

              {/* API Key */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg mr-3">
                    <Key className="h-6 w-6 text-white" />
                  </div>
                  OpenAI API Key
                </h2>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                />
                <p className="text-sm text-gray-300 mt-3">
                  🔒 Your API key is only used temporarily and never stored
                </p>
                {apiKey === 'dummy' && (
                  <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-400/50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-2">⚠️</span>
                      <span className="text-yellow-200 text-sm font-semibold">Mock Mode Active</span>
                    </div>
                    <p className="text-yellow-300 text-xs mt-1">
                      Using "dummy" API key - translations will return original text for testing
                    </p>
                  </div>
                )}
              </div>

              {/* Language Selection */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
                    <Languages className="h-6 w-6 text-white" />
                  </div>
                  Select Target Language
                </h2>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-800 text-white">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resume Translation Alert */}
              {translationState && !isTranslating && (
                <div className="bg-yellow-500/20 border border-yellow-400/50 text-yellow-200 px-4 py-4 rounded-xl backdrop-blur-sm mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-400 mr-2">⚠️</span>
                        <span className="font-semibold">Translation Interrupted</span>
                      </div>
                      <p className="text-sm">
                        Previous translation of "{translationState.fileName}" was interrupted.
                        Progress: {translationState.progress.current}/{translationState.progress.total} strings
                      </p>
                    </div>
                    <button
                      onClick={resumeTranslation}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Resume
                    </button>
                  </div>
                </div>
              )}

              {/* Translate/Cancel Button */}
              {isTranslating ? (
                <div className="space-y-3">
                  <button
                    onClick={translateJson}
                    disabled={true}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 px-6 rounded-xl font-bold text-xl opacity-50 cursor-not-allowed shadow-2xl"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      {translationProgress ? `Translating... ${translationProgress.current}/${translationProgress.total}` : 'Translating...'}
                      {isMockMode && <span className="ml-2 text-xs">(Mock Mode)</span>}
                    </div>
                  </button>
                  <button
                    onClick={cancelTranslation}
                    disabled={isCancelling}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Translation'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={translateJson}
                  disabled={!file || !apiKey}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 px-6 rounded-xl font-bold text-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <div className="flex items-center justify-center">
                    <Sparkles className="h-6 w-6 mr-2" />
                    {isMockMode ? 'Test Translation (Mock Mode)' : 'Start Translation'}
                  </div>
                </button>
              )}

              {/* Progress Bar */}
              {translationProgress && (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">
                      Translation Progress
                      {isMockMode && <span className="ml-2 text-yellow-400 text-sm">(Mock Mode)</span>}
                      {translationStrategy && <span className="ml-2 text-blue-400 text-sm">({translationStrategy})</span>}
                    </span>
                    <span className="text-gray-300 text-sm">
                      {translationProgress.current} / {translationProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isMockMode
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                      style={{ width: `${(translationProgress.current / translationProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-4 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="bg-red-500 rounded-full p-1 mr-3">
                      <span className="text-white text-sm">⚠</span>
                    </div>
                    {error}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Preview */}
            <div className="xl:col-span-2 space-y-6">
              {/* Original JSON */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg mr-3">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    Original JSON
                  </h2>
                  {originalJson && (
                    <button
                      onClick={() => copyToClipboard(originalJson)}
                      className="flex items-center text-sm bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                  <pre className="text-gray-300 text-sm overflow-auto max-h-96 font-mono leading-relaxed">
                    {originalJson || (
                      <span className="text-gray-500 italic">
                        Upload a JSON file to see preview
                      </span>
                    )}
                  </pre>
                </div>
              </div>

              {/* Translated JSON */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    Translated JSON
                  </h2>
                  {translatedJson && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => copyToClipboard(translatedJson)}
                        className="flex items-center text-sm bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300"
                      >
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={downloadTranslatedJson}
                        className="flex items-center text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                  )}
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                  <pre className="text-gray-300 text-sm overflow-auto max-h-96 font-mono leading-relaxed">
                    {translatedJson || (
                      <span className="text-gray-500 italic">
                        Translation will appear here
                      </span>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose Our JSON Translator?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Preserve JSON Structure</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Smart structure preservation keeps your JSON files clean and organized with perfect formatting
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Multi-language Support</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Connect with users worldwide through 40+ supported languages with AI-powered accuracy
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Key className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Pattern Protection</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Automatically protects placeholders like [country_code] from translation with smart detection
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">40+</div>
                <div className="text-gray-300">Languages</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-300">Structure Preserved</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">10MB</div>
                <div className="text-gray-300">Max File Size</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">AI</div>
                <div className="text-gray-300">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
