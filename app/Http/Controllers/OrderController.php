<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use \Illuminate\Support\Facades\Auth;
use App\Models\Cart;
use Stripe\Charge;
use Stripe\Stripe;
use TheSeer\Tokenizer\Exception;

class OrderController extends Controller
{

    public function index()
    {
        $user = Auth::user();
        return response()->json([
            'message' => 'User orders',
            'data' => $user->orders()->paginate(15)

        ]);
    }

    public function allOrders()
    {
        if ($this->validateAdmin()) {
            return $this->validateAdmin();
        }
        $orders = Order::with('user:id,name')->paginate(15);
        return response()->json([
            'message' => 'all orders',
            'data' => $orders
        ]);
    }

    public function store()
    {
        \request()->validate(
            [
                'delivery_address' => 'required',
//                stripeToken
            ]
        );
        $totalCost = $this->getCartCost();

        Stripe::setApiKey('pk_test_51HgvmgFAfdf2YRBxWEgZ0HKGbT5Olc7uYMzVO0180G3pTwgEP94LXYL2j0j1uGpBODyo2PE9gdtFBtemkpchcP9o00VvztUkmp');

        // Token is created using Stripe Checkout or Elements!
        // Get the payment token ID submitted by the form:
        try {

            Charge::create([
                'amount' => $totalCost,
                'currency' => 'usd',
                'description' => 'payment for order',
                'source' => request()->stripeToken,
            ]);
        }catch (Exception $e)
        {
           abort(400, "Error in payment");
        }


        $user = Auth::user();
        $order = Order::create([
            'user_id' => $user->id,
            'order_state' => 'pending',
            'delivery_address' => request()->delivery_address,
            'value' => $totalCost,
        ]);
        $cart = $user->cartProducts()->select('product_id')->get()->map(function ($x) {
            return $x['product_id'];
        });
        // add product to the order
        $order->products()->attach($cart);
        // delete elemets again from the cart
        Cart::where('user_id', $user->id)->delete();

        return response()->json([
            'message' => 'order created successfully',
            'data' => $order
        ]);

    }


    public function show(Order $order)
    {
        return response()->json([
            'message' => 'order details',
            'data' => $order->with('products')->get()
        ]);
    }

    public function update(Order $order)
    {
        if ($this->validateAdmin()) {
            return $this->validateAdmin();
        }

        request()->validate([
            'order_state' => ['required', 'in:pending,canceled,accepted,denied,delivered']
        ]);
        $order->order_state = \request()->order_state;

        $order->save();
        return response()->json([
            'message' => 'updated successfully',
            'data' => $order
        ]);
    }


    public function destroy(Order $order)
    {
        $order->delete();
    }

    public function cancel(Order $order)
    {
        $user = Auth::user();
        abort_if($order->user_id != $user->id, 400);
        $order->order_state = 'canceled';
        $order->save();

        return response()->json([
            'message' => 'state updated',
            'data' => $order
        ]);
    }

    protected function getCartCost()
    {
        $authed = Auth::user();

        $pureProducts = User::
        select(['id'])->
        where('id', $authed->id)->with(['cartProducts:user_id,product_id,amount', 'products'])->first();


        $pureProducts->cart_cost = 0;
        foreach ($pureProducts->products as $product) {
            $product->amount = $pureProducts->cartProducts
                ->where('product_id', $product->id)
                ->first()->amount;
            $product->totalCost = $pureProducts->cartProducts
                    ->where('product_id', $product->id)
                    ->first()->amount * $product->cost;
            $pureProducts->cart_cost += $product->totalCost;
            $product->makeHidden('pivot');

        }
        return $pureProducts->cart_cost;
    }

    protected function validateAdmin()
    {
        $authed_user = Auth::user();

        if ($authed_user['is_admin'] != 1) {
            return response('unauthorized', 401);
        }
        return null;
    }

    protected function pay($token, $amount)
    {
        // Set your secret key. Remember to switch to your live secret key in production.
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        \Stripe\Stripe::setApiKey('pk_test_51HgvmgFAfdf2YRBxWEgZ0HKGbT5Olc7uYMzVO0180G3pTwgEP94LXYL2j0j1uGpBODyo2PE9gdtFBtemkpchcP9o00VvztUkmp');

        // Token is created using Stripe Checkout or Elements!
        // Get the payment token ID submitted by the form:

        return \Stripe\Charge::create([
            'amount' => $amount,
            'currency' => 'usd',
            'description' => 'payment for order',
            'source' => $token,
        ]);
    }
}
