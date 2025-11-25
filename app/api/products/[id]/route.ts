import { NextRequest, NextResponse } from 'next/server'
import { getProductById, getProducts, getCategories, updateProduct, deleteProduct } from '@/lib/database'

// Type definitions
interface UpdateProductDto {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  cost?: number;
  stock?: number;
  minStock?: number;
  categoryId?: string;
}

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params in Next.js 15+
    
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }
    
    const product = await getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params in Next.js 15+
    
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }
    
    const body: UpdateProductDto = await request.json();
    
    // Check if product exists
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // If updating SKU, check for duplicates
    if (body.sku && body.sku !== existingProduct.sku) {
      const products = await getProducts();
      const duplicateSku = products.find((p: any) => p.sku === body.sku && p.id !== id);
      
      if (duplicateSku) {
        return NextResponse.json(
          { error: 'Product with this SKU already exists' },
          { status: 400 }
        )
      }
    }
    
    // If updating category, verify it exists
    if (body.categoryId !== undefined) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> origin/Arjun
      const categoryIdNum = typeof body.categoryId === 'string' 
        ? parseInt(body.categoryId) 
        : body.categoryId;
      const categories = await getCategories();
      const categoryExists = categories.some((c: any) => c.id === categoryIdNum);
<<<<<<< HEAD
=======
=======
      const categoryId = body.categoryId;
      const categories = await getCategories();
      const categoryExists = categories.some((c: any) => c.id === categoryId);
>>>>>>> origin/karki_branch
>>>>>>> origin/Arjun
      
      if (!categoryExists) {
        return NextResponse.json(
          { error: 'Category does not exist' },
          { status: 400 }
        )
      }
    }
    
    // Update product
    await updateProduct(id, body);
    
    // Fetch updated product with category info
    const product = await getProductById(id);
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params in Next.js 15+
    
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }
    
    const deleted = await deleteProduct(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}