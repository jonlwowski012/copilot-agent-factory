# Loop Agent Template Standard

**Applies To:** `agent-templates/loop-*.agent.md`
**Companion To:** `SKILL-TEMPLATE-STANDARD.md` (skills), `.github/instructions/templates.instructions.md` (all agents)

Loop agents are agents that run **more than once** on the same objective. A normal agent answers a request and stops. A loop agent runs an iteration, decides whether the work is done, and either stops or runs again.

This document defines the shared contract that all four loop agents implement, so each template can describe only what makes its loop different (DRY).

## The Four Loop Types

| Loop | What starts an iteration | Who decides to continue | Terminates when | Best for |
|------|--------------------------|-------------------------|-----------------|----------|
| **Turn-based** (`loop-turn-agent`) | The human sends the next message | The human | The human stops replying or accepts the result | Design work, risky refactors, anything needing judgment per step |
| **Goal-based** (`loop-goal-agent`) | The previous iteration ended and the goal is still unmet | The agent, via an executable success predicate | Predicate passes, budget exhausted, or no progress | "Make the suite green", "get coverage to 80%", migrations |
| **Time-based** (`loop-time-agent`) | A clock fires (cron/interval) | The scheduler | Task is cancelled or expires | Polling CI, nightly audits, release-branch babysitting |
| **Proactive** (`loop-proactive-agent`) | An external signal crosses a threshold | The signal source | The watch is removed | Incident response, dependency CVEs, error-rate spikes |

**They compose.** A time-based loop typically wakes up and runs a goal-based inner loop; a proactive loop that finds something serious escalates into a turn-based loop with a human.

## Choosing a Loop Type

```
Does a human need to weigh in between iterations?
├── Yes → Turn-based loop
└── No
    └── Is there a testable definition of "done"?
        ├── Yes → Goal-based loop
        └── No
            └── What triggers the work?
                ├── The clock → Time-based loop
                └── An external event → Proactive loop
```

**If none apply, it is not a loop.** Use a normal agent. Wrapping single-shot work in a loop burns budget and produces churn.

## Universal Loop Contract

Every loop agent MUST define these seven things before its first iteration. A loop with an undefined stop condition is a defect, not a feature.

### 1. Objective

One sentence, unambiguous, unchanged for the life of the loop. If the objective changes, stop the loop and start a new one.

### 2. Iteration Unit

The smallest useful, independently verifiable increment. One iteration = one increment. Iterations that "do everything" cannot be verified, resumed, or rolled back.

### 3. Success Criteria

Stated as an **executable check**, not prose:

```yaml
success_criteria:
  command: "{{loop_verify_command}}"
  passes_when: "exit code 0 and 0 failures reported"
```

If the criteria cannot be expressed as a command, express them as a checklist where each item is objectively true or false.

### 4. Budgets

Every loop is bounded on all three axes:

| Budget | Placeholder | Purpose |
|--------|-------------|---------|
| Iterations | `{{loop_max_iterations}}` | Hard cap on cycles |
| Wall clock | `{{loop_time_budget}}` | Hard cap on elapsed time |
| Blast radius | `{{loop_scope_paths}}` | Files/systems the loop may touch |

Exhausting a budget is a normal, reportable outcome — not a failure to hide.

### 5. Stop Conditions

Check **all** of these at the end of every iteration, in order:

| # | Condition | Action |
|---|-----------|--------|
| 1 | **Success** — criteria pass | Stop, report the result |
| 2 | **Budget exhausted** — iterations, time, or cost | Stop, report progress and what remains |
| 3 | **No progress** — 2 consecutive iterations with no measurable change | Stop, escalate; the approach is wrong |
| 4 | **Oscillation** — state repeats a previously seen state | Stop, escalate; report the cycle |
| 5 | **Regression** — a previously passing check now fails | Revert the last change, then escalate |
| 6 | **Blocked** — needs a decision, credential, or approval | Stop, ask precisely one question |
| 7 | **Unsafe** — next step is irreversible or outside scope | Stop, request explicit approval |

### 6. Iteration Record

Every iteration appends one record to `{{loop_state_file}}`. This is what makes a loop resumable, auditable, and survivable across context compaction.

```yaml
- iteration: 3
  at: "2026-08-30T14:22:00-05:00"
  observed: "4 failing tests, all in tests/test_auth.py"
  hypothesis: "Token expiry uses UTC, fixtures use local time"
  action: "Pinned fixture clock to UTC in tests/conftest.py"
  verified: "pytest -q → 2 failing (was 4)"
  progress: true
  next: "Fix the remaining 2 failures in refresh-token path"
```

