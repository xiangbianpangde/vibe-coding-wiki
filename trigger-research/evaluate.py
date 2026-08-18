#!/usr/bin/env python3
"""evaluate.py — FROZEN evaluation layer

This module is part of the Latent Capability Trigger research.
After SHA256-freeze before Phase C confirmation, this file MUST NOT be modified.

Responsibilities (FROZEN):
- Load raw.jsonl from runs/{phase}/
- Compute paired exact accuracy difference (primary metric)
- Compute paired bootstrap 95% CI
- Compute Exact McNemar test
- Apply Holm-Bonferroni multiplicity correction
- Output stats.json

This is the "evaluate.py" analog in Karpathy's autoresearch.
The Agent CANNOT modify evaluation logic or statistical tests.
"""
import argparse
import json
import math
from collections import defaultdict
from pathlib import Path
from typing import Optional


# ============================================================
# Data loading
# ============================================================
def load_raw(path: str) -> list[dict]:
    """Load raw.jsonl records (FROZEN schema)."""
    records = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            records.append(json.loads(line))
    return records


def filter_records(
    records: list[dict],
    problem_ids: Optional[set] = None,
    trigger_ids: Optional[set] = None,
) -> list[dict]:
    """Filter by problem IDs and/or trigger IDs (for split-aligned evaluation)."""
    out = records
    if problem_ids is not None:
        out = [r for r in out if r["problem_id"] in problem_ids]
    if trigger_ids is not None:
        out = [r for r in out if r["trigger_id"] in trigger_ids]
    return out


# ============================================================
# Accuracy & paired diff (FROZEN formula)
# ============================================================
def accuracy(records: list[dict]) -> float:
    """Simple accuracy (FROZEN)."""
    if not records:
        return 0.0
    return sum(1 for r in records if r["correct"]) / len(records)


def paired_accuracy_difference(
    baseline_records: list[dict],
    trigger_records: list[dict],
) -> dict:
    """
    Compute paired exact accuracy difference.

    CRITICAL: Uses identical problem_ids (per hard gate).
    """
    # Build problem_id → correctness map
    base_map = {r["problem_id"]: r["correct"] for r in baseline_records}
    trig_map = {r["problem_id"]: r["correct"] for r in trigger_records}

    # Pair on problem_id
    common_ids = set(base_map.keys()) & set(trig_map.keys())
    if not common_ids:
        return {"delta": 0.0, "n": 0, "n_discordant": 0}

    pairs = [(base_map[pid], trig_map[pid]) for pid in common_ids]

    n = len(pairs)
    n_correct_baseline = sum(b for b, t in pairs)
    n_correct_trigger = sum(t for b, t in pairs)
    delta = (n_correct_trigger - n_correct_baseline) / n
    n_discordant = sum(1 for b, t in pairs if b != t)

    return {
        "delta": delta,
        "delta_pp": delta * 100,
        "n": n,
        "n_discordant": n_discordant,
        "acc_baseline": n_correct_baseline / n,
        "acc_trigger": n_correct_trigger / n,
    }


# ============================================================
# Bootstrap CI (problem-level resampling)
# ============================================================
def bootstrap_paired_ci(
    baseline_records: list[dict],
    trigger_records: list[dict],
    n_resamples: int = 10000,
    alpha: float = 0.05,
    seed: int = 42,
) -> dict:
    """
    Paired bootstrap 95% CI.

    CRITICAL: Resamples by problem_id (NOT by individual records).
    """
    import random

    base_map = {r["problem_id"]: r["correct"] for r in baseline_records}
    trig_map = {r["problem_id"]: r["correct"] for r in trigger_records}
    common_ids = list(set(base_map.keys()) & set(trig_map.keys()))
    n = len(common_ids)

    if n == 0:
        return {"ci_low": 0, "ci_high": 0, "n": 0}

    rng = random.Random(seed)
    deltas = []
    for _ in range(n_resamples):
        # Resample problem_ids WITH REPLACEMENT
        sampled = [rng.choice(common_ids) for _ in range(n)]
        base_correct = sum(base_map[pid] for pid in sampled)
        trig_correct = sum(trig_map[pid] for pid in sampled)
        delta = (trig_correct - base_correct) / n
        deltas.append(delta)

    deltas.sort()
    ci_low_idx = int((alpha / 2) * n_resamples)
    ci_high_idx = int((1 - alpha / 2) * n_resamples)

    return {
        "delta": sum(deltas) / n_resamples,
        "delta_pp": (sum(deltas) / n_resamples) * 100,
        "ci_low": deltas[ci_low_idx],
        "ci_high": deltas[ci_high_idx],
        "ci_low_pp": deltas[ci_low_idx] * 100,
        "ci_high_pp": deltas[ci_high_idx] * 100,
        "n_resamples": n_resamples,
        "n": n,
    }


