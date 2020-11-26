<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if ($this->validateAdmin()) {
                return $this->validateAdmin();
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
        request()->validate([
            'category' => 'min:3'
        ]);

        $category = request()->category;
        return response()->json([
            'message' => '',
            'data' => Product::
                    when(
                        $category,
                        function ($query, $category) {
                            $query->whereHas(
                                'category',
                                function ($query) use ($category) {
                                    $query->where('name', '=', $category);
                                }
                            );
                        }
                    )
                    ->paginate(10)
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
        // return request()->all();
        request()->validate([
            'name'=> ['required' , 'min:3'],
            'description'=> ['required' , 'min:15'],
            'cost' => ['required' , 'numeric', 'min:0.1'],
            'category_id' => ['numeric' , 'exists:categories,id'],
            'image_url' => [  'required' , 'array'],
            'image_url.*' => ['active_url' , 'required']
        ]);

        return "hoooola";
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        return response()->json([
            'message' => '',
            'data' =>  [
                'product' => $product,
                'category' => $product->category
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json([
            'message' => 'product deleted successfully',
            'data' =>  [
                'product' => $product,
                'category' => $product->category
            ]
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
