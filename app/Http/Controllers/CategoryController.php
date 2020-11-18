<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
<<<<<<< HEAD

=======
>>>>>>> 7edc2c2e4d3a18866e4ff411ff73ab436af2d4e5
class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if ($this->validateAdmin()) {
<<<<<<< HEAD
                return $this->validateAdmin();
=======
                return response('Unauthorized', 401);
>>>>>>> 7edc2c2e4d3a18866e4ff411ff73ab436af2d4e5
            }
            return $next($request);
        });
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json([
            'message' => '',
            'data' =>  Category::paginate(10)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store()
    {
        request()->validate([
            'name' => ['required' , 'min:3']
        ]);
        if (Category::where('name', '=', request()->name)->first()) {
            return response('Category already exist', 401);
        }
        $category = Category::create(['name' => request()->name]);

        return response()->json([
            'message' => 'successfully created',
            'data' => $category
        ]);
<<<<<<< HEAD
    }

=======
                 
    }
>>>>>>> 7edc2c2e4d3a18866e4ff411ff73ab436af2d4e5
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        return response()->json([
            'message' => '',
            'data' => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function update(Category $category)
    {
        request()->validate([
            'name' => ['required' , 'min:3']
        ]);
<<<<<<< HEAD

        if (Category::where('name', '=', request()->name)->first()) {
            return response('Category already exist', 401);
        }

=======
        if (Category::where('name', '=', request()->name)->first()) {
            return response('Category already exist', 401);
        }
>>>>>>> 7edc2c2e4d3a18866e4ff411ff73ab436af2d4e5
        $category->name = request()->name;
        $category->save();

        return response()->json([
            'message' => 'Successfully updated',
            'data' => $category
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'successfully delete',
            'data' => $category
        ]);
    }
<<<<<<< HEAD

=======
    
>>>>>>> 7edc2c2e4d3a18866e4ff411ff73ab436af2d4e5
    protected function validateAdmin()
    {
        $authed_user = Auth::user();

        if ($authed_user['is_admin'] != 1) {
            return response('unauthorized', 401);
        }
        return null;
    }
}