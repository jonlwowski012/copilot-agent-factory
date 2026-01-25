# Makefile for ICLR 2026 Copilot Agent Factory paper

# Main file name (without .tex extension)
MAIN = iclr2026_copilot_agent_factory

# LaTeX compiler
LATEX = pdflatex
BIBTEX = bibtex

# Compilation flags
LATEX_FLAGS = -interaction=nonstopmode -halt-on-error

# Output PDF
PDF = $(MAIN).pdf

# Auxiliary files to clean
AUX_FILES = *.aux *.bbl *.blg *.log *.out *.toc *.lof *.lot *.fls *.fdb_latexmk *.synctex.gz

.PHONY: all clean cleanall view

# Default target
all: $(PDF)

# Build the PDF (full compilation with bibliography)
$(PDF): $(MAIN).tex references.bib math_commands.tex
	@echo "First LaTeX pass..."
	$(LATEX) $(LATEX_FLAGS) $(MAIN).tex
	@echo "Running BibTeX..."
	$(BIBTEX) $(MAIN)
	@echo "Second LaTeX pass..."
	$(LATEX) $(LATEX_FLAGS) $(MAIN).tex
	@echo "Third LaTeX pass..."
	$(LATEX) $(LATEX_FLAGS) $(MAIN).tex
	@echo "PDF created: $(PDF)"

# Quick build (single pass, no bibliography update)
quick: $(MAIN).tex
	$(LATEX) $(LATEX_FLAGS) $(MAIN).tex

# Clean auxiliary files
clean:
	@echo "Cleaning auxiliary files..."
	rm -f $(AUX_FILES)
	@echo "Clean complete."

# Clean everything including PDF
cleanall: clean
	@echo "Removing PDF..."
	rm -f $(PDF)
	@echo "All clean."

# View the PDF (works on Linux with default PDF viewer)
view: $(PDF)
	xdg-open $(PDF) 2>/dev/null || open $(PDF) 2>/dev/null || echo "Please open $(PDF) manually"

# Help message
help:
	@echo "Makefile for ICLR 2026 Copilot Agent Factory paper"
	@echo ""
	@echo "Available targets:"
	@echo "  all      - Build the PDF with full compilation (default)"
	@echo "  quick    - Quick build (single LaTeX pass)"
	@echo "  clean    - Remove auxiliary files"
	@echo "  cleanall - Remove all generated files including PDF"
	@echo "  view     - Open the PDF after building"
	@echo "  help     - Show this help message"
