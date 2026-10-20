#!/bin/sh
# Tests public/install.sh against a fake release served from a local HTTP server.
#
#   sh scripts/test-install.sh
#
# The fake release has small shell scripts in place of the knode binary, so nothing is
# downloaded from GitHub. `uname` is replaced to act as Linux or macOS on any arch, and
# `ldd` and `getconf` to act as a musl system or as any glibc version.
# Needs python3 for the server. Uses dash, bash, wget and shellcheck when they are installed.

set -eu

root="$(cd "$(dirname "$0")/.." && pwd)"
script="$root/public/install.sh"
work="$(mktemp -d 2>/dev/null || mktemp -d -t knode-install-test)"
server_pid=""
cleanup() {
  if [ -n "$server_pid" ]; then
    kill "$server_pid" 2>/dev/null || true
    wait "$server_pid" 2>/dev/null || true
  fi
  rm -rf "$work"
}
trap cleanup EXIT

passed=0
failed=0
ok() { passed=$((passed + 1)); printf 'ok    %s\n' "$1"; }
not_ok() { failed=$((failed + 1)); printf 'FAIL  %s\n' "$1"; sed 's/^/      /' "$work/out" 2>/dev/null || true; }

sha256() {
  if command -v sha256sum >/dev/null 2>&1; then sha256sum "$@"; else shasum -a 256 "$@"; fi
}

# A release: one archive per target, each holding a fake knode, and SHA256SUMS.
make_release() {
  version="$1"
  dir="$work/releases/download/v$version"
  mkdir -p "$dir"
  for target in x86_64-unknown-linux-gnu aarch64-unknown-linux-gnu \
    x86_64-unknown-linux-musl aarch64-unknown-linux-musl \
    x86_64-apple-darwin aarch64-apple-darwin; do
    stage="$work/stage/$version-$target"
    mkdir -p "$stage"
    printf '#!/bin/sh\necho "knode %s %s"\n' "$version" "$target" > "$stage/knode"
    chmod 755 "$stage/knode"
    : > "$stage/LICENSE"
    : > "$stage/NOTICE"
    : > "$stage/README.md"
    tar -C "$stage" -czf "$dir/knode-v$version-$target.tar.gz" knode LICENSE NOTICE README.md
  done
  (cd "$dir" && sha256 knode-*.tar.gz > SHA256SUMS)
}

make_release 0.2.0
make_release 0.1.0
make_release 0.0.9
# 0.0.9 has a checksum that does not match its archive.
awk '{ print "0000000000000000000000000000000000000000000000000000000000000000  " $2 }' \
  "$work/releases/download/v0.0.9/SHA256SUMS" > "$work/sums"
mv "$work/sums" "$work/releases/download/v0.0.9/SHA256SUMS"

# A server like GitHub: /releases/latest redirects to /releases/tag/v0.2.0.
cat > "$work/server.py" <<'PY'
import http.server, os, sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.rstrip("/") == "/releases/latest":
            self.send_response(302)
            self.send_header("Location", "/releases/tag/v0.2.0")
            self.end_headers()
        elif self.path.startswith("/releases/tag/"):
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"release page")
        else:
            super().do_GET()

    def log_message(self, *args):
        pass

os.chdir(sys.argv[1])
server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
with open(sys.argv[2], "w") as f:
    f.write(str(server.server_port))
server.serve_forever()
PY
python3 "$work/server.py" "$work" "$work/port" 2> "$work/server.log" &
server_pid=$!
i=0
while [ ! -s "$work/port" ]; do
  i=$((i + 1))
  if [ "$i" -gt 300 ] || ! kill -0 "$server_pid" 2>/dev/null; then
    echo "the test server did not start"
    cat "$work/server.log"
    exit 1
  fi
  sleep 0.1
done
releases="http://127.0.0.1:$(cat "$work/port")/releases"

# uname that reports $FAKE_OS and $FAKE_ARCH.
mkdir -p "$work/shims"
real_uname="$(command -v uname)"
cat > "$work/shims/uname" <<SH
#!/bin/sh
case "\${1:-}" in
  -s) echo "\${FAKE_OS:-Linux}" ;;
  -m) echo "\${FAKE_ARCH:-x86_64}" ;;
  *) exec "$real_uname" "\$@" ;;
esac
SH
chmod 755 "$work/shims/uname"

# ldd that acts like musl's (FAKE_LDD=musl) or glibc's (FAKE_LDD=2.31), or fails.
cat > "$work/shims/ldd" <<'SH'
#!/bin/sh
case "${FAKE_LDD:-}" in
  musl)
    printf 'musl libc (x86_64)\nVersion 1.2.5\n' >&2
    exit 1
    ;;
  "") exit 1 ;;
  *) printf 'ldd (GNU libc) %s\nCopyright (C) Free Software Foundation, Inc.\n' "$FAKE_LDD" ;;
esac
SH
chmod 755 "$work/shims/ldd"

# getconf that reports glibc $FAKE_GLIBC, or fails as on musl.
real_getconf="$(command -v getconf 2>/dev/null || echo false)"
cat > "$work/shims/getconf" <<SH
#!/bin/sh
if [ "\${1:-}" = GNU_LIBC_VERSION ]; then
  [ -n "\${FAKE_GLIBC:-}" ] || exit 1
  echo "glibc \$FAKE_GLIBC"
  exit 0
