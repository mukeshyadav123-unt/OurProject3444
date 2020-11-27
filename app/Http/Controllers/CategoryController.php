<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if ($request->isMethod('get')) {
                return $next($request);

            }
            if ($this->validateAdmin()) {
                return $this->validateAdmin();
            }
            return $next($request);
        });
    }

    public function index()
    {
        return response()->json([
            'message' => '',
            'data' =>  Category::get()
        ]);
    }


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
    }


    public function show(Category $category)
    {
        return response()->json([
            'message' => '',
            'data' => $category
        ]);
    }


    public function update(Category $category)
    {
        request()->validate([
            'name' => ['required' , 'min:3']
        ]);

        if (Category::where('name', '=', request()->name)->first()) {
            return response('Category already exist', 401);
        }

        $category->name = request()->name;
        $category->save();

        return response()->json([
            'message' => 'Successfully updated',
            'data' => $category
        ]);
    }


    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'successfully delete',
            'data' => $category
        ]);
    }

    protected function validateAdmin()
    {
        $authed_user = Auth::user();

        if ($authed_user['is_admin'] != 1) {
            return response('unauthorized', 401);
        }
        return null;
    }
}
