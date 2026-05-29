docker compose up -d						Развертывание контейнера бд

docker compose --profile backend --profile frontend up -d 	Развертывание контейнеров бд, фронт, бэк

sudo docker start trains_db trains_backend trains_frontend	Запуск контейнеров бд, бэк, фронт

sudo docker stop trains_db trains_backend trains_frontend	Остановка контейнеров бд, бэк, фронт

docker compose --profile backend --profile frontend down -v 	Остановить и удалить все контейнеры