---
name: debug-code-profiling
description: "Debug code using detailed profiling and critical path timing before making suggestions"
auto-activates:
  - "debug performance"
  - "profile code"
  - "find bottleneck"
  - "slow code"
  - "optimize performance"
  - "critical path"
  - "time execution"
  - "debug with profiling"
  - "remote profiling"
  - "profile on aws"
---

# Skill: Debug Code with Profiling

## When to Use This Skill

This skill activates when you need to:
- Debug performance issues in code
- Find bottlenecks and slow execution paths
- Optimize code based on measured data (not guesswork)
- Identify the critical path before making suggestions
- Time execution to understand where time is spent

## Critical Rule: Profile First, Suggest Second

**Never make optimization or debugging suggestions without first:**
1. Running detailed profiling to collect real data
2. Identifying and timing the critical path
3. Documenting measured baseline metrics

## Prerequisites

Before using this skill, ensure:
- You have access to the relevant codebase and can run it in an appropriate environment
- You have permission to run profiling and performance tools on the target environment (local, CI, or production-like)
- The necessary profiling tools are installed for the target language/runtime (for example, Python `cProfile`, Node.js `--prof`/profilers, browser devtools, or APM/profiling agents)
- You can execute a representative workload, test suite, or scenario that reproduces the performance issue
## Step-by-Step Workflow

### Step 1: Run Profiling (REQUIRED – Do Not Skip)

Collect profiling data before any suggestions.

#### Python

**cProfile (Built-in):**
```bash
# Profile entire script
python -m cProfile -o profile_output.prof your_script.py

# Profile with sort by cumulative time
python -m cProfile -s cumtime your_script.py

# Profile specific function
python -c "
import cProfile
import pstats
import your_module
profiler = cProfile.Profile()
profiler.enable()
your_module.function_to_profile()
profiler.disable()
stats = pstats.Stats(profiler)
stats.sort_stats('cumulative')
stats.print_stats(20)
"
```

**line_profiler (Line-by-line):**
```bash
pip install line_profiler
kernprof -l -v your_script.py
```

**py-spy (Sampling, no code changes):**
```bash
pip install py-spy
py-spy top -- python your_script.py
py-spy record -o profile.svg -- python your_script.py
```

#### JavaScript/Node.js

**Built-in V8 Profiler:**
```bash
node --prof your_script.js
node --prof-process isolate-*-v8.log > processed.txt
```

**Clinic.js:**
```bash
npx clinic doctor -- node your_script.js
npx clinic flame -- node your_script.js
```

#### Go

```bash
# CPU profiling
go test -cpuprofile=cpu.prof -bench=.
go tool pprof -top cpu.prof
```

For runtime profiling, add to your application:

```go
import _ "net/http/pprof"
```

Then analyze:

```bash
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
```

#### Java/JVM

```bash
# JMX profiling
java -XX:+UnlockCommercialFeatures -XX:+FlightRecorder -XX:StartFlightRecording=duration=60s,filename=profile.jfr -jar app.jar

# Or use VisualVM, YourKit, JProfiler
```

### Step 2: Identify and Time the Critical Path

**Critical path** = the sequence of operations that determines minimum execution time.

**Required actions:**
1. Trace the execution flow from entry point to completion
2. Measure time spent in each segment of the critical path
3. Create a timing breakdown table:

| Segment | Function/File:Line | Cumulative % | Self Time | Call Count |
|---------|-------------------|--------------|-----------|------------|
| 1. Entry | main:42 | 100% | 5ms | 1 |
| 2. Parse | parse_input:15 | 85% | 120ms | 1 |
| 3. Process | process_data:89 | 45% | 200ms | 1 |
| 4. Output | write_result:201 | 10% | 25ms | 1 |

4. Identify the **bottleneck** (largest self-time or cumulative contributor)

### Step 3: Document Baseline Metrics

Before suggesting changes, record:

```
## Profiling Baseline
- **Tool used:** [cProfile / py-spy / Clinic.js / X-Ray / etc.]
- **Target:** [local / remote] — If remote: **Infrastructure:** [aws / gcp / azure]
- **Remote profiling flags:** [AWS_XRAY_SDK_ENABLED=true / ENABLE_PROFILING=1 / etc.] (if applicable)
- **Duration:** [seconds]
- **Critical path total time:** [ms]
- **Top 3 bottlenecks:**
  1. [Function] - [X]ms ([Y]% of total)
  2. [Function] - [X]ms ([Y]% of total)
  3. [Function] - [X]ms ([Y]% of total)
- **Hot spots (by line):** [file:line - time]
```

### Step 4: Make Data-Driven Suggestions

Only after Steps 1–3 are complete, suggest optimizations that:
- Target the measured bottlenecks
- Reference the profiling data
- Include expected impact (e.g., "Addresses ~45% of critical path time")
- Are justified by the timing breakdown

**Example suggestion format:**
```
**Bottleneck:** process_data() - 200ms (45% of total)
**Evidence:** Line 95 shows 180ms in list comprehension
**Suggestion:** Use generator or batch processing
**Expected impact:** Reduce critical path by ~40%
```

