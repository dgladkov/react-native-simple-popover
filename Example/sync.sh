#!/bin/sh
TARGET="node_modules/react-native-simple-popover"

if [ "$1" = "--clean" ]; then
    rm -rf "$TARGET"
fi

rsync -r \
--exclude .git/ \
--exclude package-lock.json \
--exclude .npmignore \
--filter=':- .npmignore' \
.. "$TARGET"
