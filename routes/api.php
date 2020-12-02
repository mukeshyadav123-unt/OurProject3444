<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FavoriteProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::group(['middleware' => 'auth:sanctum'], function () {
    //All secure URL's
    Route::get("me", [UserController::class, 'showMe']);
    Route::delete("me", [UserController::class, 'destroy']);
    Route::put("me", [UserController::class, 'update']);

    Route::group(['prefix' => 'user'], function () {
        Route::get("", [AdminController::class, 'showAll']);
        Route::get("admins", [AdminController::class, 'showAdmins']);

        Route::put("{user}/make-admin", [AdminController::class, 'makeAdmin']);
        Route::get("{user}", [AdminController::class, 'show']);
        Route::post("{user}", [AdminController::class, 'storeUser']);
        Route::delete("{user}", [AdminController::class, 'destroy']);
    });

    Route::group(['prefix' => 'category'], function () {
        Route::get("", [CategoryController::class, 'index']);
        Route::post("", [CategoryController::class, 'store']);
        Route::get("{category}", [CategoryController::class, 'show']);

        Route::put("{category}", [CategoryController::class, 'update']);

        Route::delete("{category}", [CategoryController::class, 'destroy']);
    });
    Route::group(['prefix' => 'product'], function () {
        Route::get("", [ProductController::class, 'index']);
        Route::post("", [ProductController::class, 'store']);
        Route::get("{product}", [ProductController::class, 'show']);

        Route::put("{product}", [ProductController::class, 'update']);

        Route::delete("{product}", [ProductController::class, 'destroy']);
    });
    Route::group(['prefix' => 'cart'], function () {
        Route::get("", [CartController::class, 'index']);
        Route::post("", [CartController::class, 'store']);
        Route::delete("{product_id}", [CartController::class, 'destroy']);

    });
    Route::group(['prefix' => 'order'], function () {
        Route::get("", [OrderController::class, 'index']);
        Route::post("", [OrderController::class, 'store']);
        Route::get("clear", [OrderController::class, 'deleteCart']);
        Route::delete("{order}", [OrderController::class, 'cancel']);

        Route::group(['prefix' => 'admin'], function () {
            Route::get("", [OrderController::class, 'allOrders']);
            Route::put("{order}", [OrderController::class, 'update']);
            Route::delete("{order}", [OrderController::class, 'destroy']);
        });
    });
    Route::group(['prefix' => 'favorite'], function () {
        Route::get("", [FavoriteProductController::class, 'index']);
        Route::post("", [FavoriteProductController::class, 'store']);
        Route::delete("{product_id}", [FavoriteProductController::class, 'destroy']);

    });
});

Route::post("login", [UserController::class, 'login']);
Route::post("signup", [UserController::class, 'signup']);
