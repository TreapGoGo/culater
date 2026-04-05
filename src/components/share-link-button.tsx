"use client";

import React, { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";

export function ShareLinkButton() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      onClick={handleCopy}
      className="secondary-button h-9 gap-2 border-amber-200/10 bg-amber-500/5 px-3 text-[11px] font-medium text-amber-200/80 hover:border-amber-200/30 hover:bg-amber-500/10 hover:text-amber-200"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          链接已复制
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          复制分享链接
        </>
      )}
    </button>
  );
}
