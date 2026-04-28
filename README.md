# Eloquente Catering System (ECS)

A full-stack catering booking and management system built with Laravel 12, Inertia.js, and React.

## Tech Stack

- **Backend:** Laravel 12, PHP 8.2
- **Frontend:** React 19, Inertia.js, Tailwind CSS
- **Database:** SQLite
- **Build Tool:** Vite 7

## Prerequisites

- [XAMPP](https://www.apachefriends.org/) (includes PHP 8.2+)
- [Node.js](https://nodejs.org/) (v18+)
- [Composer](https://getcomposer.org/)

> Make sure `C:\xampp\php` is added to your system PATH.

## Getting Started

### 1. Install dependencies

```bash
composer install
npm install
```

### 2. Set up the environment

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### 3. Run the development server

```bash
composer run dev
```

This starts the following services concurrently:

| Service         | URL                        |
|-----------------|----------------------------|
| Laravel Server  | http://127.0.0.1:8080      |
| Vite Dev Server | http://localhost:5173       |
| Queue Worker    | Background process         |

### 4. Open the website

Visit **http://127.0.0.1:8080** in your browser.

## Features

- Landing page with hero carousel
- User registration and login
- Multi-step event booking system
- Menu browsing with best-seller highlights
- Admin dashboard with analytics
- Superadmin employee management

## License

This project is proprietary software for Eloquente Catering.
