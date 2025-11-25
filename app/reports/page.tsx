"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FileText,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package2,
  Loader2,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  categoryId: number;
}

interface SalesData {
  productName: string;
  quantity: number;
  revenue: number;
}

export default function ReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTopSellingExpanded, setIsTopSellingExpanded] = useState(false);
  const [isLowestSellingExpanded, setIsLowestSellingExpanded] = useState(false);

  // Mock POS data for daily sales
  const mockDailySales: SalesData[] = [
    { productName: "Business Laptop", quantity: 3, revenue: 2699.97 },
    { productName: "Wireless Mouse", quantity: 8, revenue: 239.92 },
    { productName: "Standing Desk", quantity: 1, revenue: 349.99 },
  ];

  // Mock weekly sales data for charts
  const weeklySalesData = [
    { day: "Mon", sales: 1200, items: 15 },
    { day: "Tue", sales: 1900, items: 22 },
    { day: "Wed", sales: 1500, items: 18 },
    { day: "Thu", sales: 2100, items: 25 },
    { day: "Fri", sales: 1800, items: 20 },
    { day: "Sat", sales: 2400, items: 28 },
    { day: "Sun", sales: 1600, items: 19 },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  
  // Mock top/lowest selling items (based on POS data)
  const topSellingItems = [
    { name: "Wireless Mouse", sales: 45, revenue: 1349.55 },
    { name: "Business Laptop", sales: 12, revenue: 10799.88 },
    { name: "Standing Desk", sales: 8, revenue: 2799.92 },
  ];

  const lowestSellingItems = [
    { name: "Office Chair", sales: 2, revenue: 599.98 },
    { name: "Keyboard", sales: 3, revenue: 149.97 },
    { name: "Monitor", sales: 1, revenue: 299.99 },
  ];

  // Weekly restock summary
  const weeklyRestockNeeds = lowStockItems.map(product => ({
    name: product.name,
    sku: product.sku,
    currentStock: product.stock,
    minStock: product.minStock,
    needed: product.minStock - product.stock,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading reports...</span>
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
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Reports
          </h1>
        </div>

        {/* Low Stock Item Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <CardTitle>Low Stock Item Report</CardTitle>
            </div>
            <CardDescription>
              Items below minimum stock threshold
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockItems.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Current Stock</TableHead>
                      <TableHead className="text-right">Min Stock</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                        <TableCell className="text-right">{product.stock}</TableCell>
                        <TableCell className="text-right">{product.minStock}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-destructive font-semibold">Low Stock</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                All items are well stocked
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top/Lowest Selling Items */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Top Selling Items</CardTitle>
                </div>
                {topSellingItems.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsTopSellingExpanded(!isTopSellingExpanded)}
                    className="h-7"
                  >
                    {isTopSellingExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show All ({topSellingItems.length})
                      </>
                    )}
                  </Button>
                )}
              </div>
              <CardDescription className="text-xs mt-1">
                Based on POS transaction history
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {(isTopSellingExpanded ? topSellingItems : topSellingItems.slice(0, 1)).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.sales} units sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Lowest Selling Items</CardTitle>
                </div>
                {lowestSellingItems.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLowestSellingExpanded(!isLowestSellingExpanded)}
                    className="h-7"
                  >
                    {isLowestSellingExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show All ({lowestSellingItems.length})
                      </>
                    )}
                  </Button>
                )}
              </div>
              <CardDescription className="text-xs mt-1">
                Based on POS transaction history
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {(isLowestSellingExpanded ? lowestSellingItems : lowestSellingItems.slice(0, 1)).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.sales} units sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expiration Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Expiration Report</CardTitle>
            </div>
            <CardDescription>
              Items nearing expiration date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              No items nearing expiration
            </p>
          </CardContent>
        </Card>

        {/* Weekly Restock Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package2 className="h-5 w-5 text-primary" />
              <CardTitle>Weekly Restock Summary</CardTitle>
            </div>
            <CardDescription>
              Combines POS and stock data to highlight refill needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyRestockNeeds.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Current Stock</TableHead>
                      <TableHead className="text-right">Min Required</TableHead>
                      <TableHead className="text-right">Units Needed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyRestockNeeds.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                        <TableCell className="text-right">{item.currentStock}</TableCell>
                        <TableCell className="text-right">{item.minStock}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-destructive font-semibold">
                            {item.needed}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No restock needed at this time
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weekly Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales Overview</CardTitle>
            <CardDescription>
              Sales data from POS transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklySalesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="day" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "sales" 
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(value)
                      : value,
                    name === "sales" ? "Revenue" : "Items Sold"
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="sales" 
                  fill="hsl(var(--primary))" 
                  name="Revenue"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="items" 
                  fill="hsl(var(--chart-2))" 
                  name="Items Sold"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