# ============================================================
# Exact McNemar test (paired binary)
# ============================================================
def exact_mcnemar_test(
    baseline_records: list[dict],
    trigger_records: list[dict],
) -> dict:
    """
    Exact McNemar test for paired binary outcome.

    More appropriate than independent proportions test because
    the same problem is tested under two conditions.
    """
    base_map = {r["problem_id"]: r["correct"] for r in baseline_records}
    trig_map = {r["problem_id"]: r["correct"] for r in trigger_records}
    common_ids = list(set(base_map.keys()) & set(trig_map.keys()))

    # Count discordant pairs
    # b: baseline correct, t: trigger correct
    b01 = 0  # baseline correct, trigger wrong
    b10 = 0  # baseline wrong, trigger correct
    b11 = 0  # both correct
    b00 = 0  # both wrong

    for pid in common_ids:
        b = base_map[pid]
        t = trig_map[pid]
        if b and t:
            b11 += 1
        elif b and not t:
            b01 += 1
        elif not b and t:
            b10 += 1
        else:
            b00 += 1

    # Exact McNemar p-value (binomial test, n=b01+b10)
    from math import comb
    n_disc = b01 + b10
    if n_disc == 0:
        return {"p_value": 1.0, "b01": b01, "b10": b10, "b11": b11, "b00": b00}

    # Two-sided p-value
    k = min(b01, b10)
    p_value = sum(comb(n_disc, i) for i in range(k + 1)) * (0.5 ** n_disc)
    p_value = 2 * p_value  # Two-sided

    return {
        "p_value": min(p_value, 1.0),
        "b01": b01,
        "b10": b10,
        "b11": b11,
        "b00": b00,
        "n_discordant": n_disc,
    }


# ============================================================
# Holm-Bonferroni correction (multiplicity)
# ============================================================
def holm_bonferroni(p_values: list[float], alpha: float = 0.05) -> list[dict]:
    """
    Holm-Bonferroni step-down correction.

    Returns list of dicts with 'p_adjusted' and 'significant' per input.
    """
    n = len(p_values)
    if n == 0:
        return []

    # Sort by p-value
    indexed = sorted(enumerate(p_values), key=lambda x: x[1])
    adjusted = [None] * n

    for rank, (orig_idx, p) in enumerate(indexed):
        # Holm factor: alpha / (n - rank)
        factor = alpha / (n - rank)
        p_adj = p * (n - rank)
        p_adj = min(p_adj, 1.0)  # Cap at 1.0

        # Enforce monotonicity (cumulative max from smallest to largest)
        if rank > 0:
            p_adj = max(p_adj, adjusted[indexed[rank - 1][0]])

        adjusted[orig_idx] = p_adj

    return [
        {"p_value": p_values[i], "p_adjusted": adjusted[i], "significant": adjusted[i] < alpha}
        for i in range(n)
    ]


# ============================================================
# Effort interaction
# ============================================================
def effort_interaction(
    trigger_delta_low: float,
    trigger_delta_high: float,
) -> float:
    """
    Compute I = Δ_trigger(low) - Δ_trigger(high).

    Positive value = trigger more effective at low effort than high.
    Negative value = trigger less effective at low effort (saturation).
    """
    return trigger_delta_low - trigger_delta_high


