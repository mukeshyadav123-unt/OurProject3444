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

        $cart = Cart::where([
            'product_id' => request()->product_id,
            'user_id' => $authed->id
        ])->first();
        // find the value we got from in stock or 0 
        $cached = $cart->amount ?? 0;
        $inStockValue = $this->notAvailableInStock(request()->product_id, $amount + $cached);
        if ($inStockValue) {
            return response([
                'message' => 'No available items in the stock',
                'product_id' => request()->product_id,
                'in_stock' => $inStockValue
            ], 400);
        }


    }


    public function destroy(Cart $cart)
    {

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

    protected function notAvailableInStock($productId, $amount)
    {

        $product = Product::find($productId);

        if ($product->in_stock >= $amount) {
            return null;
        }
        return $product->in_stock;
    }
}
