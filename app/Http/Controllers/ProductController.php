<?php

namespace App\Http\Controllers;

use App\Models\ImageUrl;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {

            //skip validation for get requests
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
            )->where('in_stock', '>', 0)
                ->with(['images', 'category'])
                ->paginate(15)
        ]);
    }


    public function store()
    {
        request()->validate([
            'name' => ['required', 'min:3'],
            'description' => ['required', 'min:15'],
            'in_stock' => ['required', 'numeric', 'min:1'],
            'cost' => ['required', 'numeric', 'min:0.1'],
            'category_id' => ['numeric', 'exists:categories,id'],
            'image_url' => ['required', 'array'],
            'image_url.*' => ['regex:/^((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)$/', 'required']
        ]);

        $product = Product::create(request()->all());
        foreach (request()->image_url as $url) {
            ImageUrl::create([
                'url' => $url,
                'product_id' => $product->id
            ]);
        }
        $images = request()->image_url;
        foreach ($images as $image) {
            ImageUrl::create([
                'url' => $image,
                'product_id' => $product->id
            ]);
        }
        return response()->json([
            'message' => 'Product created Successfully',
            'data' => [
                'product' => Product::where('id', $product->id)->with(['images', 'category'])->get(),
            ]
        ]);
    }


    public function show(Product $product)
    {
        return response()->json([
            'message' => '',
            'data' => [
                'product' => Product::where('id', $product->id)->with(['images', 'category'])->get(),

            ]
        ]);
    }


    public function update(Request $request, Product $product)
    {
        //
    }


    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json([
            'message' => 'product deleted successfully',
            'data' => [
                'product' => $product,
                'category' => $product->category
            ]
        ]);
    }

    protected function validateAdmin()
    {
        // if (!(request()->isMethod('post'))) {
        //     request()->validate([
        //     'admin_password' => ['required'],
        // ]);
        // }

        $authed_user = Auth::user();

        if (!(request()->isMethod('post'))) {
            if (!Hash::check(request()->admin_password, $authed_user->password)) {
                return response('wrong admin password ', 401);
            }
        }
        $authed_user = Auth::user();

        if ($authed_user['is_admin'] != 1) {
            return response('unauthorized', 401);
        }
        return null;
    }
}
