<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTicketsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('theme');
            $table->string('description');
            $table->enum('status', ['new', 'progress', 'done']);
            $table->enum('priority', ['normal', 'low', 'high']);
            $table->foreignId('project_id')->constrained();

            /*
             *
             * $table->foreign('project_id')->references('id')->on('projects');
             * $table->foreign('ticket_id')->references('ticket_id')->on('user_ticket');
            */

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tickets');
    }
}
