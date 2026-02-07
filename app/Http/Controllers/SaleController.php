<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Sale;
use App\Models\SaleDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    // GET /sales
    public function index()
    {
        return Sale::with(['details.product', 'payment', 'user'])->get();
    }

    // GET /sales/{id}
    public function show($id)
    {
        return Sale::with(['details.product', 'payment', 'user'])
            ->where('sale_id', $id)
            ->firstOrFail();
    }

    // CREATE sale from cart
    public function store(Request $request)
    {
        $request->validate([
            'cart_id' => 'required|exists:carts,cart_id'
        ]);

        $cart = Cart::with('items.product')
            ->where('cart_id', $request->cart_id)
            ->where('status', 'open')
            ->firstOrFail();

        if($cart->items->isEmpty()) {
            return response()->json(['message'=>'Cart is empty'], 400);
        }

        // Start transaction
        DB::beginTransaction();
        try {
            $total = $cart->items->sum(fn($item) => $item->subtotal);

            // create sale
            $sale = Sale::create([
                'cart_id' => $cart->cart_id,
                'user_id' => $cart->user_id,
                'total_amount' => $total,
                'sale_date' => now()
            ]);

            // create sale details
            foreach($cart->items as $item){
                SaleDetail::create([
                    'sale_id' => $sale->sale_id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->subtotal
                ]);

                // optional: update product stock
                $item->product->decrement('stock_qty', $item->quantity);
            }

            // close cart
            $cart->update(['status'=>'checked_out']);

            DB::commit();
            return response()->json($sale->load('details.product'), 201);

        } catch (\Exception $e){
            DB::rollBack();
            return response()->json(['message'=>$e->getMessage()], 500);
        }
    }

    // DELETE /sales/{id} (optional)
    public function destroy($id)
    {
        $sale = Sale::findOrFail($id);
        $sale->details()->delete();
        $sale->payment()->delete();
        $sale->delete();

        return response()->json(['message'=>'Sale deleted']);
    }
}

