"use client";

import { useState, useEffect } from "react";
import JsonNode from "./JsonNode";

interface JsonViewerProps {
  data: unknown;
}

export default function JsonViewer({ data }: JsonViewerProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(["root"]));

  useEffect(() => {
    const paths = new Set<string>(["root"]);
    // Expand first level of keys
    if (data !== null && typeof data === "object") {
      const keys = Array.isArray(data) 
        ? data.map((_, idx) => `root.${idx}`)
        : Object.keys(data as Record<string, unknown>).map(key => `root.${key}`);
      keys.forEach(key => paths.add(key));
    }
    setExpandedPaths(paths);
  }, [data]);

  const togglePath = (path: string) => {
    const newPaths = new Set(expandedPaths);
    if (newPaths.has(path)) {
      newPaths.delete(path);
    } else {
      newPaths.add(path);
    }
    setExpandedPaths(newPaths);
  };

  return (
    <div className="font-mono text-sm text-slate-200 h-full overflow-auto pr-2">
      <JsonNode
        name="root"
        value={data}
        path="root"
        expanded={expandedPaths.has("root")}
        onToggle={togglePath}
        expandedPaths={expandedPaths}
      />
    </div>
  );
}
