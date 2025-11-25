import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

interface DashboardChartsProps {
  products: Product[];
  categories: Category[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6B9D"];

export function DashboardCharts({ products, categories }: DashboardChartsProps) {
  // Prepare category value data for bar chart
  const categoryData = categories.map((category) => {
    const categoryProducts = products.filter(p => p.categoryId === category.id);
    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
    
    return {
      name: category.name,
      value: totalValue,
      stock: totalStock,
      products: categoryProducts.length,
    };
  }).filter(c => c.products > 0); // Only show categories with products

  // Prepare top products by value for pie chart
  const topProductsData = products
    .map(p => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
      value: p.price * p.stock,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Top 6 products

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Value by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value),
                    "Value"
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))" 
                  name="Inventory Value"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Products by Value</CardTitle>
        </CardHeader>
        <CardContent>
          {topProductsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProductsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topProductsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value),
                    "Value"
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

