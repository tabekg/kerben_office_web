# cd /var/www/kerben/office-web && git pull && yarn install && yarn build

yarn build
ssh besoft "rm -rf /var/www/kerben/office-web/dist"
scp -r ./dist besoft:/var/www/kerben/office-web
#ssh besoft "cd /var/www/kerben && cp td.html ./office-web/dist"
