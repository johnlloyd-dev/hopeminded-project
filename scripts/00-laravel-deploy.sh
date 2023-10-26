#!/usr/bin/env bash
echo "Running composer"
composer clearcache
composer selfupdate
composer global require hirak/prestissimo
composer update

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force
php artisan db::seed

echo "done deploying commands"
