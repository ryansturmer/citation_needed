#!/bin/sh

python /home/ryansturmer/projects/versioned/citationneeded/python/cn_convert.py ryan.csv | dot -Tpng > ryan.png
python /home/ryansturmer/projects/versioned/citationneeded/python/cn_convert.py johnny.csv | dot -Tpng > johnny.png
python /home/ryansturmer/projects/versioned/citationneeded/python/cn_convert.py ryan.csv johnny.csv | dot -Tpng > both.png
python /home/ryansturmer/projects/versioned/citationneeded/python/cn_convert.py ryan.csv | dot -Tpdf > ryan.pdf
python /home/ryansturmer/projects/versioned/citationneeded/python/cn_convert.py johnny.csv | dot -Tpdf > johnny.pdf
python /home/ryansturmer/projects/versioned/citationneeded/python/cn_convert.py ryan.csv johnny.csv | dot -Tpdf > both.pdf