**Rules:**
- `progress` is a boolean derived from the verification output, never from the agent's optimism.
- Write the record even when the iteration failed. Failed iterations are the most valuable entries.
- Keep the file append-only; never rewrite history to look cleaner.

### 7. Escalation Path

Who or what receives the loop when it stops without success — `{{loop_escalation_target}}`. Default: the human who started it, with the last three iteration records and a specific question.

## Safety Rails

These are non-negotiable across all four loop types:

- **Irreversible actions never auto-repeat.** Pushing, deploying, deleting, sending, paying, and merging require explicit approval per occurrence — never blanket approval "for the loop".
- **Never weaken the success criteria to satisfy them.** Editing the test, lowering the threshold, or adding a skip to make the predicate pass is loop fraud. If the criteria are wrong, stop and say so.
- **Verification must be independent of the change.** The thing that decides "done" cannot be edited by the iteration that is trying to be done.
- **Every iteration is idempotent.** Assume it may run twice, or be interrupted halfway. Check current state before acting; do not assume the previous iteration completed.
- **Stay inside `{{loop_scope_paths}}`.** A loop that wanders is a loop that has lost its objective.
- **Quiet by default.** An iteration that found nothing reports one line, not a summary of everything it checked.

## Loop Placeholders

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{loop_objective}}` | The loop's one-sentence goal | "Keep the release branch green" |
| `{{loop_state_file}}` | Append-only iteration ledger | "`docs/loops/release-green-state.md`" |
| `{{loop_max_iterations}}` | Iteration cap | "10", "25" |
| `{{loop_time_budget}}` | Wall-clock cap | "30m", "4h" |
| `{{loop_scope_paths}}` | Files/dirs the loop may modify | "`src/auth/`, `tests/auth/`" |
| `{{loop_verify_command}}` | Command proving success/progress | "pytest -q", "npm test" |
| `{{loop_success_criteria}}` | Executable definition of done | "exit 0 and coverage ≥ 80%" |
| `{{loop_runtime}}` | What starts the next iteration | "`/goal`", "Stop hook", "manual" |
| `{{loop_turn_budget}}` | Turn-based: turns before checkpoint | "5" |
| `{{loop_interval}}` | Time-based: human interval | "5m", "2h" |
| `{{loop_schedule_cron}}` | Time-based: 5-field cron expression | "*/15 * * * *", "7 9 * * 1-5" |
| `{{loop_scheduler}}` | Where the schedule runs | "`/loop`", "Routines", "GitHub Actions" |
| `{{loop_timezone}}` | Schedule timezone | "America/Chicago" |
| `{{loop_trigger_signals}}` | Proactive: signals watched | "CI failure, 5xx rate > 1%" |
| `{{loop_watch_paths}}` | Proactive: paths/resources watched | "`.github/workflows/`, prod error feed" |
| `{{loop_notify_channel}}` | Where findings are reported | "#eng-alerts", "PR comment" |
| `{{loop_cooldown}}` | Proactive: re-alert suppression window | "1h", "24h" |
| `{{loop_escalation_target}}` | Who receives a stopped loop | "@review-agent", "the on-call engineer" |

## Anti-Patterns

| ❌ Anti-pattern | Why it fails | ✅ Instead |
|-----------------|--------------|-----------|
| Loop with no iteration cap | Runs until someone notices the bill | Set `{{loop_max_iterations}}` |
| "Keep trying until it works" | No definition of works | Executable success predicate |
| Rewriting the test to pass | Produces a green suite and broken software | Stop and report the conflict |
| Reporting every quiet iteration | Trains the reader to ignore the loop | Report state changes only |
| Same fix reapplied each iteration | No-progress detection is missing | Compare verification output to the previous iteration |
| Polling every minute for an hourly event | 60× the cost, no extra signal | Match interval to the rate of change |
| Holding all state in context | Lost on compaction or restart | Append to `{{loop_state_file}}` |

## Review Checklist

Before shipping a loop agent template:

- [ ] File uses `.agent.md` extension, no `model:` or `triggers:` in frontmatter
- [ ] Objective, iteration unit, and success criteria are all defined
- [ ] Success criteria are executable (a command or a true/false checklist)
- [ ] All three budgets are bounded
- [ ] All seven stop conditions are checked
- [ ] Iteration record format is specified and written to `{{loop_state_file}}`
- [ ] Escalation path names a specific target
- [ ] Irreversible actions are behind explicit per-occurrence approval
- [ ] Boundaries section uses ✅/⚠️/🚫
- [ ] MCP Servers section present
