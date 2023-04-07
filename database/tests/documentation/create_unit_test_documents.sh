#!/bin/bash

# The number of copies to create; default is 1
num_copies=${1:-1}

# The output directory for new test case files
output_dir="../test_case_specifications"

# Get the highest number in existing db_unit_test_#.txt files
max_number=$(ls "${output_dir}/db_unit_test_"*.txt 2>/dev/null | sed 's/.*db_unit_test_\(.*\).txt/\1/' | sort -n | tail -n 1)

# If there are no existing files, start numbering from 1
if [ -z "$max_number" ]; then
  max_number=0
fi

# Create the specified number of copies
for i in $(seq 1 $num_copies); do
  new_number=$((max_number + i))
  new_file="${output_dir}/db_unit_test_${new_number}.txt"
  sed "s/^Test Case ID:.*/Test Case ID: db_ut_${new_number}/" db_unit_tests_template.txt > "$new_file"
done

