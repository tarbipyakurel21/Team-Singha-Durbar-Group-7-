"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import {
  DollarSign,
  Package2,
  AlertTriangle,
  FolderOpen,
  Loader2,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  _count?: { products: number };
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate stats
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalCategories = categories.length;

  // Calculate potential profit (price - cost) * stock
  const potentialProfit = products.reduce(
    (acc, p) => acc + ((p.price - p.cost) * p.stock),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            title="Total Inventory Value"
            value={new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(totalValue)}
            description={`${totalStock.toLocaleString()} units in stock`}
            icon={DollarSign}
            trend="neutral"
          />

          <DashboardStatCard
            title="Total Products"
            value={totalProducts}
            description={`Across ${totalCategories} categories`}
            icon={Package2}
            trend="neutral"
          />

          <DashboardStatCard
            title="Low Stock Items"
            value={lowStockCount}
            description={
              lowStockCount > 0
                ? "Needs immediate attention"
                : "All items well stocked"
            }
            icon={AlertTriangle}
            trend={lowStockCount > 0 ? "down" : "up"}
          />

          <DashboardStatCard
            title="Potential Profit"
            value={new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(potentialProfit)}
            description="Based on current inventory"
            icon={FolderOpen}
            trend="up"
          />
        </div>

        {/* Recent Activity / Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.slice(0, 5).map((category) => {
                  const categoryProducts = products.filter(
                    p => p.categoryId === category.id
                  );
                  const percentage = totalProducts > 0
                    ? (categoryProducts.length / totalProducts) * 100
                    : 0;

                  return (
                    <div key={category.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {categoryProducts.length} products
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No categories available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products
                  .filter(p => p.stock <= p.minStock)
                  .slice(0, 5)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-destructive/10"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-destructive">
                          {product.stock} left
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Min: {product.minStock}
                        </p>
                      </div>
                    </div>
                  ))}
                {lowStockCount === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All products are well stocked! 🎉
                  </p>
                )}
                {lowStockCount > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{lowStockCount - 5} more items need attention
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

