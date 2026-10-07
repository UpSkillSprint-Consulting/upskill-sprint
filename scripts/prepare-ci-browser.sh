#!/usr/bin/env bash
set -euo pipefail

case "${1:-}" in
  chromium|webkit) browser="$1" ;;
  *) printf 'Usage: %s {chromium|webkit}\n' "$0" >&2; exit 2 ;;
esac

# The hosted Ubuntu mirror stalled before browser tests could start.
# Keep the runner's signed package sources, using Ubuntu's primary HTTPS archive.
if [[ -f /etc/apt/apt-mirrors.txt ]]; then
  sudo sed -i 's|http://azure.archive.ubuntu.com/ubuntu|https://archive.ubuntu.com/ubuntu|g' /etc/apt/apt-mirrors.txt
fi

# Bound connection and transfer stalls so CI reports an actionable failure.
sudo tee /etc/apt/apt.conf.d/80-ci-network-timeouts >/dev/null <<'APT_CONFIG'
Acquire::http::Timeout "30";
Acquire::https::Timeout "30";
Acquire::Retries "2";
APT_CONFIG

python -m pip install playwright==1.57.0
python -m playwright install --with-deps "$browser"
