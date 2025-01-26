# cd /var/www/kerben/office-web && git pull && yarn install && yarn build

yarn build
ssh besoftkg "rm -rf /var/www/kerben/office-web/dist"
scp -r ./dist besoftkg:/var/www/kerben/office-web
ssh besoftkg "cd /var/www/kerben && cp td.html ./office-web/dist"
