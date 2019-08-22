#!/bin/sh

# chmod +x ./scripts/docs.sh

workspace=$(dirname $(cd $(dirname $0); pwd;));

build() {
  cd $workspace/docs-md/zh-cn

  ydoc build
}

serve() {
  cd $workspace/docs-md/zh-cn

  ydoc serve
}

case $1 in
  build) build
  ;;
  serve) serve
  ;;
esac
