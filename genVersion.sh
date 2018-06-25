#!/bin/bash

MAJOR=1
MINOR=0
REVISION=0
RADIX=100

git rev-list HEAD | sort > config.git-hash
LOCALVER=`wc -l config.git-hash | awk '{print $1}'`
VER_LINE=${LOCALVER}
PUB_TIME=`date +%Y-%m-%d_%H:%M:%S`
PUB_TIME=\'${PUB_TIME}\'
echo PUB_TIME=$PUB_TIME
if [ $LOCALVER \> 1 ] ; then
    VER=`git rev-list origin/master | sort | join config.git-hash - | wc -l | awk '{print $1}'`
    if [ $VER != $LOCALVER ] ; then
        VER="$VER+$(($LOCALVER-$VER))"
    fi
    if git status | grep -q "modified:" ; then
        VER="${VER}"
    fi
    #VER="$VER $(git rev-list HEAD -n 1 | cut -c 1-7)"
    GIT_VERSION=$VER

else
    GIT_VERSION=
    VER="0"
fi

GIT_HASH_VERSION=`sed -n ${VER_LINE}p config.git-hash`
GIT_HASH_VERSION=\'$GIT_HASH_VERSION\'
echo GIT_HASH_VERSION=$GIT_HASH_VERSION

MINOR=$[$GIT_VERSION/$RADIX]
REVISION=$[$GIT_VERSION%$RADIX]
GIT_VERSION=$MAJOR.$MINOR.$REVISION
GIT_VERSION=\'$GIT_VERSION\'
echo GIT_VERSION=$GIT_VERSION

rm -f config.git-hash

#cat config/versions.js.template | sed "s/\$GIT_VERSION/$GIT_VERSION/g" > config/versions.js.template1
#cat config/versions.js.template1 | sed "s/\11/$PUB_TIME/g" > config/versions.js

sed -i "/PUB_VERSION_TIME:/s/PUB_VERSION_TIME:[-_:'0-9]*/PUB_VERSION_TIME:$PUB_TIME/g" config/versions.js
sed -i "/const GIT_HASH_VERSION=/s/=[a-z0-9'']*/=$GIT_HASH_VERSION/g" config/versions.js  
sed -i "/PUB_VERSION_NO:/s/PUB_VERSION_NO:[.0-9']*/PUB_VERSION_NO:$GIT_VERSION/g" config/versions.js  
echo "Generated version finish  "