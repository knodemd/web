#!/bin/sh
# Install the knode command: the Knode CLI, the MCP server and Knode Service.
#
#   curl -fsSL https://knode.md/install.sh | sh
#
# It downloads the archive for this system from the Knode release on GitHub, checks it
# against the release's SHA256SUMS and puts `knode` in ~/.local/bin. It never asks for
# root unless you set KNODE_USE_SUDO=1.
#
# Settings, as environment variables:
#   KNODE_VERSION       Version to install, for example 0.2.0 (default: the latest release)
#   KNODE_INSTALL_DIR   Where to put knode (default: ~/.local/bin)
#   KNODE_USE_SUDO      Set to 1 to use sudo when the install directory is not writable
#   KNODE_LIBC          On Linux, gnu or musl to pick that build (default: musl on musl
#                       systems such as Alpine and on glibc older than 2.35, else gnu)
#   KNODE_RELEASES_URL  Where releases are downloaded from
#                       (default: https://github.com/knodemd/knode/releases)
#
# For example: curl -fsSL https://knode.md/install.sh | KNODE_VERSION=0.2.0 sh
#
# Source: https://github.com/knodemd/web/blob/main/public/install.sh
# Licence: Apache-2.0

# Everything runs from main, at the end, so a partly downloaded script does nothing.

set -eu

say() {
  printf 'knode: %s\n' "$*"
}

fail() {
  printf 'knode: error: %s\n' "$*" >&2
  exit 1
}

usage() {
  cat <<'USAGE'
Install the knode command from its GitHub release.

  curl -fsSL https://knode.md/install.sh | sh

Settings, as environment variables:
  KNODE_VERSION       Version to install, for example 0.2.0 (default: the latest release)
  KNODE_INSTALL_DIR   Where to put knode (default: ~/.local/bin)
  KNODE_USE_SUDO      Set to 1 to use sudo when the install directory is not writable
  KNODE_LIBC          On Linux, gnu or musl to pick that build (default: musl on musl
                      systems such as Alpine and on glibc older than 2.35, else gnu)
  KNODE_RELEASES_URL  Where releases are downloaded from
                      (default: https://github.com/knodemd/knode/releases)
USAGE
}

need() {
  command -v "$1" >/dev/null 2>&1 || fail "this script needs '$1', which was not found"
}

# Download $1 to the file $2.
download() {
  if command -v curl >/dev/null 2>&1; then
    case "$1" in
      https://*) curl --proto '=https' --tlsv1.2 -fsSL --retry 3 -o "$2" "$1" ;;
      *) curl -fsSL --retry 3 -o "$2" "$1" ;;
    esac
  elif command -v wget >/dev/null 2>&1; then
    wget -q -O "$2" "$1"
  else
    fail "this script needs curl or wget"
  fi
}

# The tag of the latest release, read from where /releases/latest redirects to.
latest_tag() {
  url="$RELEASES_URL/latest"
  if command -v curl >/dev/null 2>&1; then
    case "$url" in
      https://*) final="$(curl --proto '=https' --tlsv1.2 -fsSL --retry 3 -o /dev/null -w '%{url_effective}' "$url")" ;;
      *) final="$(curl -fsSL --retry 3 -o /dev/null -w '%{url_effective}' "$url")" ;;
    esac
  elif command -v wget >/dev/null 2>&1; then
    final="$(wget -q -S -O /dev/null "$url" 2>&1 | sed -n 's/^ *[Ll]ocation: *//p' | tail -n 1 | tr -d '\r')"
  else
    fail "this script needs curl or wget"
  fi
  tag="${final##*/}"
  case "$tag" in
    v[0-9]*) printf '%s\n' "$tag" ;;
    *) fail "could not find the latest release at $url (set KNODE_VERSION to pick one)" ;;
  esac
}

