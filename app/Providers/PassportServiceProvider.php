<?php

namespace App\Providers;


use Laravel\Passport\ApiTokenCookieFactory;
use Illuminate\Support\ServiceProvider;

class PassportServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        parent::register();

        $this->app->bind(ApiTokenCookieFactory::class,
            \App\Classes\ApiTokenCookieFactory::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
