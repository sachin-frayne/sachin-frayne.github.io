#!/usr/bin/env bash

for MARKDOWN_FILE in ../blogs/contents/*; 
do 
    HTML_FILE=$(echo $MARKDOWN_FILE | sed -e 's|../blogs/contents/||g' -e 's|.md||g')
    pandoc --mathml -f markdown -t html $MARKDOWN_FILE -o ../blogs/htmls/$HTML_FILE.html
done




