import { NextRequest, NextResponse } from 'next/server'
import { getCategories, getProducts, updateCategory, deleteCategory } from '@/lib/database'

// Type definitions
interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

// GET /api/categories/[id] - Get single category with product count
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params in Next.js 15+
    
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      )
    }
    
    const categories = await getCategories();
    const category = categories.find((c: any) => c.id === id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    
    const products = await getProducts();
    const productCount = products.filter((p: any) => p.categoryId === id).length;
    
    const categoryWithCount = {
      ...category,
      _count: { products: productCount }
    };
    
    return NextResponse.json(categoryWithCount)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params in Next.js 15+
    
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      )
    }
    
    const body: UpdateCategoryDto = await request.json();
    
    const categories = await getCategories();
    const existingCategory = categories.find((c: any) => c.id === id);
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    
    if (body.name) {
      const trimmedName = body.name.trim();
      
      if (trimmedName === '') {
        return NextResponse.json(
          { error: 'Category name cannot be empty' },
          { status: 400 }
        )
      }
      
      const duplicateName = categories.find(
        (c: any) => c.name.toLowerCase() === trimmedName.toLowerCase() && c.id !== id
      );
      
      if (duplicateName) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 400 }
        )
      }
      
      body.name = trimmedName;
    }
    
    if (body.description !== undefined) {
      body.description = body.description.trim();
    }
    
    const updatedCategory = await updateCategory(id, body);
    
    const products = await getProducts();
    const productCount = products.filter((p: any) => p.categoryId === id).length;
    
    const categoryWithCount = {
      ...updatedCategory,
      _count: { products: productCount }
    };
    
    return NextResponse.json(categoryWithCount)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params in Next.js 15+
    
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      )
    }
    
    const products = await getProducts();
    const hasProducts = products.some((p: any) => p.categoryId === id);
    
    if (hasProducts) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing products. Please reassign or delete the products first.' },
        { status: 400 }
      )
    }
    
    const deleted = await deleteCategory(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}