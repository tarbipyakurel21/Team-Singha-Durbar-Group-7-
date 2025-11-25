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
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body: CreateProductDto = await request.json()
    const { name, description, sku, price, cost, stock, minStock, categoryId } = body

    // Validate required fields
    if (!name || !sku || !price || !cost || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, sku, price, cost, categoryId' },
        { status: 400 }
      )
    }

    // Check if category exists
    const categories = await getCategories();
    const categoryIdStr = typeof categoryId === 'string' ? categoryId : String(categoryId);
    const categoryExists = categories.some((c: any) => c.id === categoryIdStr);

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Category does not exist' },
        { status: 400 }
      )
    }

    // Check for duplicate SKU
    const existingProducts = await getProducts();
    const existingProduct = existingProducts.find((p: any) => p.sku === sku);

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 400 }
      )
    }

    // Create product
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

    // Fetch created product with category info
    const products = await getProducts();
    const newProduct = products.find((p: any) => p.id === product.id);

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}