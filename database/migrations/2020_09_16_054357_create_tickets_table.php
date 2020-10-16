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
            $table->string('title')->default('');
            $table->string('subject')->default('');
            $table->string('description')->default('');
            $table->enum('status', ['', 'new', 'progress', 'done'])
                ->default('');
            $table->enum('priority', ['', 'normal', 'low', 'high'])
                ->default('');
            $table->foreignId('project_id')
                ->nullable()->constrained();
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
