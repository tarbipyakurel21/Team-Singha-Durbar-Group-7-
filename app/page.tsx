"use client";

import { useState, useEffect } from "react";
import { Package2, Loader2 } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await response.json();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }

      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }

      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading products...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Package2 className="h-8 w-8" />
            Product Management
          </h1>
        </div>

        <div className="bg-card border rounded-lg p-8">
          <p className="text-muted-foreground">Products will be displayed here</p>
          <p className="text-sm text-muted-foreground mt-2">
            Total products: {products.length}
          </p>
          <p className="text-sm text-muted-foreground">
            Total categories: {categories.length}
          </p>
        </div>
      </div>
    </div>
  );
}