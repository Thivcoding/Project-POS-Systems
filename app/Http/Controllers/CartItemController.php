<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    // POST /cart-items
    public function store(Request $request)
    {
        $request->validate([
            'cart_id' => 'required|exists:carts,cart_id',
            'product_id' => 'required|exists:products,product_id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($request->product_id);

        $item = CartItem::where('cart_id', $request->cart_id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($item) {
            $item->quantity += $request->quantity;
        } else {
            $item = new CartItem([
                'cart_id' => $request->cart_id,
                'product_id' => $request->product_id,
                'price' => $product->price
            ]);
            $item->quantity = $request->quantity;
        }

        $item->subtotal = $item->quantity * $item->price;
        $item->save();

        return response()->json($item, 201);
    }

    // PUT /cart-items/{id}
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $item = CartItem::findOrFail($id);
        $item->update([
            'quantity' => $request->quantity,
            'subtotal' => $request->quantity * $item->price
        ]);

        return response()->json($item);
    }

    // DELETE /cart-items/{id}
    public function destroy($id)
    {
        CartItem::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Item removed'
        ]);
    }
}

