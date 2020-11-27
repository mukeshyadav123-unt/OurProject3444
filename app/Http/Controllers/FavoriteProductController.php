<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\FavoriteProduct;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class FavoriteProductController extends Controller
{

    public function index()
    {

        $pureProducts = $this->getProducts();

        return response()->json([
            'message' => 'user and  his favorites ',
            'user_with_products' => $pureProducts
        ]);
    }


    public function store()
    {
        request()->validate([
            'product_id' => ['required', 'numeric', 'exists:products,id']
        ]);

        $authed = Auth::user();


        $product = Product::find(request()->product_id);
//
        // all the validation passed
        // trying to add to the cart
        $favoriteProduct = FavoriteProduct::where([
            'product_id' => request()->product_id,
            'user_id' => $authed->id
        ])->first();
        if ($favoriteProduct) {
            $favoriteProduct->save();
        } else {
            $favoriteProduct = FavoriteProduct::updateOrCreate([
                'product_id' => request()->product_id,
                'user_id' => $authed->id
            ]);
        }
        return response()->json([
            'message' => 'Product added to the favorites '
        ]);
    }


    public function destroy($product_id)
    {
        Product::findOrFail($product_id);
        $authed = Auth::user();

        //remove product from cart
        $favoriteProduct = FavoriteProduct::where([
            'product_id' => $product_id,
            'user_id' => $authed->id
        ])->first();

        if ($favoriteProduct) {
            $favoriteProduct->delete();
            return response()->json([
                'message' => 'Product removed from the  favorites'
            ]);
        }
        return response()->json([
            'message' => 'Product not found at the user  favorites'
        ]);
    }

    protected function getProducts()
    {
        $authed = Auth::user();

        $pureProducts = User::
        select(['id', 'name'])->
        where('id', $authed->id)->with(['favoriteProductRelation:user_id,product_id', 'favoriteProducts'])->first();


        foreach ($pureProducts->favoriteProducts as $product) {
            $product->makeHidden('pivot');
        }
        return $pureProducts->makeHidden(['favoriteProductRelation' , 'products' ] );
    }


}
