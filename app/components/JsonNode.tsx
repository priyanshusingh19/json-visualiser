"use client";

import { ChevronRight, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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
  const { theme } = useTheme();
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const isExpandable = isObject && (isArray ? value.length > 0 : Object.keys(value).length > 0);

  const getValueColor = (val: unknown): string => {
    if (theme === "light") {
      if (val === null) return "text-slate-500";
      if (typeof val === "boolean") return "text-purple-600";
      if (typeof val === "number") return "text-cyan-600";
      if (typeof val === "string") return "text-green-600";
      return "text-slate-700";
    }
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
    const keyColor = theme === "light" ? "text-slate-700" : "text-slate-300";
    return (
      <div className="py-1">
        <span className={keyColor}>{name}:</span>
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

  const hoverBg = theme === "light" ? "hover:bg-slate-200" : "hover:bg-slate-800";
  const chevronColor = theme === "light" ? "text-slate-500" : "text-slate-400";
  const keyColor = theme === "light" ? "text-slate-700" : "text-slate-300";
  const countColor = theme === "light" ? "text-slate-600" : "text-slate-500";
  const borderColor = theme === "light" ? "border-slate-300" : "border-slate-700";

  return (
    <div className="py-1">
      <div
        className={`flex items-center cursor-pointer ${hoverBg} rounded px-2 py-1 -mx-2`}
        onClick={handleToggle}
      >
        <span className={`${chevronColor} mr-1`}>
          {expanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </span>
        <span className={keyColor}>{name}:</span>
        <span className={`${countColor} ml-2`}>
          {isArray ? `[${entries.length}]` : `{${entries.length}}`}
        </span>
      </div>

      {expanded && (
        <div className={`ml-4 border-l ${borderColor} pl-4`}>
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
