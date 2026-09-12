import { supplyDrive } from "@/content/supplies";

/**
 * THE BUDGET ENGINE behind the mission trip calculator.
 *
 * Pure functions, no React, so the arithmetic can be unit-tested and so the
 * same numbers can be reused anywhere. Every unit cost is Don's, read live
 * from content/supplies.ts — if he changes what a Bible costs, the calculator
 * follows without an edit here.
 */

export type BudgetGroup = "team" | "supplies" | "logistics";

export const GROUP_OF: Record<string, BudgetGroup> = {
  missionary: "team",
  bible: "supplies",
  "hygiene-kit": "supplies",
  "reading-glasses": "supplies",
  sunglasses: "supplies",
  tracts: "supplies",
  "pastor-gift": "supplies",
  trunk: "logistics",
  baggage: "logistics",
  customs: "logistics",
};

/** Don's own Belize plan, as quantities — the calculator's "reset" state. */
export const DONS_PLAN: Record<string, number> = Object.fromEntries(
  supplyDrive.items.map((i) => [i.id, i.needed ?? 0]),
);

export type BudgetLine = {
  id: string;
  name: string;
  group: BudgetGroup;
  unitCost: number;
  qty: number;
  total: number;
};

export type Budget = {
  lines: BudgetLine[];
  team: number;
  supplies: number;
  logistics: number;
  total: number;
  /** Share of the grand total that is moving supplies rather than buying them. */
  logisticsShare: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeBudget(quantities: Record<string, number>): Budget {
  const lines: BudgetLine[] = supplyDrive.items.map((i) => {
    const raw = Number(quantities[i.id] ?? 0);
    const qty = Number.isFinite(raw) ? Math.max(0, Math.min(9999, Math.floor(raw))) : 0;
    return {
      id: i.id,
      name: i.name,
      group: GROUP_OF[i.id] ?? "supplies",
      unitCost: i.unitCost,
      qty,
      total: round2(qty * i.unitCost),
    };
  });
  const sum = (g: BudgetGroup) =>
    round2(lines.filter((l) => l.group === g).reduce((s, l) => s + l.total, 0));
  const team = sum("team");
  const supplies = sum("supplies");
  const logistics = sum("logistics");
  const total = round2(team + supplies + logistics);
  return {
    lines,
    team,
    supplies,
    logistics,
    total,
    logisticsShare: total > 0 ? Math.round((logistics / total) * 100) : 0,
  };
}

/** A spreadsheet-ready CSV of the budget (quoted, UTF-8 BOM for Excel). */
export function budgetCsv(b: Budget): string {
  const q = (s: string | number) => `"${String(s).replace(/"/g, '""')}"`;
  const rows = [
    ["Item", "Group", "Unit cost (USD)", "Quantity", "Line total (USD)"],
    ...b.lines
      .filter((l) => l.qty > 0)
      .map((l) => [l.name, l.group, l.unitCost.toFixed(2), l.qty, l.total.toFixed(2)]),
    [],
    ["Team", "", "", "", b.team.toFixed(2)],
    ["Supplies", "", "", "", b.supplies.toFixed(2)],
    ["Logistics", "", "", "", b.logistics.toFixed(2)],
    ["Total", "", "", "", b.total.toFixed(2)],
    [],
    ["Unit costs are Don Nichols' published prices — donandpatti.com/what-a-mission-trip-costs"],
  ];
  return "﻿" + rows.map((r) => r.map(q).join(",")).join("\r\n");
}

export const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
