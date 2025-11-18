"use client";

import { ChevronRight, ChevronDown } from "lucide-react";

interface JsonNodeProps {
  name: string;
  value: unknown;
  path: string;
  expanded: boolean;
  onToggle: (path: string) => void;
  expandedPaths: Set<string>;
}

export default function JsonNode({
  name,
  value,
  path,
  expanded,
  onToggle,
  expandedPaths,
}: JsonNodeProps) {
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const isExpandable = isObject && (isArray ? value.length > 0 : Object.keys(value).length > 0);

  const getValueColor = (val: unknown): string => {
    if (val === null) return "text-slate-400";
    if (typeof val === "boolean") return "text-purple-400";
    if (typeof val === "number") return "text-cyan-400";
    if (typeof val === "string") return "text-green-400";
    return "text-slate-300";
  };

  const renderValue = (val: unknown): string => {
    if (val === null) return "null";
    if (typeof val === "string") return `"${val}"`;
    if (typeof val === "boolean") return val ? "true" : "false";
    if (typeof val === "number") return String(val);
    return "";
  };

  const handleToggle = () => {
    onToggle(path);
  };

  if (!isExpandable) {
    return (
      <div className="py-1">
        <span className="text-slate-300">{name}:</span>
        <span className={`ml-2 ${getValueColor(value)}`}>{renderValue(value)}</span>
      </div>
    );
  }

  const entries = isArray
    ? (value as unknown[]).map((item, idx) => ({ key: String(idx), value: item }))
    : Object.entries(value as Record<string, unknown>).map(([key, val]) => ({
        key,
        value: val,
      }));

  return (
    <div className="py-1">
      <div
        className="flex items-center cursor-pointer hover:bg-slate-800 rounded px-2 py-1 -mx-2"
        onClick={handleToggle}
      >
        <span className="text-slate-400 mr-1">
          {expanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </span>
        <span className="text-slate-300">{name}:</span>
        <span className="text-slate-500 ml-2">
          {isArray ? `[${entries.length}]` : `{${entries.length}}`}
        </span>
      </div>

      {expanded && (
        <div className="ml-4 border-l border-slate-700 pl-4">
          {entries.map(({ key, value: val }, idx) => (
            <JsonNode
              key={idx}
              name={key}
              value={val}
              path={`${path}.${key}`}
              expanded={expandedPaths.has(`${path}.${key}`)}
              onToggle={onToggle}
              expandedPaths={expandedPaths}
            />
          ))}
        </div>
      )}
    </div>
  );
}