## Flame Graph Generation (Optional but Recommended)

**Python:**
```bash
pip install py-spy
py-spy record -o flamegraph.svg --format speedscope -- python script.py
```

**Node.js:**
```bash
npx clinic flame -- node app.js
```

**Interpretation:** The widest horizontal bars = most time spent. Focus suggestions there.

## Remote Profiling (Target Infrastructure)

When profiling runs on remote infrastructure (cloud, staging, production), use infrastructure-specific flags or environment variables to enable profiling and export traces.

### Infrastructure-Based Profiling Flags

| Target | Flag / Env Var | Purpose | Example |
|--------|----------------|---------|---------|
| **AWS** | `AWS_XRAY_SDK_ENABLED=true` | Enable X-Ray tracing | `AWS_XRAY_SDK_ENABLED=true python app.py` |
| **AWS** | `AWS_XRAY_DAEMON_ADDRESS` | X-Ray daemon endpoint | `AWS_XRAY_DAEMON_ADDRESS=127.0.0.1:2000` |
| **GCP** | `ENABLE_PROFILING=1` | Cloud Profiler | `ENABLE_PROFILING=1 ./app` |
| **GCP** | `GOOGLE_CLOUD_PROJECT` | Profiler project ID | `GOOGLE_CLOUD_PROJECT=my-project` |
| **Azure** | `APPLICATIONINSIGHTS_CONNECTION_STRING` | Application Insights | Set in app config |
| **Azure** | `AZURE_APPLICATION_INSIGHTS_ENABLED` | Enable App Insights profiler | `AZURE_APPLICATION_INSIGHTS_ENABLED=true` |
| **Generic** | `ENABLE_REMOTE_PROFILING=1` | Custom remote profiler | Use for on-prem or custom stacks |

**Usage pattern:**
```bash
# Set flag based on target before running
export ENABLE_REMOTE_PROFILING=1
export TARGET_INFRASTRUCTURE=aws  # or gcp, azure, on-prem

# Or inline
TARGET_INFRASTRUCTURE=aws AWS_XRAY_SDK_ENABLED=true python app.py
```

### AWS X-Ray Annotations

When profiling on AWS, add X-Ray annotations to mark the critical path and key segments for correlation with traces.

**Python (aws-xray-sdk):**
```python
from aws_xray_sdk.core import xray_recorder

@xray_recorder.capture('process_data')  # Subsegment name
def process_data(data):
    # Add annotations for critical path segments
    xray_recorder.put_annotation('segment', 'process_data')
    xray_recorder.put_metadata('input_size', len(data), 'profiling')
    # ... work ...
    xray_recorder.put_metadata('output_size', len(result), 'profiling')
    return result

# Manual subsegment for granular timing
with xray_recorder.in_subsegment('parse_input') as subsegment:
    subsegment.put_annotation('critical_path', 'true')
    result = parse_input(raw)
```

**Node.js:**
```javascript
const AWSXRay = require('aws-xray-sdk-core');

app.use(AWSXRay.express.openSegment('myApp'));

// Add subsegment for critical path
AWSXRay.captureAsyncFunc('processData', (subsegment) => {
  subsegment.addAnnotation('segment', 'processData');
  subsegment.addMetadata('profiling', 'inputSize', data.length);
  return processData(data)
    .then(result => {
      subsegment.addMetadata('profiling', 'outputSize', result.length);
      subsegment.close();
      return result;
    });
});
```

**Annotation conventions for critical path:**
| Annotation Key | Value | Purpose |
|----------------|-------|---------|
| `critical_path` | `true` | Marks segment as part of critical path |
| `segment` | `parse_input` | Segment name for filtering in X-Ray console |
| `bottleneck` | `true` | Flag suspected bottleneck for review |

**Enable X-Ray when profiling remotely:**
```bash
AWS_XRAY_SDK_ENABLED=true AWS_XRAY_DAEMON_ADDRESS=169.254.79.2:2000 python app.py
```

## Common Profiling Pitfalls to Avoid

| Pitfall | Problem | Correct Approach |
|----------|---------|------------------|
| Guessing | Suggesting optimizations without data | Always profile first |
| Wrong metric | Optimizing non-critical path | Time critical path explicitly |
| Cold start | Profiling includes startup only | Profile steady-state or warm runs |
| Overhead | Profiler distorts timings | Use sampling for production-like profiling |
| One run | Variability not captured | Run multiple times, report min/avg/p95 |
| Remote target, local profile | Profiling local when issue is in cloud | Set infra-specific flags, use X-Ray/Cloud Profiler/App Insights |

## Success Criteria

- ✅ Profiling data collected and summarized
- ✅ Critical path identified and timed
- ✅ Baseline metrics documented
- ✅ Suggestions target measured bottlenecks
- ✅ No optimization suggestions without supporting profiling data

## Related Skills

- **debug-test-failures** - Debug failing tests (different from performance debugging)
- **run-tests** - Execute tests before/after profiling to verify behavior
- **code-formatting** - Format any instrumentation code added
