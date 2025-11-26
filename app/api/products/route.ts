import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getCategories, addProduct, initializeData } from '@/lib/database'

// Type definitions
interface CreateProductDto {
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost: number;
  stock?: number;
  minStock?: number;
  categoryId: string;
}

// GET /api/products - Get all products with category information
export async function GET() {
  try {
    await initializeData();
    
    const products = await getProducts();
    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Error fetching products:', error)
    const errorMessage = error?.message || 'Failed to fetch products';
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body: CreateProductDto = await request.json()
    const { name, description, sku, price, cost, stock, minStock, categoryId } = body

    if (!name || !sku || !price || !cost || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, sku, price, cost, categoryId' },
        { status: 400 }
      )
    }

    const categories = await getCategories();
    const categoryIdStr = typeof categoryId === 'string' ? categoryId : String(categoryId);
    const categoryExists = categories.some((c: any) => c.id === categoryIdStr);

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Category does not exist' },
        { status: 400 }
      )
    }

    const existingProducts = await getProducts();
    const existingProduct = existingProducts.find((p: any) => p.sku === sku);

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 400 }
      )
    }

    const product = await addProduct({
      name,
      description,
      sku,
      price,
      cost,
      stock,
      minStock,
      categoryId: categoryIdStr,
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}