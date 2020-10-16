<?php

namespace App\Http\Controllers;

use App\Project;
use Illuminate\Http\Request;

class ProjectsController extends Controller
{

    public function autoComplete(Request $request) {
        return Project::where('title' ,'like', '%'.$request->input('value').'%')->get();
    }
    /**
     * Display a listing of the resource.
     *
     * @return Project[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Http\Response
     */
    public function index()
    {
        return Project::with('users')->get('*');
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $project = new Project([
                'title' => '',
                'user_id' => auth()->user()->id
            ]);

        $project->save();
        return response($project->load('users'), 201);
    }


}
