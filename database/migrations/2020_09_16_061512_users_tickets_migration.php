<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UsersTicketsMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_ticket', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained();
            $table->bigInteger('ticket_id')->nullable(false)->unsigned();
            $table->foreign('ticket_id')->references('id')->on('tickets');

            $table->enum('is_master', [1, 0]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_ticket');
    }
}