# The release target for this system, for example x86_64-unknown-linux-gnu.
detect_target() {
  os="$(uname -s)"
  arch="$(uname -m)"

  case "$arch" in
    x86_64 | amd64) arch=x86_64 ;;
    aarch64 | arm64) arch=aarch64 ;;
    *) fail "there is no knode build for $arch yet (x86_64 and arm64 are supported)" ;;
  esac

  case "$os" in
    Linux)
      libc="$(linux_libc)" || exit 1
      printf '%s\n' "$arch-unknown-linux-$libc"
      ;;
    Darwin)
      # A shell running under Rosetta reports x86_64 on Apple silicon.
      if [ "$arch" = x86_64 ] && [ "$(sysctl -n sysctl.proc_translated 2>/dev/null || echo 0)" = 1 ]; then
        arch=aarch64
      fi
      printf '%s\n' "$arch-apple-darwin"
      ;;
    *) fail "there is no knode build for $os yet (Linux and macOS are supported)" ;;
  esac
}

# The oldest glibc the gnu builds run on: they are built on Ubuntu 22.04.
GLIBC_MIN_MAJOR=2
GLIBC_MIN_MINOR=35

# Which Linux build to use: gnu, or the static musl build on musl systems and on glibc
# older than the gnu builds need. KNODE_LIBC picks one by hand.
linux_libc() {
  case "${KNODE_LIBC:-}" in
    gnu | musl)
      printf '%s\n' "$KNODE_LIBC"
      return
      ;;
    "") ;;
    *) fail "KNODE_LIBC must be gnu or musl, not '$KNODE_LIBC'" ;;
  esac
  if is_musl; then
    printf 'musl\n'
    return
  fi
  glibc="$(glibc_version)"
  if [ -n "$glibc" ]; then
    major="${glibc%%.*}"
    minor="${glibc#*.}"
    minor="${minor%%.*}"
    if [ "$major" -lt "$GLIBC_MIN_MAJOR" ] ||
      { [ "$major" -eq "$GLIBC_MIN_MAJOR" ] && [ "$minor" -lt "$GLIBC_MIN_MINOR" ]; }; then
      printf 'musl\n'
      return
    fi
  fi
  printf 'gnu\n'
}

# The glibc version, such as 2.35, or nothing when it cannot be found.
glibc_version() {
  version="$(getconf GNU_LIBC_VERSION 2>/dev/null | sed -n 's/^glibc \([0-9][0-9]*\.[0-9][0-9]*\).*/\1/p')"
  if [ -z "$version" ] && command -v ldd >/dev/null 2>&1; then
    version="$(ldd --version 2>/dev/null | sed -n '1s/.* \([0-9][0-9]*\.[0-9][0-9]*\)$/\1/p')"
  fi
  printf '%s\n' "$version"
}

is_musl() {
  if command -v ldd >/dev/null 2>&1 && ldd --version 2>&1 | grep -qi musl; then
    return 0
  fi
  for loader in /lib/ld-musl-*; do
    [ -e "$loader" ] && return 0
  done
  return 1
}

sha256_of() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | cut -d ' ' -f 1
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$1" | cut -d ' ' -f 1
  elif command -v openssl >/dev/null 2>&1; then
    openssl dgst -sha256 -r "$1" | cut -d ' ' -f 1
  else
    fail "this script needs sha256sum, shasum or openssl to check the download"
  fi
}

# Print how to add $1 to PATH for the user's shell.
path_advice() {
  say "$1 is not in your PATH. Add it, then open a new terminal:"
  line="export PATH=\"$1:\$PATH\""
  case "$(basename "${SHELL:-sh}")" in
    fish)
      printf '\n  fish_add_path %s\n\n' "$1"
      return
      ;;
    zsh) rc="\$HOME/.zshrc" ;;
    bash)
      if [ "$(uname -s)" = Darwin ]; then rc="\$HOME/.bash_profile"; else rc="\$HOME/.bashrc"; fi
      ;;
    *) rc="\$HOME/.profile" ;;
  esac
  printf "\n  echo '%s' >> %s\n\n" "$line" "$rc"
}

