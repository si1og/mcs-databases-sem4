#!/bin/sh

set -eu

QUERY_COUNT=9
DB_CONTAINER="${DB_CONTAINER:-typography_coursework_db}"
DB_USER="${DB_USER:-ilyasemenov}"
DB_NAME="${DB_NAME:-typography}"

if [ "$#" -gt 0 ]; then
  query_number="$1"
else
  printf "Enter query number (1-%s): " "$QUERY_COUNT"
  read -r query_number
fi

case "$query_number" in
  1|2|3|4|5|6|7|8|9)
    query_file="$(dirname "$0")/queries/query_$(printf "%02d" "$query_number").sql"
    ;;
  *)
    echo "Query number must be an integer from 1 to $QUERY_COUNT" >&2
    exit 1
    ;;
esac

docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < "$query_file"