fi
exec "$real_getconf" "\$@"
SH
chmod 755 "$work/shims/getconf"

# run NAME OS ARCH [VAR=value ...]: runs the installer into a fresh directory.
run() {
  name="$1" os="$2" arch="$3"
  shift 3
  dest="$work/bin-$name"
  rm -rf "$dest"
  env PATH="$work/shims:$PATH" FAKE_OS="$os" FAKE_ARCH="$arch" HOME="$work/home" \
    SHELL=/bin/zsh KNODE_RELEASES_URL="$releases" KNODE_INSTALL_DIR="$dest" "$@" \
    "$shell" "$script" > "$work/out" 2>&1
}

for shell in sh dash bash; do
  command -v "$shell" >/dev/null 2>&1 || continue
  echo "# $shell"

  if run latest-linux-x64 Linux x86_64 && [ "$("$dest/knode")" = "knode 0.2.0 x86_64-unknown-linux-gnu" ] &&
    grep -q 'checksum verified' "$work/out"; then
    ok "latest release on Linux x86_64"
  else not_ok "latest release on Linux x86_64"; fi

  if run pinned-linux-arm Linux aarch64 KNODE_VERSION=0.1.0 &&
    [ "$("$dest/knode")" = "knode 0.1.0 aarch64-unknown-linux-gnu" ]; then
    ok "KNODE_VERSION=0.1.0 on Linux arm64"
  else not_ok "KNODE_VERSION=0.1.0 on Linux arm64"; fi

  if run v-prefix Linux arm64 KNODE_VERSION=v0.1.0 &&
    [ "$("$dest/knode")" = "knode 0.1.0 aarch64-unknown-linux-gnu" ]; then
    ok "KNODE_VERSION with a v prefix, arm64 spelling"
  else not_ok "KNODE_VERSION with a v prefix, arm64 spelling"; fi

  if run mac-arm Darwin arm64 && [ "$("$dest/knode")" = "knode 0.2.0 aarch64-apple-darwin" ]; then
    ok "latest release on macOS Apple silicon"
  else not_ok "latest release on macOS Apple silicon"; fi

  if run mac-intel Darwin x86_64 && [ "$("$dest/knode")" = "knode 0.2.0 x86_64-apple-darwin" ] ||
    [ "$(sysctl -n sysctl.proc_translated 2>/dev/null || echo 0)" = 1 ]; then
    ok "latest release on macOS Intel"
  else not_ok "latest release on macOS Intel"; fi

  if run path-advice Linux x86_64 && grep -q 'is not in your PATH' "$work/out" &&
    grep -q "export PATH=\"$dest:\$PATH\"" "$work/out"; then
    ok "PATH advice when the directory is not in PATH"
  else not_ok "PATH advice when the directory is not in PATH"; fi

  dest="$work/bin-in-path"
  if run in-path Linux x86_64 PATH="$work/bin-in-path:$work/shims:$PATH" &&
    ! grep -q 'is not in your PATH' "$work/out"; then
    ok "no PATH advice when the directory is in PATH"
  else not_ok "no PATH advice when the directory is in PATH"; fi

  if run upgrade Linux x86_64 KNODE_VERSION=0.1.0 &&
    env PATH="$work/shims:$PATH" FAKE_OS=Linux FAKE_ARCH=x86_64 HOME="$work/home" \
      KNODE_RELEASES_URL="$releases" KNODE_INSTALL_DIR="$dest" "$shell" "$script" > "$work/out" 2>&1 &&
    [ "$("$dest/knode")" = "knode 0.2.0 x86_64-unknown-linux-gnu" ] &&
    [ "$(ls -A "$dest")" = knode ]; then
    ok "replaces an older knode and leaves no temporary files"
  else not_ok "replaces an older knode and leaves no temporary files"; fi

  if ! run bad-sum Linux x86_64 KNODE_VERSION=0.0.9 && grep -q 'checksum mismatch' "$work/out" &&
    [ ! -e "$dest/knode" ]; then
    ok "refuses an archive whose checksum does not match"
  else not_ok "refuses an archive whose checksum does not match"; fi

  if ! run missing Linux x86_64 KNODE_VERSION=9.9.9 && grep -q 'could not download' "$work/out"; then
    ok "fails clearly for a version that does not exist"
  else not_ok "fails clearly for a version that does not exist"; fi

  if ! run bad-version Linux x86_64 'KNODE_VERSION=1.0;rm' && grep -q 'is not a version' "$work/out"; then
    ok "rejects a malformed version"
  else not_ok "rejects a malformed version"; fi

  if ! run arch Linux i686 && grep -q 'no knode build for i686' "$work/out"; then
    ok "fails clearly on an unsupported arch"
  else not_ok "fails clearly on an unsupported arch"; fi

  if ! run os FreeBSD x86_64 && grep -q 'no knode build for FreeBSD' "$work/out"; then
    ok "fails clearly on an unsupported OS"
  else not_ok "fails clearly on an unsupported OS"; fi

  if run musl Linux x86_64 FAKE_LDD=musl &&
    [ "$("$dest/knode")" = "knode 0.2.0 x86_64-unknown-linux-musl" ]; then
    ok "musl build on a musl system"
  else not_ok "musl build on a musl system"; fi

  if run old-glibc Linux aarch64 FAKE_GLIBC=2.31 FAKE_LDD=2.31 &&
    [ "$("$dest/knode")" = "knode 0.2.0 aarch64-unknown-linux-musl" ]; then
    ok "musl build on glibc 2.31"
  else not_ok "musl build on glibc 2.31"; fi

  if run old-glibc-ldd Linux x86_64 FAKE_LDD=2.17 &&
    [ "$("$dest/knode")" = "knode 0.2.0 x86_64-unknown-linux-musl" ]; then
    ok "musl build on glibc 2.17 found through ldd"
  else not_ok "musl build on glibc 2.17 found through ldd"; fi

  if run glibc-235 Linux x86_64 FAKE_GLIBC=2.35 FAKE_LDD=2.35 &&
    [ "$("$dest/knode")" = "knode 0.2.0 x86_64-unknown-linux-gnu" ]; then
    ok "gnu build on glibc 2.35"
  else not_ok "gnu build on glibc 2.35"; fi

  if run glibc-240 Linux aarch64 FAKE_GLIBC=2.40 &&
    [ "$("$dest/knode")" = "knode 0.2.0 aarch64-unknown-linux-gnu" ]; then
    ok "gnu build on glibc 2.40"
  else not_ok "gnu build on glibc 2.40"; fi

  if run libc-gnu Linux x86_64 FAKE_LDD=musl KNODE_LIBC=gnu &&
    [ "$("$dest/knode")" = "knode 0.2.0 x86_64-unknown-linux-gnu" ]; then
    ok "KNODE_LIBC=gnu picks the gnu build"
  else not_ok "KNODE_LIBC=gnu picks the gnu build"; fi

  if run libc-musl Linux x86_64 FAKE_GLIBC=2.39 KNODE_LIBC=musl &&
    [ "$("$dest/knode")" = "knode 0.2.0 x86_64-unknown-linux-musl" ]; then
    ok "KNODE_LIBC=musl picks the musl build"
  else not_ok "KNODE_LIBC=musl picks the musl build"; fi

  if ! run libc-bad Linux x86_64 KNODE_LIBC=uclibc && grep -q 'KNODE_LIBC must be gnu or musl' "$work/out" &&
    [ ! -e "$dest/knode" ]; then
    ok "rejects an unknown KNODE_LIBC"
  else not_ok "rejects an unknown KNODE_LIBC"; fi

  if run mac-libc Darwin arm64 KNODE_LIBC=musl && [ "$("$dest/knode")" = "knode 0.2.0 aarch64-apple-darwin" ]; then
    ok "KNODE_LIBC does not change the macOS build"
  else not_ok "KNODE_LIBC does not change the macOS build"; fi

  mkdir -p "$work/readonly"
  chmod 555 "$work/readonly"
  if ! run readonly Linux x86_64 KNODE_INSTALL_DIR="$work/readonly/bin" &&
    grep -q 'KNODE_USE_SUDO=1' "$work/out"; then
    ok "does not use sudo when the directory is not writable"
  else not_ok "does not use sudo when the directory is not writable"; fi
  chmod 755 "$work/readonly"

  if run default-dir Linux x86_64 KNODE_INSTALL_DIR= &&
    [ -x "$work/home/.local/bin/knode" ]; then
    ok "installs to ~/.local/bin by default"
  else not_ok "installs to ~/.local/bin by default"; fi
  rm -rf "${work:?}/home"
