#!/bin/sh

set -eu

docker compose up -d --build --wait

printf '\nJenkins готов к работе: http://localhost:8080\n'