main() {
  case "${1:-}" in
    -h | --help)
      usage
      exit 0
      ;;
    "") ;;
    *) fail "unknown option '$1' (settings are environment variables, see --help)" ;;
  esac

  need uname
  need tar
  need mktemp

  RELEASES_URL="${KNODE_RELEASES_URL:-https://github.com/knodemd/knode/releases}"
  RELEASES_URL="${RELEASES_URL%/}"
  install_dir="${KNODE_INSTALL_DIR:-${HOME:?HOME is not set}/.local/bin}"

  target="$(detect_target)"

  if [ -n "${KNODE_VERSION:-}" ]; then
    tag="v${KNODE_VERSION#v}"
  else
    tag="$(latest_tag)"
  fi
  case "$tag" in
    v[0-9]*.[0-9]*.[0-9]*) ;;
    *) fail "'$tag' is not a version like 0.2.0" ;;
  esac
  case "$tag" in
    *[!0-9A-Za-z.-]*) fail "'$tag' is not a version like 0.2.0" ;;
  esac

  asset="knode-$tag-$target.tar.gz"
  base="$RELEASES_URL/download/$tag"

  tmp="$(mktemp -d 2>/dev/null || mktemp -d -t knode)"
  # shellcheck disable=SC2064 # expand $tmp now, it is fixed from here on
  trap "rm -rf '$tmp'" EXIT
  trap 'exit 130' INT
  trap 'exit 143' TERM

  say "installing knode ${tag#v} for $target"
  download "$base/$asset" "$tmp/$asset" || fail "could not download $base/$asset"
  download "$base/SHA256SUMS" "$tmp/SHA256SUMS" || fail "could not download $base/SHA256SUMS"

  expected="$(awk -v f="$asset" '{ n = $2; sub(/^\*/, "", n) } n == f { print $1; exit }' "$tmp/SHA256SUMS")"
  [ -n "$expected" ] || fail "$asset is not listed in SHA256SUMS"
  actual="$(sha256_of "$tmp/$asset")"
  [ "$expected" = "$actual" ] || fail "checksum mismatch for $asset (expected $expected, got $actual)"
  say "checksum verified"

  mkdir "$tmp/unpacked"
  tar -xzf "$tmp/$asset" -C "$tmp/unpacked" || fail "could not unpack $asset"
  [ -f "$tmp/unpacked/knode" ] || fail "$asset does not contain knode"
  chmod 755 "$tmp/unpacked/knode"

  sudo=""
  if ! mkdir -p "$install_dir" 2>/dev/null || [ ! -w "$install_dir" ]; then
    if [ "${KNODE_USE_SUDO:-0}" = 1 ]; then
      need sudo
      sudo=sudo
      $sudo mkdir -p "$install_dir"
    else
      fail "cannot write to $install_dir; pick another with KNODE_INSTALL_DIR, or set KNODE_USE_SUDO=1"
    fi
  fi

  # Copy next to the destination and rename, so a running knode is replaced in one step.
  $sudo cp "$tmp/unpacked/knode" "$install_dir/.knode.tmp.$$"
  $sudo chmod 755 "$install_dir/.knode.tmp.$$"
  $sudo mv -f "$install_dir/.knode.tmp.$$" "$install_dir/knode"

  version_line="$("$install_dir/knode" --version 2>/dev/null)" ||
    fail "installed $install_dir/knode, but it does not run on this system"
  say "installed $version_line to $install_dir/knode"

  case ":${PATH:-}:" in
    *":$install_dir:"*)
      found="$(command -v knode 2>/dev/null || true)"
      if [ -n "$found" ] && [ "$found" != "$install_dir/knode" ]; then
        say "note: $found comes first in your PATH, so 'knode' runs that one"
      fi
      ;;
    *) path_advice "$install_dir" ;;
  esac

  say "next: knode connect claude-code (or codex, gemini, claude-desktop)"
}

main "$@"
