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
  const [dailySalesData, setDailySalesData] = useState<Array<{ day: string; sales: number; items: number }>>([]);
  const [topSellingItems, setTopSellingItems] = useState<Array<{ name: string; sales: number; revenue: number }>>([]);
  const [lowestSellingItems, setLowestSellingItems] = useState<Array<{ name: string; sales: number; revenue: number }>>([]);
  const [mostSoldItemsChart, setMostSoldItemsChart] = useState<Array<{ name: string; quantity: number }>>([]);

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

  useEffect(() => {
    // Load and process POS data from localStorage
    const posData = JSON.parse(localStorage.getItem('posData') || '[]');
    
    if (posData.length > 0) {
      // Group sales by date
      const salesByDate: Record<string, { sales: number; items: number }> = {};
      const itemStats: Record<string, { quantity: number; revenue: number }> = {};

      posData.forEach((sale: any) => {
        // Skip invalid entries
        if (!sale || (!sale['Item Name'] && !sale.itemName && !sale.ItemName)) {
          return;
        }

        const date = sale.Date || sale.date || '';
        const itemName = sale['Item Name'] || sale.itemName || sale.ItemName || 'Unknown';
        const quantity = parseInt(sale.Quantity || sale.quantity || '0');
        const total = parseFloat(sale.Total || sale.total || '0');

        // Skip if quantity is 0 or invalid
        if (isNaN(quantity) || quantity <= 0) {
          return;
        }

        // Group by date
        if (date) {
          if (!salesByDate[date]) {
            salesByDate[date] = { sales: 0, items: 0 };
          }
          salesByDate[date].sales += total;
          salesByDate[date].items += quantity;
        }

        // Track item stats - aggregate by item name
        if (!itemStats[itemName]) {
          itemStats[itemName] = { quantity: 0, revenue: 0 };
        }
        itemStats[itemName].quantity += quantity;
        itemStats[itemName].revenue += total;
      });

      // Convert to daily sales array (last 7 days or all available)
      const dates = Object.keys(salesByDate).sort();
      const last7Days = dates.slice(-7);
      const dailyData = last7Days.map(date => {
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        return {
          day: dayName,
          sales: salesByDate[date].sales,
          items: salesByDate[date].items,
        };
      });
      setDailySalesData(dailyData);

      // Calculate top and lowest selling items
      const itemsArray = Object.entries(itemStats)
        .filter(([name, stats]) => name !== 'Unknown' && stats.quantity > 0)
        .map(([name, stats]) => ({
          name,
          sales: stats.quantity,
          revenue: stats.revenue,
        }));

      // Sort by quantity sold (units sold) - descending for top, ascending for lowest
      const sortedByQuantity = itemsArray.sort((a, b) => b.sales - a.sales);
      
      // Top selling = highest quantity
      setTopSellingItems(sortedByQuantity.slice(0, 5));
      
      // Lowest selling = lowest quantity (but only if we have multiple items)
      const lowestItems = sortedByQuantity.length > 0 
        ? sortedByQuantity.slice(-5).reverse()
        : [];
      setLowestSellingItems(lowestItems);

      // Prepare chart data for most sold items (top 10)
      const chartData = sortedByQuantity.slice(0, 10).map(item => ({
        name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
        quantity: item.sales,
      }));
      setMostSoldItemsChart(chartData);
    } else {
      // Default empty data
      setDailySalesData([]);
      setTopSellingItems([]);
      setLowestSellingItems([]);
      setMostSoldItemsChart([]);
    }
  }, []);

  // Listen for storage changes and page visibility to update when CSV is uploaded
  useEffect(() => {
    const updateChartData = () => {
      const posData = JSON.parse(localStorage.getItem('posData') || '[]');
      
      if (posData.length > 0) {
        const itemStats: Record<string, { quantity: number; revenue: number }> = {};

        posData.forEach((sale: any) => {
          if (!sale || (!sale['Item Name'] && !sale.itemName && !sale.ItemName)) {
            return;
          }

          const itemName = sale['Item Name'] || sale.itemName || sale.ItemName || 'Unknown';
          const quantity = parseInt(sale.Quantity || sale.quantity || '0');
          const total = parseFloat(sale.Total || sale.total || '0');

          if (isNaN(quantity) || quantity <= 0) {
            return;
          }

          if (!itemStats[itemName]) {
            itemStats[itemName] = { quantity: 0, revenue: 0 };
          }
          itemStats[itemName].quantity += quantity;
          itemStats[itemName].revenue += total;
        });

        const itemsArray = Object.entries(itemStats)
          .filter(([name, stats]) => name !== 'Unknown' && stats.quantity > 0)
          .map(([name, stats]) => ({
            name,
            sales: stats.quantity,
            revenue: stats.revenue,
          }));

        const sortedByQuantity = itemsArray.sort((a, b) => b.sales - a.sales);
        const chartData = sortedByQuantity.slice(0, 10).map(item => ({
          name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
          quantity: item.sales,
        }));
        setMostSoldItemsChart(chartData);
      } else {
        setMostSoldItemsChart([]);
      }
    };

    // Update when page becomes visible (user navigates back to reports)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateChartData();
      }
    };

    // Update when window gains focus
    const handleFocus = () => {
      updateChartData();
    };

    // Listen for storage events (when CSV is uploaded from another tab/window)
    window.addEventListener('storage', updateChartData);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', updateChartData);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  
  // Daily restock summary
  const dailyRestockNeeds = lowStockItems.map(product => ({
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
                Based on uploaded POS data
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {topSellingItems.length > 0 ? (
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
              ) : (
                <div className="p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">N/A</p>
                      <p className="text-xs text-muted-foreground">
                        No data available
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-muted-foreground">
                        N/A
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                Based on uploaded POS data
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {lowestSellingItems.length > 0 ? (
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
              ) : (
                <div className="p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">N/A</p>
                      <p className="text-xs text-muted-foreground">
                        No data available
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-muted-foreground">
                        N/A
                      </p>
                    </div>
                  </div>
                </div>
              )}
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

        {/* Daily Restock Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package2 className="h-5 w-5 text-primary" />
              <CardTitle>Daily Restock Summary</CardTitle>
            </div>
            <CardDescription>
              Combines POS and stock data to highlight refill needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dailyRestockNeeds.length > 0 ? (
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
                    {dailyRestockNeeds.map((item, index) => (
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

        {/* Most Sold Items Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Most Sold Items</CardTitle>
            <CardDescription>
              Daily bar chart showing top selling items from uploaded POS data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mostSoldItemsChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mostSoldItemsChart} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Quantity Sold', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    width={120}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value} units`,
                      "Quantity Sold"
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar 
                    dataKey="quantity" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  No data available
                </p>
                <p className="text-xs text-muted-foreground">
                  Upload POS data in Settings to view most sold items chart
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

