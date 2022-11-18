#!/bin/bash

hrefs=$(cat README.md | grep -E '\(\.\/.+\)' -o)

for href in $hrefs; do
  href="${href#(}"; 
  href="${href%)}";

  ls $href;
  code=$(echo $?)
  
  if [ $code -ne 0 ]; 
  then
    # https://docs.github.com/en/actions/creating-actions/setting-exit-codes-for-actions#about-exit-codes
    exit 1
  fi;
done