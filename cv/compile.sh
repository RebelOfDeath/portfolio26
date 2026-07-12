#!/usr/bin/env bash
# Compile cv.tex → cv.pdf and copy to ../assets/cv.pdf
set -e

cd "$(dirname "$0")"

echo "── Compiling cv.tex (pass 1)…"
pdflatex -interaction=nonstopmode cv.tex > /dev/null

echo "── Compiling cv.tex (pass 2, for page count)…"
pdflatex -interaction=nonstopmode cv.tex > /dev/null

echo "── Cleaning auxiliary files…"
rm -f cv.aux cv.log cv.out cv.fls cv.fdb_latexmk

echo "Done. Output: $(realpath cv.pdf)"
