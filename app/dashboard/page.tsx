"use client";

import { useState, useEffect } from "react";
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { DashboardCharts } from "@/components/dashboard-charts";
=======
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardStatCard } from "@/components/dashboard-stat-card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
>>>>>>> origin/karki_branch
import {
  DollarSign,
  Package2,
  AlertTriangle,
  FolderOpen,
  Loader2,
<<<<<<< HEAD
=======
  TrendingUp,
  ShoppingCart,
  ArrowUpCircle,
  Settings,
  ChevronDown,
  ChevronUp,
>>>>>>> origin/karki_branch
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
<<<<<<< HEAD
=======
  updatedAt?: string;
}

interface RecentRestock {
  name: string;
  sku: string;
  quantity: number;
  date: string;
>>>>>>> origin/karki_branch
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
<<<<<<< HEAD
=======
  const [isRestocksExpanded, setIsRestocksExpanded] = useState(false);
>>>>>>> origin/karki_branch

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

<<<<<<< HEAD
=======
  // Mock recent restocks (first 3)
  const recentRestocks: RecentRestock[] = [
    { name: "Business Laptop", sku: "LAPTOP-001", quantity: 5, date: "2 hours ago" },
    { name: "Wireless Mouse", sku: "MOUSE-001", quantity: 20, date: "5 hours ago" },
    { name: "Standing Desk", sku: "DESK-001", quantity: 3, date: "1 day ago" },
  ];

  // Mock daily sales summary
  const dailySales = {
    totalRevenue: 3289.88,
    totalItems: 12,
    topItem: "Business Laptop",
  };

  // Basic refill recommendations (based on low stock)
  const refillRecommendations = products
    .filter(p => p.stock <= p.minStock * 1.5) // Items at or near minimum
    .slice(0, 5)
    .map(p => ({
      name: p.name,
      sku: p.sku,
      currentStock: p.stock,
      recommended: Math.max(p.minStock * 2, 10), // Recommend 2x min stock or 10, whichever is higher
    }));

>>>>>>> origin/karki_branch
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
<<<<<<< HEAD
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
=======
    <div className="min-h-screen bg-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
>>>>>>> origin/karki_branch
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

<<<<<<< HEAD
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
=======
        {/* Recent Restocks */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Recent Restocks</CardTitle>
              </div>
              {recentRestocks.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRestocksExpanded(!isRestocksExpanded)}
                  className="h-7"
                >
                  {isRestocksExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show All ({recentRestocks.length})
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {(isRestocksExpanded ? recentRestocks : recentRestocks.slice(0, 1)).map((restock, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{restock.name}</p>
                    <p className="text-xs text-muted-foreground">
                      SKU: {restock.sku} • {restock.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">
                      +{restock.quantity} units
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Low Stock Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Low Stock Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {products
                  .filter(p => p.stock <= p.minStock)
                  .slice(0, 3)
>>>>>>> origin/karki_branch
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
<<<<<<< HEAD
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All products are well stocked! 🎉
                  </p>
                )}
                {lowStockCount > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{lowStockCount - 5} more items need attention
=======
                  <p className="text-sm text-muted-foreground text-center py-3">
                    All products are well stocked
                  </p>
                )}
                {lowStockCount > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{lowStockCount - 3} more items need attention
>>>>>>> origin/karki_branch
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
<<<<<<< HEAD
        </div>

        {/* Charts */}
        <DashboardCharts products={products} categories={categories} />
=======

          {/* Daily Sales Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Daily Sales Summary</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Today's sales from POS data
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Total Revenue</span>
                    <span className="text-base font-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(dailySales.totalRevenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Items Sold</span>
                    <span className="text-base font-semibold">{dailySales.totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Top Item</span>
                    <span className="text-xs font-medium">{dailySales.topItem}</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-start gap-2">
                    <Settings className="h-3 w-3 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-primary mb-0.5">
                        Upload Daily POS Data
                      </p>
                      <p className="text-xs text-muted-foreground mb-1.5">
                        Go to Settings to upload daily POS data
                      </p>
                      <Link href="/settings">
                        <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                          Go to Settings
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Basic Refill Recommendations */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Basic Refill Recommendations</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Items that should be restocked soon based on current stock levels
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {refillRecommendations.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Product Name</TableHead>
                      <TableHead className="text-xs">SKU</TableHead>
                      <TableHead className="text-right text-xs">Current Stock</TableHead>
                      <TableHead className="text-right text-xs">Recommended</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refillRecommendations.slice(0, 3).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-sm">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{item.sku}</TableCell>
                        <TableCell className="text-right text-sm">{item.currentStock}</TableCell>
                        <TableCell className="text-right text-sm">
                          <span className="text-primary font-semibold">
                            {item.recommended}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No refill recommendations at this time
              </p>
            )}
          </CardContent>
        </Card>
>>>>>>> origin/karki_branch
      </div>
    </div>
  );
}

