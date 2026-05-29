# Train Management System

Веб-приложение для управления железнодорожными перевозками.

## Возможности

* Авторизация и регистрация пользователей
* JWT-аутентификация
* Разделение ролей:
  * USER
  * WORKER
  * ADMIN
* Управление:
  * поездами
  * вагонами
  * местами
  * маршрутами
  * станциями
  * расписанием
  * билетами
* Покупка билетов
* Проверка занятости мест
* Встроенный чат комментариев
* Статистика
* Swagger документация API
* Docker контейнеризация

---

# Технологии

## Backend

* Java 21
* Spring Boot
* Spring Security
* JWT
* PostgreSQL
* Maven
* JUnit + Mockito

## Frontend

* React
* Vite
* React Router
* CSS Modules
* React Toastify

## DevOps

* Docker
* Docker Compose

---

# Роли пользователей

## USER

* Просмотр расписания
* Покупка билетов
* Просмотр своих билетов
* Комментарии

## WORKER

* Управление справочниками
* Работа с расписанием
* Просмотр статистики

## ADMIN

* Полный доступ
* Удаление сущностей
* Управление пользователями

---

# Swagger

Swagger UI:

http://localhost:8080/swagger-ui/index.html

---

# Запуск проекта

## Только база данных

docker compose up -d

## Полный запуск (БД + Backend + Frontend)

docker compose --profile backend --profile frontend up -d

---

# Управление контейнерами

## Запуск контейнеров

sudo docker start trains_db trains_backend trains_frontend

## Остановка контейнеров

sudo docker stop trains_db trains_backend trains_frontend

## Полное удаление контейнеров

docker compose --profile backend --profile frontend down -v

---

# Сборка backend jar

Перед сборкой должен быть запущен контейнер базы данных.

./mvnw clean package -DskipTests

После сборки jar-файл появится в папке:

target/

---

# Тестирование

Запуск тестов:

./mvnw test

Реализованы unit-тесты для:

* ScheduleService
* TicketService

---

# Docker

* PostgreSQL
* Spring Boot backend
* React frontend

Используется Docker Compose с profiles.