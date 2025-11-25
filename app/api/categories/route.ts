import { NextRequest, NextResponse } from 'next/server'
import { getCategories, getProducts, addCategory, initializeData } from '@/lib/database'

// Type definitions
interface CreateCategoryDto {
  name: string;
  description?: string;
}

// GET /api/categories - Get all categories with product counts
export async function GET() {
  try {
    await initializeData();
    
    const categories = await getCategories();
    const products = await getProducts();
    
    // Calculate actual product count for each category
    const categoriesWithCount = categories.map((category: any) => {
      const productCount = products.filter((p: any) => p.categoryId === category.id).length;
      return {
        ...category,
        _count: { products: productCount }
      };
    });

    return NextResponse.json(categoriesWithCount)
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    const errorMessage = error?.message || 'Failed to fetch categories';
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body: CreateCategoryDto = await request.json()
    const { name, description } = body

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    // Check for duplicate name (case-insensitive)
    const existingCategories = await getCategories();
    const existingCategory = existingCategories.find(
      (c: any) => c.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    // Create category
    const category = await addCategory({
      name: name.trim(),
      description: description?.trim() || '',
    });

    const categoryWithCount = {
      ...category,
      _count: { products: 0 }
    };

    return NextResponse.json(categoryWithCount, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}