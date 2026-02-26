"use client";

import { useCallback } from "react";
import type { CompareMode } from "@/lib/filters/compare-params";
import type { CompareEntity } from "./EntitySelector";
import { formatStatValue } from "@/lib/compare-format-map";
import { getStatDisplayLabel } from "@/lib/stat-definitions";

interface ExportToolbarProps {
  tableRef: React.RefObject<HTMLDivElement | null>;
  entities: CompareEntity[];
  entityStats: Record<string, Record<string, unknown>>;
  stats: string[];
  mode: CompareMode;
}

export function ExportToolbar({
  tableRef,
  entities,
  entityStats,
  stats,
  mode,
}: ExportToolbarProps) {
  const handleImageExport = useCallback(async () => {
    if (!tableRef.current) return;
    const { toPng } = await import("html-to-image");
    try {
      const dataUrl = await toPng(tableRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `stat-comparison-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Image export failed:", err);
    }
  }, [tableRef]);

  const handleCsvExport = useCallback(() => {
    const header = [
      "Stat",
      ...entities.map((e) => e.name),
    ];
    const rows = stats.map((key) => {
      const label = getStatDisplayLabel(key);
      const values = entities.map((e) =>
        formatStatValue(key, entityStats[e.id]?.[key], mode)
      );
      return [label, ...values];
    });
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `stat-comparison-${Date.now()}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [entities, entityStats, stats, mode]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="no-print flex items-center gap-2">
      <span className="text-xs text-foreground/40 mr-1">Export:</span>
      <button
        onClick={handleImageExport}
        className="inline-flex items-center gap-1.5 rounded-md border border-foreground/10 px-2.5 py-1.5 text-xs font-medium text-foreground/70 hover:bg-foreground/5 transition-colors"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Image
      </button>
      <button
        onClick={handleCsvExport}
        className="inline-flex items-center gap-1.5 rounded-md border border-foreground/10 px-2.5 py-1.5 text-xs font-medium text-foreground/70 hover:bg-foreground/5 transition-colors"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        CSV
      </button>
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 rounded-md border border-foreground/10 px-2.5 py-1.5 text-xs font-medium text-foreground/70 hover:bg-foreground/5 transition-colors"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print
      </button>
    </div>
  );
}
