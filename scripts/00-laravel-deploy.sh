#!/usr/bin/env bash
echo "Running composer"
composer self-update 2.1.14
composer global require hirak/prestissimo
composer install --no-dev --working-dir=/var/www/html

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force
php artisan db::seed

echo "Cleaning Cache..."
npm cache clean --force

echo "npm install"
npm install

echo "npm run build"
npm run build

echo "done deploying"