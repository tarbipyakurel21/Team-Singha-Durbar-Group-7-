import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Generic file operations
async function readFile(filePath: string, defaultData: any[] = []) {
  await ensureDataDir();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultData;
  }
}

async function writeFile(filePath: string, data: any[]) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Categories
export async function getCategories() {
  return await readFile(CATEGORIES_FILE, []);
}

export async function saveCategories(categories: any[]) {
  await writeFile(CATEGORIES_FILE, categories);
}

export async function addCategory(category: any) {
  const categories = await getCategories();
  const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
  const newCategory = {
    ...category,
    id: uniqueId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  categories.push(newCategory);
  await saveCategories(categories);
  return newCategory;
}

export async function updateCategory(id: number, updates: any) {
  const categories = await getCategories();
  const index = categories.findIndex((c: any) => c.id === id);
  if (index !== -1) {
    categories[index] = {
      ...categories[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await saveCategories(categories);
    return categories[index];
  }
  return null;
}

export async function deleteCategory(id: number) {
  const categories = await getCategories();
  const filtered = categories.filter((c: any) => c.id !== id);
  await saveCategories(filtered);
  return filtered.length < categories.length;
}

// Products
export async function getProducts() {
  const products = await readFile(PRODUCTS_FILE, []);
  const categories = await getCategories();
  
  return products.map((product: any) => {
    const category = categories.find((c: any) => c.id === product.categoryId);
    return { ...product, category: category || null };
  });
}

export async function saveProducts(products: any[]) {
  await writeFile(PRODUCTS_FILE, products);
}

export async function addProduct(product: any) {
  const products = await readFile(PRODUCTS_FILE, []);
  const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
  const newProduct = {
    ...product,
    id: uniqueId,
    price: parseFloat(product.price),
    cost: parseFloat(product.cost),
    stock: parseInt(product.stock) || 0,
    minStock: parseInt(product.minStock) || 0,
    categoryId: parseInt(product.categoryId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}

export async function updateProduct(id: number, updates: any) {
  const products = await readFile(PRODUCTS_FILE, []);
  const index = products.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...updates,
      ...(updates.price && { price: parseFloat(updates.price) }),
      ...(updates.cost && { cost: parseFloat(updates.cost) }),
      ...(updates.stock !== undefined && { stock: parseInt(updates.stock) }),
      ...(updates.minStock !== undefined && { minStock: parseInt(updates.minStock) }),
      ...(updates.categoryId && { categoryId: parseInt(updates.categoryId) }),
      updatedAt: new Date().toISOString()
    };
    await saveProducts(products);
    return products[index];
  }
  return null;
}

export async function deleteProduct(id: number) {
  const products = await readFile(PRODUCTS_FILE, []);
  const filtered = products.filter((p: any) => p.id !== id);
  await saveProducts(filtered);
  return filtered.length < products.length;
}

export async function getProductById(id: number) {
  const products = await getProducts();
  return products.find((p: any) => p.id === id) || null;
}

// Users
export async function getUsers() {
  return await readFile(USERS_FILE, []);
}

export async function addUser(user: any) {
  const users = await getUsers();
  const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
  const newUser = {
    ...user,
    id: uniqueId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.push(newUser);
  await writeFile(USERS_FILE, users);
  return newUser;
}

// Initialize with sample data
export async function initializeData() {
  const categories = await getCategories();
  const products = await getProducts();
  
  if (categories.length === 0) {
    const sampleCategories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets' },
      { name: 'Furniture', description: 'Office and home furniture' },
      { name: 'Clothing', description: 'Apparel and fashion accessories' },
      { name: 'Books', description: 'Educational and reference materials' },
      { name: 'Office Supplies', description: 'Stationery and office equipment' }
    ];

    for (const category of sampleCategories) {
      await addCategory(category);
    }
  }

  if (products.length === 0) {
    const updatedCategories = await getCategories();
    const sampleProducts = [
      {
        name: 'Business Laptop',
        description: '15.6" laptop perfect for business use',
        sku: 'LAPTOP-001',
        price: 899.99,
        cost: 650.00,
        stock: 12,
        minStock: 3,
        categoryId: updatedCategories.find((c: any) => c.name === 'Electronics')?.id
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with long battery life',
        sku: 'MOUSE-001',
        price: 29.99,
        cost: 15.00,
        stock: 45,
        minStock: 10,
        categoryId: updatedCategories.find((c: any) => c.name === 'Electronics')?.id
      },
      {
        name: 'Standing Desk',
        description: 'Adjustable height standing desk',
        sku: 'DESK-001',
        price: 349.99,
        cost: 220.00,
        stock: 8,
        minStock: 2,
        categoryId: updatedCategories.find((c: any) => c.name === 'Furniture')?.id
      }
    ];

    for (const product of sampleProducts) {
      if (product.categoryId) {
        await addProduct(product);
      }
    }
  }

  const users = await getUsers();
  if (users.length === 0) {
    const sampleUsers = [
      { name: 'System Administrator', email: 'admin@invmanage.com', role: 'admin' },
      { name: 'Inventory Manager', email: 'manager@invmanage.com', role: 'manager' }
    ];

    for (const user of sampleUsers) {
      await addUser(user);
    }
  }

  console.log('✅ Data initialized successfully');
}
