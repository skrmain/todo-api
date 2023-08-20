#!/bin/bash

REPO=skrmain/expressjs-todo-api

echo "Builing : ${REPO}"
docker build -t $REPO .

echo '------'
docker images | grep "${REPO}"
echo '------'

echo "Enter Version no. : "
read VERSION

docker tag $REPO:latest $REPO:$VERSION

echo '------'
docker images | grep "${REPO}"
echo '------'

echo "Enter 'y' to confirm push"
read confirm

if [[ $confirm = 'y' ]]
then
echo 'Pushing'
docker push $REPO:latest
docker push $REPO:$VERSION
echo 'Pushed'
fi

