"use client";

import { useState } from "react";
import JsonViewer from "./components/JsonViewer";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedJson, setParsedJson] = useState<unknown>(null);
  const [error, setError] = useState("");

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);
    setError("");

    if (!value.trim()) {
      setParsedJson(null);
      return;
    }

    try {
      const parsed = JSON.parse(value);
      setParsedJson(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setParsedJson(null);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      setParsedJson(parsed);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const handleClear = () => {
    setJsonInput("");
    setParsedJson(null);
    setError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-4 w-full flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-white mb-1">JSON Visualizer</h1>
          <p className="text-slate-400">Paste your JSON and visualize it in a beautiful tree format</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden min-h-0">
          {/* Input Section */}
          <div className="flex flex-col min-h-0">
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full min-h-0">
              <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
                <h2 className="text-lg font-semibold text-white">JSON Input</h2>
              </div>
              <textarea
                value={jsonInput}
                onChange={handleJsonChange}
                placeholder='Paste your JSON here... e.g., {"name": "John", "age": 30}'
                className="flex-1 p-6 bg-slate-900 text-white font-mono text-sm resize-none focus:outline-none placeholder-slate-500"
              />
              <div className="bg-slate-700 px-4 py-2 border-t border-slate-600 flex gap-2">
                <button
                  onClick={handleFormat}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition"
                >
                  Format
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded font-medium text-sm transition"
                >
                  Copy
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-sm transition"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Viewer Section */}
          <div className="flex flex-col min-h-0">
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full min-h-0">
              <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
                <h2 className="text-lg font-semibold text-white">Visualization</h2>
              </div>
              <div className="flex-1 p-6 bg-slate-900 overflow-auto min-h-0">
                {error && (
                  <div className="bg-red-900/30 border border-red-700 rounded p-4 text-red-200">
                    <p className="font-semibold">Error:</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                {parsedJson !== null && !error && (
                  <JsonViewer data={parsedJson} />
                )}
                {!jsonInput.trim() && !error && (
                  <p className="text-slate-500 text-center py-12">
                    Enter JSON to see the visualization here
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
