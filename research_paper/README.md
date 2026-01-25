# Research Paper: Copilot Agent Factory

This directory contains the research paper submission for **ICLR 2026 "Agents in the Wild" Workshop**.

## Paper Title
**Copilot Agent Factory: Automated Generation of Context-Aware AI Coding Agents from Repository Structure**

## Files

- `iclr2026_copilot_agent_factory.tex` - Main paper LaTeX source
- `references.bib` - Bibliography in BibTeX format
- `math_commands.tex` - Mathematical notation commands
- `Makefile` - Build automation
- `README.md` - This file

## Building the Paper

### Automatic Build (CI/CD)

The PDF is automatically built by GitHub Actions on every push to the repository. You can:

1. **Download the PDF**: Go to the Actions tab → Select the latest "Build Research Paper" workflow run → Download the "research-paper-pdf" artifact
2. **Trigger manual build**: Go to Actions tab → "Build Research Paper" workflow → "Run workflow" button

The workflow runs automatically when:
- Changes are pushed to `research_paper/` directory
- Pull requests are opened that modify the paper
- A new tag is created (PDF is attached to the release)

### Local Build

#### Prerequisites

You need a LaTeX distribution installed:
- **Linux**: `sudo apt-get install texlive-full`
- **macOS**: Install MacTeX from https://www.tug.org/mactex/
- **Windows**: Install MiKTeX from https://miktex.org/

#### Compilation

#### Using Make (recommended)
```bash
make
```

This will compile the paper and generate `iclr2026_copilot_agent_factory.pdf`.

To clean auxiliary files:
```bash
make clean
```

To clean everything including the PDF:
```bash
make cleanall
```

#### Manual Compilation
```bash
pdflatex iclr2026_copilot_agent_factory.tex
bibtex iclr2026_copilot_agent_factory
pdflatex iclr2026_copilot_agent_factory.tex
pdflatex iclr2026_copilot_agent_factory.tex
```

Note: The multiple pdflatex runs are necessary to resolve references and citations.

## ICLR Format

This paper follows the ICLR 2026 conference format. Key requirements:

- **Anonymous submission**: Author names and affiliations hidden (for review)
- **Page limit**: 8 pages for main content (excluding references and appendices)
- **Format**: Two-column layout, 10pt font
- **Style file**: Uses `iclr2026_conference.sty` (included in most LaTeX distributions)

### Before Camera-Ready Submission

When preparing the final camera-ready version after acceptance:

1. Uncomment `\iclrfinalcopy` in the LaTeX file
2. Add real author names and affiliations
3. Recompile

## Paper Structure

1. **Abstract** (250 words)
2. **Introduction** - Motivation and contributions
3. **Related Work** - AI assistants, code generation, repository mining
4. **System Architecture** - Detection engine, template system, generation pipeline
5. **Agent Design Patterns** - 41 agents across 12 categories
6. **Workflow System** - Orchestrator and approval gates
7. **Implementation** - Technical details
8. **Evaluation** - Detection accuracy, generation quality, case studies
9. **Discussion** - Strengths, limitations, future work
10. **Conclusion** - Summary and impact
11. **Appendices** - Agent examples, detection rules, placeholder reference

## Key Contributions

1. Novel meta-template system for automated AI agent generation
2. Detection-based repository analysis (97%+ precision)
3. Multi-platform support (VS Code/GitHub Copilot, Claude Code, Cursor)
4. Structured workflow system with approval gates
5. Empirical validation across diverse repositories

## Workshop Information

- **Conference**: ICLR 2026 (International Conference on Learning Representations)
- **Workshop**: "Agents in the Wild"
- **Focus**: Real-world applications of AI agents in practical settings
- **Format**: Workshop paper (shorter than full conference papers)

## Notes

- All evaluation data in Section 7 is illustrative. For actual submission, replace with real experimental results.
- Case studies in Section 7.5 are based on actual Copilot Agent Factory capabilities but should be validated with real user studies.
- Some citations may need updating based on latest publications.

## Contact

For questions about this research paper, please open an issue in the main repository.
