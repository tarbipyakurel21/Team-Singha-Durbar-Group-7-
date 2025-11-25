import connectDB from './mongodb';
import Category from './models/Category';
import Product from './models/Product';
import User from './models/User';
import { Types } from 'mongoose';

// Categories
export async function getCategories() {
  await connectDB();
  const categories = await Category.find().lean();
  return categories.map((cat: any) => ({
    ...cat,
    id: cat._id.toString(),
    _id: undefined,
  }));
}

export async function addCategory(category: any) {
  await connectDB();
  const newCategory = await Category.create(category);
  return {
    ...newCategory.toObject(),
    id: newCategory._id.toString(),
    _id: undefined,
  };
}

export async function updateCategory(id: string, updates: any) {
  await connectDB();
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );
  
  if (!updatedCategory) return null;
  
  return {
    ...updatedCategory.toObject(),
    id: updatedCategory._id.toString(),
    _id: undefined,
  };
}

export async function deleteCategory(id: string) {
  await connectDB();
  const result = await Category.findByIdAndDelete(id);
  return !!result;
}

// Products
export async function getProducts() {
  await connectDB();
  const products = await Product.find().populate('categoryId').lean();
  
  return products.map((product: any) => ({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    sku: product.sku,
    price: product.price,
    cost: product.cost,
    stock: product.stock,
    minStock: product.minStock,
    categoryId: product.categoryId?._id?.toString() || product.categoryId,
    category: product.categoryId ? {
      id: product.categoryId._id?.toString() || product.categoryId,
      name: product.categoryId.name || '',
      description: product.categoryId.description || '',
    } : null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));
}

export async function addProduct(product: any) {
  await connectDB();
  
  const productData = {
    ...product,
    price: parseFloat(product.price),
    cost: parseFloat(product.cost),
    stock: parseInt(product.stock) || 0,
    minStock: parseInt(product.minStock) || 0,
    categoryId: new Types.ObjectId(product.categoryId),
  };
  
  const newProduct = await Product.create(productData);
  const populatedProduct = await Product.findById(newProduct._id).populate('categoryId');
  
  if (!populatedProduct) return null;
  
  const category: any = populatedProduct.categoryId;
  
  return {
    id: populatedProduct._id.toString(),
    name: populatedProduct.name,
    description: populatedProduct.description,
    sku: populatedProduct.sku,
    price: populatedProduct.price,
    cost: populatedProduct.cost,
    stock: populatedProduct.stock,
    minStock: populatedProduct.minStock,
    categoryId: category._id.toString(),
    category: {
      id: category._id.toString(),
      name: category.name,
      description: category.description,
    },
    createdAt: populatedProduct.createdAt,
    updatedAt: populatedProduct.updatedAt,
  };
}

export async function updateProduct(id: string, updates: any) {
  await connectDB();
  
  const updateData: any = { ...updates };
  
  if (updates.price) updateData.price = parseFloat(updates.price);
  if (updates.cost) updateData.cost = parseFloat(updates.cost);
  if (updates.stock !== undefined) updateData.stock = parseInt(updates.stock);
  if (updates.minStock !== undefined) updateData.minStock = parseInt(updates.minStock);
  if (updates.categoryId) updateData.categoryId = new Types.ObjectId(updates.categoryId);
  
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('categoryId');
  
  if (!updatedProduct) return null;
  
  const category: any = updatedProduct.categoryId;
  
  return {
    id: updatedProduct._id.toString(),
    name: updatedProduct.name,
    description: updatedProduct.description,
    sku: updatedProduct.sku,
    price: updatedProduct.price,
    cost: updatedProduct.cost,
    stock: updatedProduct.stock,
    minStock: updatedProduct.minStock,
    categoryId: category._id.toString(),
    category: {
      id: category._id.toString(),
      name: category.name,
      description: category.description,
    },
    createdAt: updatedProduct.createdAt,
    updatedAt: updatedProduct.updatedAt,
  };
}

export async function deleteProduct(id: string) {
  await connectDB();
  const result = await Product.findByIdAndDelete(id);
  return !!result;
}

export async function getProductById(id: string) {
  await connectDB();
  const product = await Product.findById(id).populate('categoryId').lean();
  
  if (!product) return null;
  
  const category: any = product.categoryId;
  
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    sku: product.sku,
    price: product.price,
    cost: product.cost,
    stock: product.stock,
    minStock: product.minStock,
    categoryId: category?._id?.toString() || product.categoryId,
    category: category ? {
      id: category._id.toString(),
      name: category.name,
      description: category.description,
    } : null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

// Users
export async function getUsers() {
  await connectDB();
  const users = await User.find().lean();
  return users.map((user: any) => ({
    ...user,
    id: user._id.toString(),
    _id: undefined,
  }));
}

export async function addUser(user: any) {
  await connectDB();
  const newUser = await User.create(user);
  return {
    ...newUser.toObject(),
    id: newUser._id.toString(),
    _id: undefined,
  };
}

// Initialize with sample data
export async function initializeData() {
  await connectDB();
  
  try {
    const categories = await getCategories();
    
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

    const products = await getProducts();
    
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
  } catch (error) {
    console.error('❌ Error initializing data:', error);
    throw error;
  }
}
