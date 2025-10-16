'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeArray, safeGet, safeMath } from '@/utils/defensive';
import { useNotifications } from '@/hooks/useNotifications';

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  cost: number;
  supplier: string;
  lastRestocked: string;
}

// Animation variants
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};

const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

export default function GestaoEstoque() {
  const { success } = useNotifications();
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Detergente Multiuso',
      category: 'Produtos de Limpeza',
      quantity: 25,
      minQuantity: 10,
      unit: 'Litros',
      cost: 8.50,
      supplier: 'CleanPro Ltda',
      lastRestocked: '2024-01-15'
    },
    {
      id: 2,
      name: 'Papel Higiênico',
      category: 'Descartáveis',
      quantity: 150,
      minQuantity: 50,
      unit: 'Rolos',
      cost: 2.80,
      supplier: 'Higiene Total',
      lastRestocked: '2024-01-20'
    },
    {
      id: 3,
      name: 'Aspirador de Pó Portátil',
      category: 'Equipamentos',
      quantity: 3,
      minQuantity: 2,
      unit: 'Unidades',
      cost: 450.00,
      supplier: 'Tech Clean',
      lastRestocked: '2023-12-10'
    },
    {
      id: 4,
      name: 'Desinfetante',
      category: 'Produtos de Limpeza',
      quantity: 8,
      minQuantity: 15,
      unit: 'Litros',
      cost: 12.00,
      supplier: 'CleanPro Ltda',
      lastRestocked: '2024-01-10'
    }
  ]);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showLowStock, setShowLowStock] = useState(false);

  const categories = ['Todos', 'Produtos de Limpeza', 'Descartáveis', 'Equipamentos', 'Uniformes'];

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.quantity && newProduct.minQuantity) {
      const product: Product = {
        id: products.length + 1,
        name: newProduct.name,
        category: newProduct.category,
        quantity: newProduct.quantity,
        minQuantity: newProduct.minQuantity,
        unit: newProduct.unit || 'Unidades',
        cost: newProduct.cost || 0,
        supplier: newProduct.supplier || '',
        lastRestocked: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, product]);
      setNewProduct({});
      setShowAddForm(false);
    }
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, quantity: newQuantity, lastRestocked: new Date().toISOString().split('T')[0] } : product
    ));
  };

  const handleEditProduct = (productId: number) => {
    success(`Funcionalidade de edição em desenvolvimento para produto ${productId}`);
  };

  const handleGenerateReport = () => {
    success('Gerando relatório de consumo mensal...');
  };

  const handleGenerateShoppingList = () => {
    success('Gerando lista de compras baseada no estoque baixo...');
  };

  const handleConfigureSMSAlerts = () => {
    success('Abrindo configurações de alertas SMS...');
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'Todos' || product.category === selectedCategory;
    const stockMatch = !showLowStock || product.quantity <= product.minQuantity;
    return categoryMatch && stockMatch;
  });

  const lowStockCount = products.filter(p => p.quantity <= p.minQuantity).length;
  const totalValue = products.reduce((total, product) => total + (product.quantity * product.cost), 0);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Estoque e Suprimentos</h2>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total de Produtos</h3>
          <p className="text-2xl font-bold text-blue-600">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Estoque Baixo</h3>
          <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
          <p className="text-2xl font-bold text-green-600">R$ {totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Categorias</h3>
          <p className="text-2xl font-bold text-purple-600">{categories.length - 1}</p>
        </div>
      </motion.div>

      {/* Filters and Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="rounded border-gray-300"
              />
              Apenas estoque baixo
            </label>
          </div>

          <motion.button
            onClick={() => setShowAddForm(true)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            + Adicionar Produto
          </motion.button>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Produto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome do produto"
              value={newProduct.name || ''}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <select
              value={newProduct.category || ''}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Selecione a categoria</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantidade atual"
              value={newProduct.quantity || ''}
              onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              type="number"
              placeholder="Quantidade mínima"
              value={newProduct.minQuantity || ''}
              onChange={(e) => setNewProduct({...newProduct, minQuantity: parseInt(e.target.value)})}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              type="text"
              placeholder="Unidade (ex: Litros, Unidades)"
              value={newProduct.unit || ''}
              onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Custo unitário"
              value={newProduct.cost || ''}
              onChange={(e) => setNewProduct({...newProduct, cost: parseFloat(e.target.value)})}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              type="text"
              placeholder="Fornecedor"
              value={newProduct.supplier || ''}
              onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddProduct}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Adicionar
            </button>
            <button
              onClick={() => {setShowAddForm(false); setNewProduct({});}}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Unit.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeArray.map(filteredProducts, (product, index) => (
                <motion.tr 
                  key={product.id} 
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{safeGet.string(product?.name, 'N/A')}</div>
                      <div className="text-sm text-gray-500">Reabastecido: {safeGet.string(product?.lastRestocked, 'N/A')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {safeGet.string(product?.category, 'N/A')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {safeGet.number(product?.quantity, 0)} {safeGet.string(product?.unit, '')}
                    </div>
                    <div className="text-xs text-gray-500">Min: {safeGet.number(product?.minQuantity, 0)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      safeGet.number(product?.quantity, 0) <= safeGet.number(product?.minQuantity, 0)
                        ? 'bg-red-100 text-red-800'
                        : safeGet.number(product?.quantity, 0) <= safeGet.number(product?.minQuantity, 0) * 1.5
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {safeGet.number(product?.quantity, 0) <= safeGet.number(product?.minQuantity, 0)
                        ? 'Estoque Baixo'
                        : safeGet.number(product?.quantity, 0) <= safeGet.number(product?.minQuantity, 0) * 1.5
                        ? 'Atenção'
                        : 'OK'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {safeGet.number(product?.cost, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {safeGet.string(product?.supplier, 'N/A')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={safeGet.number(product?.quantity, 0)}
                        onChange={(e) => handleUpdateQuantity(product.id, parseInt(e.target.value) || 0)}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <motion.button 
                        className="text-blue-600 hover:text-blue-900 text-sm"
                        onClick={() => handleEditProduct(product.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Editar
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {safeArray.map(filteredProducts, (product, index) => (
            <motion.div 
              key={product.id} 
              className="p-4 bg-white"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {safeGet.string(product?.name, 'N/A')}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {safeGet.string(product?.category, 'N/A')} • Reabastecido: {safeGet.string(product?.lastRestocked, 'N/A')}
                  </p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                  safeGet.number(product?.quantity, 0) <= safeGet.number(product?.minQuantity, 0)
                    ? 'bg-red-100 text-red-800'
                    : safeGet.number(product?.quantity, 0) <= safeGet.number(product?.minQuantity, 0) * 1.5
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {safeGet.number(product?.quantity, 0) <= safeGet.number(product?.minQuantity, 0)
                    ? 'Baixo'
                    : safeGet.number(product?.quantity, 0) <= safeGet.number(product?.minQuantity, 0) * 1.5
                    ? 'Atenção'
                    : 'OK'
                  }
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <span className="text-xs font-medium text-gray-700">Estoque:</span>
                  <p className="text-sm font-semibold text-gray-900">
                    {safeGet.number(product?.quantity, 0)} {safeGet.string(product?.unit, '')}
                  </p>
                  <p className="text-xs text-gray-500">Min: {safeGet.number(product?.minQuantity, 0)}</p>
                </div>
                
                <div>
                  <span className="text-xs font-medium text-gray-700">Valor:</span>
                  <p className="text-sm font-semibold text-gray-900">
                    R$ {safeGet.number(product?.cost, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-xs font-medium text-gray-700">Fornecedor:</span>
                <p className="text-sm text-gray-600">{safeGet.string(product?.supplier, 'N/A')}</p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-700">Qtd:</label>
                  <input
                    type="number"
                    value={safeGet.number(product?.quantity, 0)}
                    onChange={(e) => handleUpdateQuantity(product.id, parseInt(e.target.value) || 0)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
                <motion.button 
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium touch-target"
                  onClick={() => handleEditProduct(product.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Editar
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button 
            className="p-6 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left touch-target"
            onClick={handleGenerateReport}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">R</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Relatório de Consumo</h4>
                <p className="text-sm text-gray-500">Gerar relatório mensal</p>
              </div>
            </div>
          </motion.button>
          
          <motion.button 
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            onClick={handleGenerateShoppingList}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛒</span>
              <div>
                <h4 className="font-medium text-gray-900">Lista de Compras</h4>
                <p className="text-sm text-gray-500">Gerar lista automática</p>
              </div>
            </div>
          </motion.button>
          
          <motion.button 
            className="p-6 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left touch-target"
            onClick={handleConfigureSMSAlerts}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <h4 className="font-medium text-gray-900">Alertas SMS</h4>
                <p className="text-sm text-gray-500">Configurar notificações</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}