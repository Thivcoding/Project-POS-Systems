<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // GET /api/admin/products
    public function index()
    {
        return response()->json(
            Product::with('category')->latest()->get()
        );
    }

    // POST /api/admin/products
    public function store(Request $request)
    {
        $request->validate([
            'category_id'  => 'required|exists:categories,category_id',
            'product_code' => 'required|unique:products,product_code',
            'product_name' => 'required|string|max:255',
            'price'        => 'required|numeric',
            'stock_qty'    => 'required|integer',
            'size'         => 'required|string|in:Small,Medium,Large', // Added size validation
            'image'        => 'required|image|max:2048'
        ]);

        // Upload to Cloudinary
        $upload = cloudinary()->upload(
            $request->file('image')->getRealPath(),
            ['folder' => 'pos-products-laravel']
        );

        $product = Product::create([
            'category_id'  => $request->category_id,
            'product_code' => $request->product_code,
            'product_name' => $request->product_name,
            'price'        => $request->price,
            'stock_qty'    => $request->stock_qty,
            'size'         => $request->size, // Save size
            'image'        => $upload->getSecurePath(),
            'image_id'     => $upload->getPublicId(),
            'status'       => 'active'
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'data'    => $product
        ],201);
    }

    // GET /api/admin/products/{id}
    public function show($id)
    {
        return Product::with('category')->findOrFail($id);
    }

    // PUT /api/admin/products/{id}
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'category_id' => 'required|exists:categories,category_id',
            'product_name'=> 'required|string|max:255',
            'price'       => 'required|numeric',
            'stock_qty'   => 'required|integer',
            'size'        => 'required|string|in:Small,Medium,Large', // Added size validation
            'image'       => 'nullable|image|max:2048'
        ]);

        // update image (if exists)
        if ($request->hasFile('image')) {
            // delete old image
            if ($product->image_id) {
                cloudinary()->destroy($product->image_id);
            }

            // upload new image
            $upload = cloudinary()->upload(
                $request->file('image')->getRealPath(),
                ['folder' => 'pos-products-laravel']
            );

            $product->image    = $upload->getSecurePath();
            $product->image_id = $upload->getPublicId();
        }

        $product->update([
            'category_id' => $request->category_id,
            'product_name'=> $request->product_name,
            'price'       => $request->price,
            'stock_qty'   => $request->stock_qty,
            'size'        => $request->size, // Save size
        ]);

        return response()->json([
            'message' => 'Product updated successfully',
            'data'    => $product
        ]);
    }

    // DELETE /api/admin/products/{id}
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // delete image from cloudinary
        if ($product->image_id) {
            cloudinary()->destroy($product->image_id);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
