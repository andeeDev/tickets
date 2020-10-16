<?php

use App\Events\ChatMessage;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
// routes/web.php
Route::get('/fire', function () {
    event(new ChatMessage());
    broadcast(new ChatMessage());
    return 'ok';
});
Route::post('/broadcasting/auth', function () {
    return response('ok', 200);
});

Route::view('/{path?}', 'welcome');

