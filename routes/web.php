<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ClientDashboardController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\FoodTastingController;
use App\Http\Controllers\OpsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Ported from: server/index.js
| All routes translated from Express API to Laravel Inertia routes.
| Page names match the original client/src file structure.
|--------------------------------------------------------------------------
*/

// ─── Public Routes ───

Route::get('/', fn () => Inertia::render('LandingPage'))->name('home');
Route::get('/about', fn () => Inertia::render('About'))->name('about');
Route::get('/contact', fn () => Inertia::render('Contact'))->name('contact');

Route::middleware('guest')->group(function () {
    Route::get('/login', fn () => Inertia::render('Login'))->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', fn () => Inertia::render('Register'))->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Public pricing endpoint (used by menu components)
Route::get('/api/pricing', [AdminController::class, 'getPricingOverrides']);

// Public custom menu items endpoint (used by menu components to merge with static catalog)
Route::get('/api/menu-items', [AdminController::class, 'getMenuItems']);

// Public food tasting (guests can submit without auth)
Route::post('/api/food-tasting', [FoodTastingController::class, 'store']);

// Booking availability is public (calendar needs it without auth sometimes)
Route::get('/api/bookings/availability/{date}', [BookingController::class, 'checkAvailability']);

// ─── Client Routes ───

// Public Views (Client Side)
Route::get('/book', fn () => Inertia::render('client/BookingWizard'))->name('booking.wizard');
Route::get('/menu', fn () => Inertia::render('client/MenuGallery'))->name('menu.gallery');
Route::get('/food-tasting', fn () => Inertia::render('client/FoodTasting'))->name('food-tasting');

Route::middleware(['auth', 'role:Client'])->group(function () {
    // Dashboard — renders original ClientDashboard.jsx which fetches via API
    Route::get('/dashboard/client', fn () => Inertia::render('client/ClientDashboard'))->name('dashboard.client');
    Route::get('/pay', fn () => Inertia::render('client/PaymentPage'))->name('payment.page');

    // Dashboard data API (used by original ClientDashboard.jsx fetch calls)
    Route::get('/api/dashboard/client', [ClientDashboardController::class, 'apiData']);

    // Booking API endpoints (JSON responses for React AJAX calls)
    Route::post('/api/bookings', [BookingController::class, 'store']);
    Route::put('/api/bookings/{id}/event-details', [BookingController::class, 'updateEventDetails']);
    Route::put('/api/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    Route::put('/api/bookings/{id}/update', [BookingController::class, 'update']);
    Route::post('/api/bookings/pay', [BookingController::class, 'recordPayment']);

    // Food tasting (authenticated)
    Route::get('/api/food-tasting', [FoodTastingController::class, 'index']);

    // File upload
    Route::post('/api/upload', [FileUploadController::class, 'store']);
});

// ─── Ops Routes (Marketing + Admin) ───

Route::middleware(['auth', 'role:Marketing,Admin'])->group(function () {
    Route::get('/dashboard/ops', fn () => Inertia::render('DashboardOps'))->name('dashboard.ops');
    Route::get('/api/ops/bookings', [OpsController::class, 'getAllBookings']);
    Route::put('/api/ops/bookings/{id}/status', [OpsController::class, 'updateStatus']);
    Route::put('/api/ops/bookings/{id}/livestatus', [OpsController::class, 'updateLiveStatus']);
    Route::get('/api/ops/bookings/{id}', [OpsController::class, 'show']);
});

// ─── Finance Routes (Accounting) ───

Route::middleware(['auth', 'role:Accounting'])->group(function () {
    Route::get('/dashboard/finance', fn () => Inertia::render('DashboardFinance'))->name('dashboard.finance');
    Route::get('/api/finance/bookings', [FinanceController::class, 'getBookingsWithPayments']);
    Route::get('/api/finance/payments/pending', [FinanceController::class, 'getPendingPayments']);
    Route::put('/api/finance/payments/{id}/verify', [FinanceController::class, 'verifyPayment']);
    Route::put('/api/finance/payments/{id}', [FinanceController::class, 'updatePayment']);
    Route::get('/api/finance/ledger', [FinanceController::class, 'getLedger']);
    Route::post('/api/finance/remind/{paymentId}', [FinanceController::class, 'remindClient']);
    Route::get('/api/finance/refunds/queue', [FinanceController::class, 'getRefundQueue']);
    Route::post('/api/finance/refund/{bookingId}', [FinanceController::class, 'processRefund']);
});

// ─── Admin Routes ───

Route::middleware(['auth', 'role:Admin'])->group(function () {
    Route::get('/dashboard/admin', fn () => Inertia::render('DashboardAdmin'))->name('dashboard.admin');
    Route::get('/api/admin/employees', [AdminController::class, 'getEmployees']);
    Route::post('/api/admin/employees', [AdminController::class, 'createEmployee']);
    Route::put('/api/admin/employees/{id}', [AdminController::class, 'updateEmployee']);
    Route::delete('/api/admin/employees/{id}', [AdminController::class, 'deleteEmployee']);
    Route::post('/api/admin/pricing', [AdminController::class, 'updatePricingOverride']);
    Route::post('/api/admin/bookings/{id}/discount', [AdminController::class, 'applyDiscount']);
    Route::get('/api/admin/analytics', [AdminController::class, 'getAnalytics']);

    // Menu items CRUD
    Route::post('/api/admin/menu-items', [AdminController::class, 'createMenuItem']);
    Route::put('/api/admin/menu-items/{id}', [AdminController::class, 'updateMenuItem']);
    Route::delete('/api/admin/menu-items/{id}', [AdminController::class, 'deleteMenuItem']);
});
