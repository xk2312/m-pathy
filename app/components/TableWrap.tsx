"use client";
import React from "react";

export default function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="gptm-table-wrap">
      {children}
    </div>
  );
}
