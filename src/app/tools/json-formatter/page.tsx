"use client";

import { useState } from "react";
import Link from "next/link";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function format() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">JSON Formatter</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[var(--muted)] mb-2 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-80 px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm font-mono text-[var(--foreground)] placeholder:text-[var(--muted)] resize-none focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div>
          <label className="text-sm text-[var(--muted)] mb-2 block">Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm font-mono text-[var(--foreground)] resize-none focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-3">{error}</p>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={format}
          className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg text-sm transition-colors"
        >
          Format
        </button>
        <button
          onClick={minify}
          className="px-4 py-2 border border-[var(--card-border)] rounded-lg text-sm hover:bg-[var(--card-bg)] transition-colors"
        >
          Minify
        </button>
        {output && (
          <button
            onClick={copyOutput}
            className="px-4 py-2 border border-[var(--card-border)] rounded-lg text-sm hover:bg-[var(--card-bg)] transition-colors"
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
}
