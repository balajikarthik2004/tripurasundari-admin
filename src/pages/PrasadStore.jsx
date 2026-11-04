import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Package,
  Layers,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  TrendingUp,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDevoteeServices } from '../context/DevoteeServicesContext';
import ModulePageHeader from '../components/devotee-services/shared/ModulePageHeader';
import ModuleTabs from '../components/devotee-services/shared/ModuleTabs';
import ModuleMetricCard from '../components/devotee-services/shared/ModuleMetricCard';
import DevoteeProfileDrawer from '../components/devotee-services/shared/DevoteeProfileDrawer';
import ReceiptModal from '../components/devotee-services/shared/ReceiptModal';
import CreateOrderModal from '../components/devotee-services/store/CreateOrderModal';
import ProductModal from '../components/devotee-services/store/ProductModal';
import AdjustStockModal from '../components/devotee-services/store/AdjustStockModal';

export default function PrasadStore() {
  const {
    products,
    orders,
    inventoryLogs,
    toggleProductActive,
    updateOrderStatus,
    getDevoteeById,
  } = useDevoteeServices();

  const [activeTab, setActiveTab] = useState('overview');
  const [inventorySubTab, setInventorySubTab] = useState('products');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [productCatFilter, setProductCatFilter] = useState('All');

  // Modals & Drawers
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [productModalConfig, setProductModalConfig] = useState({ isOpen: false, editingProduct: null });
  const [adjustStockProduct, setAdjustStockProduct] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedDevoteeForProfile, setSelectedDevoteeForProfile] = useState(null);

  // Metrics
  const metrics = useMemo(() => {
    const totalProds = products.length;
    const activeProds = products.filter((p) => p.status === 'active').length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Preparing' || o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
    const lowStockCount = products.filter((p) => p.availability === 'Low Stock' || p.stock <= p.threshold).length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'Cancelled' ? o.totalAmount : 0), 0);

    return { totalProds, activeProds, totalOrders, pendingOrders, lowStockCount, totalRevenue };
  }, [products, orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'All' && o.orderStatus !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchesId = o.id.toLowerCase().includes(q);
        const matchesName = o.devoteeName.toLowerCase().includes(q);
        const matchesMobile = o.mobile.includes(q);
        if (!matchesId && !matchesName && !matchesMobile) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (productCatFilter === 'All') return products;
    return products.filter((p) => p.category === productCatFilter);
  }, [products, productCatFilter]);

  const trendData = [
    { time: '08:00 AM', sales: 4200 },
    { time: '10:00 AM', sales: 12500 },
    { time: '12:00 PM', sales: 24000 },
    { time: '02:00 PM', sales: 15800 },
    { time: '04:00 PM', sales: 21300 },
    { time: '06:00 PM', sales: 28900 },
  ];

  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: ShoppingBag },
    { id: 'orders', label: 'Orders & Billing', icon: Layers, badge: orders.length, dot: metrics.pendingOrders > 0 },
    { id: 'inventory-products', label: 'Products & Inventory', icon: Package, badge: metrics.lowStockCount > 0 ? `${metrics.lowStockCount} Low` : products.length, badgeColor: metrics.lowStockCount > 0 ? 'bg-amber-100 text-amber-800' : null },
  ];

  const handlePrintOrderReceipt = (order) => {
    setSelectedReceipt({
      receiptNumber: `PRASAD-${order.id}`,
      date: order.orderDate,
      transactionRef: `POS-${order.id}`,
      paymentMode: order.paymentMode || 'Counter Payment',
      donorName: order.devoteeName,
      devoteeId: order.devoteeId,
      mobile: order.mobile,
      category: 'Temple Prasad & Articles Billing',
      amount: order.totalAmount,
      notes: order.items.map((i) => `${i.productName} (Qty: ${i.quantity})`).join(', '),
    });
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <ModulePageHeader
        title="Prasad & Temple Store Management"
        primaryActionLabel="Create Store Order"
        onPrimaryAction={() => setIsCreateOrderOpen(true)}
        primaryActionIcon={ShoppingBag}
      />

      {/* Tabs Navigation */}
      <ModuleTabs tabs={tabsConfig} activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* 5 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <ModuleMetricCard
              label="Store Products"
              value={metrics.totalProds}
              icon={Package}
              iconBg="bg-[#55132D]/10 text-[#55132D]"
              onClick={() => { setActiveTab('inventory-products'); setInventorySubTab('products'); }}
            />
            <ModuleMetricCard
              label="Orders Recorded"
              value={metrics.totalOrders}
              trend="+16% daily surge"
              icon={ShoppingBag}
              iconBg="bg-blue-50 text-blue-700"
              onClick={() => setActiveTab('orders')}
            />
            <ModuleMetricCard
              label="Pending Fulfillment"
              value={metrics.pendingOrders}
              icon={Clock}
              iconBg="bg-amber-50 text-amber-700"
              onClick={() => setActiveTab('orders')}
            />
            <ModuleMetricCard
              label="Low Stock Alerts"
              value={metrics.lowStockCount}
              icon={AlertTriangle}
              iconBg="bg-rose-50 text-rose-700"
              onClick={() => setActiveTab('inventory')}
            />
            <ModuleMetricCard
              label="Today's Store Sales"
              value={`₹${metrics.totalRevenue.toLocaleString('en-IN')}`}
              icon={TrendingUp}
              iconBg="bg-emerald-50 text-emerald-700"
            />
          </div>

          {/* Holy Prasad Stock Velocity & Counter Inventory Health - Full Width & Spacious */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200/70">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  Holy Prasad Stock Velocity &amp; Counter Inventory Health
                </h3>
              </div>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md flex items-center gap-1.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Fresh Batch 2 In Oven</span>
              </span>
            </div>

            {/* Counter Outlets & Kitchen Status Cards - 3 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-bold text-stone-500 tracking-wider">West Gate Counter</div>
                  <div className="font-serif font-bold text-stone-900 text-lg sm:text-xl mt-1">
                    984 <span className="text-xs text-stone-500 font-sans font-normal">units sold</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                  Main Portal
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-bold text-stone-500 tracking-wider">East Lake Counter</div>
                  <div className="font-serif font-bold text-stone-900 text-lg sm:text-xl mt-1">
                    642 <span className="text-xs text-stone-500 font-sans font-normal">units sold</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                  Ghat Outlet
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-bold text-stone-500 tracking-wider">Confectionery Trust Unit</div>
                  <div className="font-serif font-bold text-amber-900 text-lg sm:text-xl mt-1">
                    Batch 2 <span className="text-xs text-amber-700 font-sans font-normal">in oven</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                  Fresh Baking
                </span>
              </div>
            </div>

            {/* Holy Prasad Items - Spacious Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {[
                {
                  name: 'Special Matabari Peda Pack (500g)',
                  category: 'Holy Temple Bhog',
                  current: 140,
                  target: 400,
                  unit: 'packs',
                  color: 'bg-amber-600',
                  alert: 'Reorder Active',
                  badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
                },
                {
                  name: 'Maha Bhog Prasad Box (Grand Assortment)',
                  category: 'Royal Prasad Offering',
                  current: 85,
                  target: 200,
                  unit: 'boxes',
                  color: 'bg-[#55132D]',
                  alert: 'Fast Moving',
                  badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
                },
                {
                  name: 'Sacred Vermilion Sindoor & Red Chunri Kit',
                  category: 'Devi Shringar Seva',
                  current: 220,
                  target: 300,
                  unit: 'kits',
                  color: 'bg-rose-600',
                  alert: 'Adequate Stock',
                  badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                },
                {
                  name: 'Panchamrita Holy Water Flask (250ml)',
                  category: 'Consecrated Abhishek',
                  current: 310,
                  target: 500,
                  unit: 'flasks',
                  color: 'bg-teal-600',
                  alert: 'Adequate Stock',
                  badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                },
                {
                  name: 'Kalyansagar Turtle Puffed Rice Packets',
                  category: 'Lake Feeding Seva',
                  current: 480,
                  target: 600,
                  unit: 'pouches',
                  color: 'bg-blue-600',
                  alert: 'Ghat Standby',
                  badgeStyle: 'bg-blue-50 text-blue-800 border-blue-200',
                },
                {
                  name: 'Pure Cow Milk Peda Box (250g)',
                  category: 'Fresh Daily Confection',
                  current: 190,
                  target: 250,
                  unit: 'boxes',
                  color: 'bg-emerald-600',
                  alert: 'Fresh Batch',
                  badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                },
              ].map((item, idx) => {
                const pct = Math.min(100, Math.round((item.current / item.target) * 100));
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-stone-50/60 border border-stone-200/70 space-y-3 hover:border-stone-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-stone-900 text-xs sm:text-sm leading-snug">{item.name}</div>
                        <div className="text-[11px] text-stone-400 font-medium mt-0.5">{item.category}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${item.badgeStyle}`}>
                        {item.alert}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-500 font-medium">Available Inventory:</span>
                        <span className="font-bold text-stone-900 font-mono">
                          {item.current} <span className="text-stone-400 font-normal">/ {item.target} {item.unit}</span>{' '}
                          <span className="text-stone-600">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-200/80 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & INVENTORY (Strict 3-Tab Grouping) */}
      {activeTab === 'inventory-products' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100/90 rounded-xl border border-stone-200/80 w-fit">
            <button
              onClick={() => setInventorySubTab('products')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                inventorySubTab === 'products'
                  ? 'bg-white text-[#55132D] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Product Catalogue (${products.length})
            </button>
            <button
              onClick={() => setInventorySubTab('inventory')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                inventorySubTab === 'inventory'
                  ? 'bg-white text-[#55132D] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Stock Ledger & Audit</span>
              {metrics.lowStockCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-white">
                  ${metrics.lowStockCount} Low
                </span>
              )}
            </button>
          </div>

          {inventorySubTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif">Store Product Catalogue</h3>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={productCatFilter}
                onChange={(e) => setProductCatFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Prasad">Prasad</option>
                <option value="Puja Articles">Puja Articles</option>
                <option value="Souvenirs">Souvenirs</option>
              </select>
              <button
                onClick={() => setProductModalConfig({ isOpen: true, editingProduct: null })}
                className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => {
              const isLow = p.stock <= p.threshold;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-stone-200/90 hover:border-[#B68A36]/50 shadow-xs p-4 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {p.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isLow ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {p.availability}
                      </span>
                    </div>

                    <h4 className="font-bold text-stone-900 font-serif text-sm mb-1">{p.name}</h4>
                    <p className="text-xs text-stone-500 leading-relaxed mb-3 min-h-[34px]">{p.description}</p>

                    <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Retail Price:</span>
                        <strong className="text-[#55132D] font-number font-bold text-sm">₹{p.price}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Available Stock:</span>
                        <strong className="text-stone-800">{p.stock} {p.unit}s</strong>
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-400">
                        <span>Threshold:</span>
                        <span>{p.threshold} {p.unit}s</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setAdjustStockProduct(p)}
                      className="text-xs font-semibold text-[#55132D] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Adjust Stock</span>
                    </button>
                    <button
                      onClick={() => setProductModalConfig({ isOpen: true, editingProduct: p })}
                      className="px-2 py-1 text-[11px] font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
        </div>
      )}

      {/* TAB 3: ORDERS & BILLING */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Order ID, Devotee, or Mobile..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#55132D]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Ready">Ready for Pickup</option>
                <option value="Preparing">Preparing</option>
                <option value="Completed">Completed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                onClick={() => setIsCreateOrderOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-[#55132D] hover:bg-[#681B37] rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Order</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Devotee Information</th>
                    <th className="py-3 px-4">Items Ordered</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Fulfilment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#55132D] whitespace-nowrap">
                        {o.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            const dev = getDevoteeById(o.devoteeId);
                            if (dev) setSelectedDevoteeForProfile(dev);
                          }}
                          className="font-bold text-stone-900 hover:text-[#55132D] hover:underline text-left block"
                        >
                          {o.devoteeName}
                        </button>
                        <span className="text-[11px] text-stone-500">{o.mobile}</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          {o.items.map((i, idx) => (
                            <div key={idx} className="text-[11px] text-stone-800">
                              {i.productName} <span className="font-bold text-stone-900">(x{i.quantity})</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-stone-900 font-serif text-sm whitespace-nowrap">
                        ₹{o.totalAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-stone-800 block">{o.fulfilmentMethod}</span>
                        <span className="text-[11px] text-stone-400">{o.orderDate}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            o.orderStatus === 'Completed'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : o.orderStatus === 'Ready'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 animate-pulse'
                              : o.orderStatus === 'Cancelled'
                              ? 'bg-stone-100 text-stone-600 border-stone-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {o.orderStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handlePrintOrderReceipt(o)}
                            className="p-1.5 text-stone-500 hover:text-[#55132D] hover:bg-stone-100 rounded-md"
                            title="Print Order Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {o.orderStatus === 'Ready' && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'Completed')}
                              className="px-2 py-1 text-[11px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                            >
                              Mark Fulfilled
                            </button>
                          )}

                          {o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Completed' && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'Cancelled')}
                              className="px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 rounded"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INVENTORY SUB-TAB */}
      {activeTab === 'inventory-products' && inventorySubTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-serif">Inventory Ledger & Stock Audit Trail</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Live Stock Status */}
            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-3">
              <h4 className="font-bold text-stone-900 font-serif text-sm border-b border-stone-100 pb-2">
                Current Stock by SKU
              </h4>
              <div className="divide-y divide-stone-100">
                {products.map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-stone-900 block">{p.name}</strong>
                      <span className="text-[11px] text-stone-400 font-mono">{p.id} • Buffer Alert: {p.threshold}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${p.stock <= p.threshold ? 'text-rose-700' : 'text-stone-800'}`}>
                        {p.stock} {p.unit}s
                      </span>
                      <button
                        onClick={() => setAdjustStockProduct(p)}
                        className="p-1 rounded text-[#55132D] hover:bg-[#55132D]/10"
                        title="Adjust Stock"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-3">
              <h4 className="font-bold text-stone-900 font-serif text-sm border-b border-stone-100 pb-2">
                Recent Stock Movements
              </h4>
              <div className="space-y-2.5 max-h-96 overflow-y-auto">
                {inventoryLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{log.productName}</span>
                      <span className={log.change > 0 ? 'text-emerald-700' : 'text-rose-700'}>
                        {log.change > 0 ? `+${log.change}` : log.change} units
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">{log.reason}</p>
                    <div className="flex justify-between text-[10px] text-stone-400 mt-1 pt-1 border-t border-stone-200/40">
                      <span>{log.timestamp} • {log.recordedBy}</span>
                      <span>Balance: {log.updatedStock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Profile Drawer */}
      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
      />

      <ProductModal
        isOpen={productModalConfig.isOpen}
        onClose={() => setProductModalConfig({ isOpen: false, editingProduct: null })}
        editingProduct={productModalConfig.editingProduct}
      />

      <AdjustStockModal
        isOpen={!!adjustStockProduct}
        onClose={() => setAdjustStockProduct(null)}
        product={adjustStockProduct}
      />

      <ReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receiptData={selectedReceipt}
      />

      <DevoteeProfileDrawer
        devotee={selectedDevoteeForProfile}
        onClose={() => setSelectedDevoteeForProfile(null)}
      />
    </div>
  );
}

