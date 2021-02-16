#!/bin/bash

cd rocket-twilio-aws-infrastructure
npm run build || exit
cd ..

cd lambdas/webhookLambda || exit
npm install
npm run build || exit
npm prune --production

cd ../twilioCallerLambda || exit
npm install
npm run build || exit
npm prune --production
cd ../..

rm -rf ./temp
mkdir ./temp

cp -R ./lambdas/webhookLambda/lib/* ./temp
cp -R ./lambdas/webhookLambda/package.json ./temp
cp -R ./lambdas/webhookLambda/node_modules ./temp

cd ./temp
zip -r ../webhookLambda.zip *
cd ..

rm -rf ./temp
mkdir ./temp

cp -R ./lambdas/twilioCallerLambda/lib/* ./temp
cp -R ./lambdas/twilioCallerLambda/package.json ./temp
cp -R ./lambdas/twilioCallerLambda/node_modules ./temp

cd ./temp
zip -r ../makeCallLambda.zip *
cd ..

mkdir ./rocket-twilio-aws-infrastructure/lib/lambdas
cp webhookLambda.zip ./rocket-twilio-aws-infrastructure/lib/lambdas
cp makeCallLambda.zip ./rocket-twilio-aws-infrastructure/lib/lambdas


cd rocket-twilio-aws-infrastructure || exit
npm run release
cd ..

cd rocket-twilio-aws-runtime || exit
npm run release
cd ..

cd ./lambdas/webhookLambda || exit
npm install
cd ../../


cd ./lambdas/twilioCallerLambda || exit
npm install
cd ../../

rm -rf ./temp
rm -rf ./makeCallLambda.zip
rm -rf ./webhookLambda.zip
cd  ..

cd ./twiliosample
rm -rf ./node_modules
rm -rf package-lock.json
npm install

if [[ $1 == D ]]; then
  boost deploy -e production
fi