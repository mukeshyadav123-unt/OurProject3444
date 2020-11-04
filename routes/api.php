<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DoorController;
use App\Http\Controllers\DoorLogController;
use App\Http\Controllers\UserController;
use App\Models\DoorLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
    Route::get("me", [UserController::class,'showMe']);
    Route::delete("me", [UserController::class,'destroy']);
    Route::put("me", [UserController::class,'update']);

    Route::group(['prefix' => 'user'], function () {
        Route::get("", [AdminController::class,'showAll']);
        Route::get("admins", [AdminController::class,'showAdmins']);

        Route::put("{user}/make-admin", [AdminController::class,'makeAdmin']);
        Route::get("{user}", [AdminController::class,'show']);
        Route::post("{user}", [AdminController::class,'storeUser']);
        Route::delete("{user}", [AdminController::class,'destroy']);
    });
});

Route::post("login", [UserController::class,'login']);
Route::post("signup", [UserController::class,'signup']);
