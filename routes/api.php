<?php
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

Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('login', 'AuthController@login');
    Route::post('registration', 'AuthController@registration');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('logout', 'AuthController@logout');
    Route::group([
        'middleware' => 'auth:api'
    ], function() {
        Route::get('user', 'AuthController@user');
    });
});

Route::get('users/autocomplete','UserController@autoCompleteUsers');
Route::get('projects/autocomplete','ProjectsController@autoComplete');

Route::group([
    'middleware' => 'auth:api'
], function() {
    Route::resource('users','UserController');
    Route::resource('tickets','TicketsController');
    Route::resource('projects','ProjectsController');

});



