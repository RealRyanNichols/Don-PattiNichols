import assert from "node:assert/strict";
import test from "node:test";
import { computeBudget, budgetCsv, DONS_PLAN } from "../lib/budget";
import { supplyDrive } from "../content/supplies";

test("Don's plan plus zero missionaries totals his published supply-drive goal", () => {
  const b = computeBudget({ ...DONS_PLAN, missionary: 0 });
  assert.equal(b.team, 0);
  // $3,940 = ~$2,215 supplies + ~$1,725 logistics on Don's budget.
  assert.equal(b.total, supplyDrive.goalUsd);
  assert.equal(b.supplies + b.logistics, b.total);
  assert(b.logisticsShare > 0 && b.logisticsShare < 100);
});

test("each line is quantity times Don's unit cost, rounded to cents", () => {
  const b = computeBudget({ bible: 3, "reading-glasses": 7 });
  const bible = b.lines.find((l) => l.id === "bible")!;
  const glasses = b.lines.find((l) => l.id === "reading-glasses")!;
  assert.equal(bible.total, 7.5);
  assert.equal(glasses.total, 4.2);
  assert.equal(b.total, 11.7);
});

test("bad quantities are clamped rather than trusted", () => {
  const b = computeBudget({ bible: -5, trunk: Number.NaN, missionary: 99999, baggage: 2.9 });
  assert.equal(b.lines.find((l) => l.id === "bible")!.qty, 0);
  assert.equal(b.lines.find((l) => l.id === "trunk")!.qty, 0);
  assert.equal(b.lines.find((l) => l.id === "missionary")!.qty, 9999);
  assert.equal(b.lines.find((l) => l.id === "baggage")!.qty, 2);
});

test("the CSV opens in Excel: BOM, quoted cells, only non-zero lines, a total row", () => {
  const csv = budgetCsv(computeBudget({ bible: 10, missionary: 1 }));
  assert(csv.startsWith("﻿"));
  assert(csv.includes('"A Bible","supplies","2.50","10","25.00"'));
  assert(csv.includes('"Sponsor a Missionary","team","1200.00","1","1200.00"'));
  assert(!csv.includes('"A Hygiene Kit"'));
  assert(csv.includes('"Total","","","","1225.00"'));
});
