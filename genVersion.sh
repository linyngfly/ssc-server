#!/bin/bash
rm -f version.js
git rev-list HEAD | sort > config.git-hash
LOCALVER=`wc -l config.git-hash | awk '{print $1}'`
if [ $LOCALVER \> 1 ] ; then
    VER=`git rev-list origin/master | sort | join config.git-hash - | wc -l | awk '{print $1}'`
    if [ $VER != $LOCALVER ] ; then
        VER="$VER+$(($LOCALVER-$VER))"
        echo "11111 "$VER
    fi
    if git status | grep -q "modified:" ; then
        VER="${VER}"
        echo "2222 "$VER
    fi
    VER="$VER $(git rev-list HEAD -n 1 | cut -c 1-7)"
            echo "3333 "$VER
    GIT_VERSION=$VER
else
    GIT_VERSION=
    VER="x"
fi
rm -f config.git-hash

cat version.js.template | sed "s/\$FULL_VERSION/$GIT_VERSION/g" > version.js
 
echo "Generated version.js  "$GIT_VERSION