done

# Without curl: the same install through wget, when wget is installed.
if command -v wget >/dev/null 2>&1; then
  echo "# wget"
  nocurl="$work/nocurl"
  mkdir -p "$nocurl"
  cp "$work/shims/uname" "$nocurl/uname"
  for tool in sh tar gzip mktemp awk cut sha256sum shasum chmod cp mv mkdir rm sed tail tr \
    basename wget cat grep ls; do
    found="$(command -v "$tool" 2>/dev/null || true)"
    [ -n "$found" ] && ln -sf "$found" "$nocurl/$tool"
  done
  dest="$work/bin-wget"
  if env PATH="$nocurl" FAKE_OS=Linux FAKE_ARCH=x86_64 HOME="$work/home" \
    KNODE_RELEASES_URL="$releases" KNODE_INSTALL_DIR="$dest" \
    sh "$script" > "$work/out" 2>&1 &&
    [ "$("$dest/knode")" = "knode 0.2.0 x86_64-unknown-linux-gnu" ]; then
    ok "latest release through wget"
  else not_ok "latest release through wget"; fi
fi

if command -v shellcheck >/dev/null 2>&1; then
  if shellcheck -s sh "$script" "$0" > "$work/out" 2>&1; then
    ok "shellcheck"
  else not_ok "shellcheck"; fi
fi

echo "$passed passed, $failed failed"
[ "$failed" -eq 0 ]
