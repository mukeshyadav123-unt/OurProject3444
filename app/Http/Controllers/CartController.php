<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{

    public function index()
    {

        $pureProducts = $this->getProducts();

        return response()->json([
            'message' => 'user and  his cart',
            'user_with_products' => $pureProducts
        ]);
    }


    public function store()
    {
        request()->validate([
            'product_id' => ['required', 'numeric', 'exists:products,id'],
            'amount' => ['numeric', 'min:1']
        ]);
        $amount = request()->amount ?? 1;
        $authed = Auth::user();


        $product = Product::find(request()->product_id);
//        dd($product);
        if (!$this->availableInStock($product, $amount)) {
            return response([
                'message' => 'No available items in the stock',
                'product_id' => request()->product_id,
                'in_stock' => $product->in_stock
            ], 400);
        }
        // all the validation passed
        // trying to add to the cart
        $cart = Cart::where([
            'product_id' => request()->product_id,
            'user_id' => $authed->id
        ])->first();
        if ($cart) {
            $cart->amount = $amount;
            $cart->save();
        } else {
            $cart = Cart::updateOrCreate([
                'product_id' => request()->product_id,
                'user_id' => $authed->id,
                'amount' => $amount
            ]);
        }
        return response()->json([
            'message' => 'Product added to the cart cart'
        ]);
    }


    public function destroy($product_id)
    {
        Product::findOrFail($product_id);
        $authed = Auth::user();

        //remove product from cart
        $cart = Cart::where([
            'product_id' => $product_id,
            'user_id' => $authed->id
        ])->first();

        if ($cart) {
            $cart->delete();
            return response()->json([
                'message' => 'Product removed from the  cart'
            ]);
        }
        return response()->json([
            'message' => 'Product not found at the user  cart'
        ]);
    }

    protected function getProducts()
    {
        $authed = Auth::user();

        $pureProducts = User::
        select(['id', 'name'])->
        where('id', $authed->id)->with(['cartProducts:user_id,product_id,amount', 'products'])->first();

//        dd($pureProducts->products);
        $pureProducts->cart_cost = 0;
        foreach ($pureProducts->products as $product) {
            $product->totalCost = $pureProducts->cartProducts
                    ->where('product_id', $product->id)
                    ->first()->amount * $product->cost;
            $pureProducts->cart_cost += $product->totalCost;
            $product->makeHidden('pivot');

        }
        return $pureProducts->makeHidden('cartProducts');
    }

    protected function availableInStock($product, $amount): bool
    {


        return $product->in_stock >= $amount;
    }
}
