<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::prefix('payments')->middleware('auth:api')->group(function () {
    Route::post('/', [PaymentController::class, 'store']);
    Route::get('/bakong/{payment}/check', [PaymentController::class, 'checkBakong']);
    Route::post('/{payment}/cancel', [PaymentController::class, 'cancel']);
});

Route::middleware(['auth:api','role:admin'])->prefix('admin')->group(function(){
    // CATEGORY
    Route::apiResource('categories', CategoryController::class);

    // PRODUCT
    Route::apiResource('products', ProductController::class);

    // CART
    Route::apiResource('carts', CartController::class)
        ->only(['index', 'store', 'show']);

    // CART ITEMS
    Route::apiResource('cart-items', CartItemController::class)
        ->only(['store', 'update', 'destroy']);

    // CHECKOUT
    Route::post('carts/{cart}/checkout', [CartController::class, 'checkout']);

    // SALE
    Route::apiResource('sales', SaleController::class);
});
