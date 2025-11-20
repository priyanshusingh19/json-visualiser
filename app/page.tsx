"use client";

import { useState } from "react";
import { Moon, Sun, Copy, Trash2, Download } from "lucide-react";
import JsonViewer from "./components/JsonViewer";
import { useTheme } from "./context/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [jsonInput, setJsonInput] = useState("");
  const [parsedJson, setParsedJson] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [splitPos, setSplitPos] = useState(30); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleDownload = () => {
    if (!jsonInput.trim()) return;
    
    try {
      // Format the JSON if it's not already formatted
      const jsonToDownload = JSON.stringify(JSON.parse(jsonInput), null, 2);
      
      // Create a blob with the JSON data
      const blob = new Blob([jsonToDownload], { type: 'application/json' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Set a default filename with the current date and time
      const date = new Date();
      const timestamp = date.toISOString().replace(/[:.]/g, '-').split('T').join('_').split('.')[0];
      a.download = `json-visualizer-${timestamp}.json`;
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to prepare JSON for download. Please check if the JSON is valid.');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonInput);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const newPos = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Constrain between 20% and 80%
    if (newPos >= 20 && newPos <= 80) {
      setSplitPos(newPos);
    }
  };

  const bgClass = theme === "dark" 
    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    : "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50";
  
  const textClass = theme === "dark" ? "text-white" : "text-slate-900";
  const subtextClass = theme === "dark" ? "text-slate-400" : "text-slate-600";
  const cardBgClass = theme === "dark" ? "bg-slate-800" : "bg-white";
  const cardBorderClass = theme === "dark" ? "border-slate-700" : "border-slate-200";
  const inputBgClass = theme === "dark" ? "bg-slate-900" : "bg-slate-50";
  const inputTextClass = theme === "dark" ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400";

  return (
    <div className={`h-screen w-screen ${bgClass} flex flex-col overflow-hidden transition-colors duration-300`}>
      <div className="px-4 py-4 w-full flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${textClass} mb-1`}>JSON Visualizer</h1>
            <p className={subtextClass}>Paste your JSON and visualize it in a beautiful tree format</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "bg-slate-700 hover:bg-slate-600 text-yellow-400"
                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Main Content */}
        <div 
          className="flex flex-1 overflow-hidden min-h-0 gap-6"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Input Section */}
          <div className="flex flex-col min-h-0" style={{ width: `${splitPos}%` }}>
            <div className={`${cardBgClass} rounded-lg shadow-lg overflow-hidden flex flex-col h-full min-h-0 border ${cardBorderClass}`}>
              <div className={`${theme === "dark" ? "bg-slate-700" : "bg-slate-100"} px-6 py-4 border-b ${cardBorderClass}`}>
                <h2 className={`text-lg font-semibold ${textClass}`}>JSON Input</h2>
              </div>
              <textarea
                value={jsonInput}
                onChange={handleJsonChange}
                placeholder='Paste your JSON here... e.g., {"name": "John", "age": 30}'
                className={`flex-1 p-6 ${inputBgClass} ${inputTextClass} font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              />
              <div className={`${theme === "dark" ? "bg-slate-700" : "bg-slate-100"} px-4 py-2 border-t ${cardBorderClass} flex gap-2`}>
                <button
                  onClick={handleFormat}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition"
                >
                  Format
                </button>
                <button
                  onClick={handleCopy}
                  className={`p-1.5 rounded font-medium transition ${
                    copySuccess
                      ? "bg-green-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  title={copySuccess ? "Copied!" : "Copy JSON"}
                  aria-label="Copy JSON"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={handleDownload}
                  className={`p-1.5 rounded font-medium transition ${
                    !jsonInput.trim() 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  title={jsonInput.trim() ? 'Download JSON' : 'No JSON to download'}
                  aria-label="Download JSON"
                  disabled={!jsonInput.trim()}
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={handleClear}
                  className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
                  title="Clear JSON"
                  aria-label="Clear JSON"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Resizable Divider */}
          <div
            onMouseDown={handleMouseDown}
            className={`w-1 ${theme === "dark" ? "bg-slate-700 hover:bg-blue-500" : "bg-slate-300 hover:bg-blue-500"} cursor-col-resize transition-colors ${isDragging ? (theme === "dark" ? "bg-blue-500" : "bg-blue-500") : ""}`}
          />

          {/* Viewer Section */}
          <div className="flex flex-col min-h-0" style={{ width: `${100 - splitPos}%` }}>
            <div className={`${cardBgClass} rounded-lg shadow-lg overflow-hidden flex flex-col h-full min-h-0 border ${cardBorderClass}`}>
              <div className={`${theme === "dark" ? "bg-slate-700" : "bg-slate-100"} px-6 py-4 border-b ${cardBorderClass}`}>
                <h2 className={`text-lg font-semibold ${textClass}`}>Visualization</h2>
              </div>
              <div className={`flex-1 p-6 ${inputBgClass} overflow-auto min-h-0`}>
                {error && (
                  <div className={`${theme === "dark" ? "bg-red-900/30 border-red-700" : "bg-red-100 border-red-300"} border rounded p-4 ${theme === "dark" ? "text-red-200" : "text-red-800"}`}>
                    <p className="font-semibold">Error:</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                {parsedJson !== null && !error && (
                  <JsonViewer data={parsedJson} />
                )}
                {!jsonInput.trim() && !error && (
                  <p className={`${theme === "dark" ? "text-slate-500" : "text-slate-400"} text-center py-12`}>
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