def equivalence_test(
    acc_low_T: float,
    acc_high_B: float,
    margin_pp: float = 2.0,
) -> dict:
    """
    Test if Acc(low, T) ≈ Acc(high, baseline) within margin.

    NOT "failed to reject difference" — that's a statistical error.
    """
    diff_pp = abs(acc_low_T - acc_high_B) * 100
    return {
        "diff_pp": diff_pp,
        "margin_pp": margin_pp,
        "equivalent": diff_pp < margin_pp,
    }


# ============================================================
# Main evaluation pipeline
# ============================================================
def evaluate_run(
    run_path: str,
    baseline_trigger_id: str = "ctrl_baseline",
    output_path: str = "stats.json",
) -> dict:
    """
    Evaluate a single run and compute all primary stats.
    """
    records = load_raw(run_path)

    # Filter out failed (no response)
    records = [r for r in records if r.get("response")]

    if not records:
        print(f"No valid records in {run_path}")
        return {}

    # Group by trigger
    by_trigger = defaultdict(list)
    for r in records:
        by_trigger[r["trigger_id"]].append(r)

    # Compute baseline accuracy
    baseline_records = by_trigger.get(baseline_trigger_id, [])
    if not baseline_records:
        print(f"No baseline records found (trigger_id={baseline_trigger_id})")
        return {}

    baseline_acc = accuracy(baseline_records)
    print(f"Baseline ({baseline_trigger_id}): {baseline_acc:.3f} (n={len(baseline_records)})")

    # Per-trigger results
    results = {
        "n_total": len(records),
        "baseline_trigger": baseline_trigger_id,
        "baseline_accuracy": baseline_acc,
        "baseline_n": len(baseline_records),
        "triggers": {},
    }

    p_values_for_holm = []
    trigger_order = []

    for trigger_id, trigger_records in by_trigger.items():
        if trigger_id == baseline_trigger_id:
            continue

        # Skip controls for main comparison (handled separately)
        paired = paired_accuracy_difference(baseline_records, trigger_records)
        ci = bootstrap_paired_ci(baseline_records, trigger_records)
        mcnemar = exact_mcnemar_test(baseline_records, trigger_records)

        results["triggers"][trigger_id] = {
            "delta": paired["delta"],
            "delta_pp": paired["delta_pp"],
            "ci_low_pp": ci["ci_low_pp"],
            "ci_high_pp": ci["ci_high_pp"],
            "n": paired["n"],
            "n_discordant": paired["n_discordant"],
            "acc_trigger": paired["acc_trigger"],
            "mcnemar_p": mcnemar["p_value"],
        }

        p_values_for_holm.append(mcnemar["p_value"])
        trigger_order.append(trigger_id)

    # Apply Holm-Bonferroni correction
    if p_values_for_holm:
        corrected = holm_bonferroni(p_values_for_holm, alpha=0.05)
        for i, trigger_id in enumerate(trigger_order):
            results["triggers"][trigger_id]["mcnemar_p_holm"] = corrected[i]["p_adjusted"]
            results["triggers"][trigger_id]["significant_holm"] = corrected[i]["significant"]

    # Save
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    return results


# ============================================================
# CLI
# ============================================================
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--run", required=True, help="Path to raw.jsonl run file")
    parser.add_argument("--baseline", default="ctrl_baseline")
    parser.add_argument("--output", default="stats.json")
    args = parser.parse_args()

    print(f"Evaluating {args.run}")
    results = evaluate_run(args.run, args.baseline, args.output)

    if results.get("triggers"):
        print("\n=== Trigger Results (sorted by delta) ===")
        triggers_sorted = sorted(
            results["triggers"].items(),
            key=lambda x: x[1]["delta"],
            reverse=True,
        )
        for trigger_id, data in triggers_sorted[:10]:
            sig = "✓" if data.get("significant_holm", False) else "✗"
            print(
                f"  [{sig}] {trigger_id:30s} Δ={data['delta_pp']:+.2f}pp "
                f"95%CI=[{data['ci_low_pp']:+.2f}, {data['ci_high_pp']:+.2f}] "
                f"p_adj={data.get('mcnemar_p_holm', 'n/a')} n={data['n']}"
            )

    print(f"\nSaved stats to {args.output}")


if __name__ == "__main__":
    main()