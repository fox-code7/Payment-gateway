// DarkStore E-commerce System
// Data disimpan di localStorage dengan backup/restore

class DataManager {
    constructor() {
        this.initData();
    }

    // Inisialisasi data awal
    initData() {
        // Data users
        if (!localStorage.getItem('darkstore_users')) {
            const defaultUsers = [
                {
                    id: 1,
                    name: "Admin",
                    email: "admin@fox.id",
                    password: "Fox7code", // Password plain (dalam production harus hash)
                    balance: 10000000,
                    role: "admin",
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Demo User",
                    email: "user@darkstore.com",
                    password: "user123",
                    balance: 50000,
                    role: "user",
                    isActive: true,
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('darkstore_users', JSON.stringify(defaultUsers));
        }

        // Data produk
        if (!localStorage.getItem('darkstore_products')) {
            const defaultProducts = [
                {
                    id: 1,
                    name: "Adobe Photoshop CC 2023",
                    description: "Software editing foto profesional dengan fitur lengkap",
                    price: 250000,
                    category: "Software",
                    image: "fas fa-palette",
                    stock: 50,
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Microsoft Office 365",
                    description: "Paket office lengkap untuk produktivitas",
                    price: 150000,
                    category: "Software",
                    image: "fas fa-file-word",
                    stock: 100,
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Cyberpunk 2077",
                    description: "Game RPG futuristik dengan dunia terbuka yang luas",
                    price: 350000,
                    category: "Game",
                    image: "fas fa-gamepad",
                    stock: 30,
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    name: "Website Template Premium",
                    description: "Template website responsif siap pakai untuk bisnis",
                    price: 120000,
                    category: "Template",
                    image: "fas fa-laptop-code",
                    stock: 75,
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    name: "Canva Pro 1 Tahun",
                    description: "Akses premium ke semua fitur Canva untuk desain",
                    price: 200000,
                    category: "Software",
                    image: "fas fa-paint-brush",
                    stock: 200,
                    isActive: true,
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('darkstore_products', JSON.stringify(defaultProducts));
        }

        // Data voucher
        if (!localStorage.getItem('darkstore_vouchers')) {
            const defaultVouchers = [
                {
                    id: 1,
                    code: "WELCOME10",
                    value: 10000,
                    type: "fixed",
                    description: "Voucher selamat datang untuk pengguna baru",
                    createdBy: "admin",
                    createdAt: new Date().toISOString(),
                    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    maxUsage: 100,
                    usageCount: 0,
                    minPurchase: 0,
                    isActive: true
                },
                {
                    id: 2,
                    code: "DISKON20",
                    value: 20,
                    type: "percentage",
                    description: "Diskon 20% untuk pembelian di atas 100k",
                    createdBy: "admin",
                    createdAt: new Date().toISOString(),
                    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                    maxUsage: 50,
                    usageCount: 0,
                    minPurchase: 100000,
                    isActive: true
                }
            ];
            localStorage.setItem('darkstore_vouchers', JSON.stringify(defaultVouchers));
        }

        // Data lainnya
        if (!localStorage.getItem('darkstore_orders')) {
            localStorage.setItem('darkstore_orders', JSON.stringify([]));
        }
        if (!localStorage.getItem('darkstore_transactions')) {
            localStorage.setItem('darkstore_transactions', JSON.stringify([]));
        }
        if (!localStorage.getItem('darkstore_logs')) {
            localStorage.setItem('darkstore_logs', JSON.stringify([]));
        }
        if (!localStorage.getItem('darkstore_cart')) {
            localStorage.setItem('darkstore_cart', JSON.stringify([]));
        }
    }

    // Get all data
    getUsers() {
        return JSON.parse(localStorage.getItem('darkstore_users') || '[]');
    }

    getProducts() {
        return JSON.parse(localStorage.getItem('darkstore_products') || '[]');
    }

    getOrders() {
        return JSON.parse(localStorage.getItem('darkstore_orders') || '[]');
    }

    getVouchers() {
        return JSON.parse(localStorage.getItem('darkstore_vouchers') || '[]');
    }

    getTransactions() {
        return JSON.parse(localStorage.getItem('darkstore_transactions') || '[]');
    }

    getLogs() {
        return JSON.parse(localStorage.getItem('darkstore_logs') || '[]');
    }

    getCart() {
        return JSON.parse(localStorage.getItem('darkstore_cart') || '[]');
    }

    // Update data
    updateUsers(users) {
        localStorage.setItem('darkstore_users', JSON.stringify(users));
        this.addLog('USERS_UPDATED', `Total users: ${users.length}`);
    }

    updateProducts(products) {
        localStorage.setItem('darkstore_products', JSON.stringify(products));
        this.addLog('PRODUCTS_UPDATED', `Total products: ${products.length}`);
    }

    updateOrders(orders) {
        localStorage.setItem('darkstore_orders', JSON.stringify(orders));
        this.addLog('ORDERS_UPDATED', `Total orders: ${orders.length}`);
    }

    updateVouchers(vouchers) {
        localStorage.setItem('darkstore_vouchers', JSON.stringify(vouchers));
        this.addLog('VOUCHERS_UPDATED', `Total vouchers: ${vouchers.length}`);
    }

    updateTransactions(transactions) {
        localStorage.setItem('darkstore_transactions', JSON.stringify(transactions));
        this.addLog('TRANSACTIONS_UPDATED', `Total transactions: ${transactions.length}`);
    }

    updateCart(cart) {
        localStorage.setItem('darkstore_cart', JSON.stringify(cart));
    }

    // Add log
    addLog(type, message, userId = null) {
        const logs = this.getLogs();
        const log = {
            id: Date.now(),
            type,
            message,
            userId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        logs.unshift(log);
        
        // Simpan maksimal 1000 log
        if (logs.length > 1000) {
            logs.length = 1000;
        }
        
        localStorage.setItem('darkstore_logs', JSON.stringify(logs));
    }

    // Backup semua data ke file JSON
    backupData() {
        const backup = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: {
                users: this.getUsers(),
                products: this.getProducts(),
                orders: this.getOrders(),
                vouchers: this.getVouchers(),
                transactions: this.getTransactions(),
                logs: this.getLogs()
            }
        };

        const dataStr = JSON.stringify(backup, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `darkstore_backup_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        this.addLog('BACKUP_CREATED', 'Data backup downloaded');
        return true;
    }

    // Restore data dari file JSON
    restoreData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    // Validasi backup
                    if (!backup.data || !backup.timestamp) {
                        throw new Error('Invalid backup file format');
                    }

                    // Restore data
                    if (backup.data.users) {
                        localStorage.setItem('darkstore_users', JSON.stringify(backup.data.users));
                    }
                    if (backup.data.products) {
                        localStorage.setItem('darkstore_products', JSON.stringify(backup.data.products));
                    }
                    if (backup.data.orders) {
                        localStorage.setItem('darkstore_orders', JSON.stringify(backup.data.orders));
                    }
                    if (backup.data.vouchers) {
                        localStorage.setItem('darkstore_vouchers', JSON.stringify(backup.data.vouchers));
                    }
                    if (backup.data.transactions) {
                        localStorage.setItem('darkstore_transactions', JSON.stringify(backup.data.transactions));
                    }
                    if (backup.data.logs) {
                        localStorage.setItem('darkstore_logs', JSON.stringify(backup.data.logs));
                    }

                    this.addLog('DATA_RESTORED', `Data restored from backup: ${backup.timestamp}`);
                    resolve(true);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Export logs ke file
    exportLogs() {
        const logs = this.getLogs();
        const dataStr = JSON.stringify(logs, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `darkstore_logs_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        this.addLog('LOGS_EXPORTED', `Exported ${logs.length} logs`);
        return true;
    }

    // Clear semua data (reset ke default)
    clearAllData() {
        if (confirm('Are you sure? This will reset ALL data to defaults.')) {
            localStorage.removeItem('darkstore_users');
            localStorage.removeItem('darkstore_products');
            localStorage.removeItem('darkstore_orders');
            localStorage.removeItem('darkstore_vouchers');
            localStorage.removeItem('darkstore_transactions');
            localStorage.removeItem('darkstore_logs');
            localStorage.removeItem('darkstore_cart');
            localStorage.removeItem('darkstore_currentUser');
            
            this.initData();
            this.addLog('DATA_CLEARED', 'All data cleared and reset to defaults');
            return true;
        }
        return false;
    }

    // Get statistics
    getStats() {
        const users = this.getUsers();
        const products = this.getProducts();
        const orders = this.getOrders();
        const vouchers = this.getVouchers();
        const transactions = this.getTransactions();
        const logs = this.getLogs();

        // Hitung pendapatan
        const revenue = orders
            .filter(order => order.status === 'completed')
            .reduce((sum, order) => sum + order.total, 0);

        // Pesanan hari ini
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order => 
            new Date(order.createdAt).toDateString() === today
        );

        return {
            totalUsers: users.filter(u => u.role === 'user').length,
            totalProducts: products.length,
            todayOrders: todayOrders.length,
            totalOrders: orders.length,
            totalRevenue: revenue,
            activeVouchers: vouchers.filter(v => v.isActive).length,
            totalTransactions: transactions.length,
            totalLogs: logs.length
        };
    }
}

// Inisialisasi DataManager
const dataManager = new DataManager();

// Current user
let currentUser = null;
let cart = [];
let activeVoucher = null;

// Format Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Generate ID unik
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Check login status
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('darkstore_currentUser');
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
        updateUIAfterLogin();
    } else {
        showLoginModal();
    }
}

// Update UI setelah login
function updateUIAfterLogin() {
    document.getElementById('user-balance').textContent = formatRupiah(currentUser.balance);
    document.querySelector('.user-email').textContent = currentUser.email;
    
    // Tampilkan link admin jika user adalah admin
    const adminLink = document.getElementById('admin-link');
    if (currentUser.role === 'admin') {
        adminLink.classList.remove('hidden');
    } else {
        adminLink.classList.add('hidden');
    }
    
    // Sembunyikan modal login
    document.getElementById('login-modal').style.display = 'none';
    
    // Load data
    loadProducts();
    loadCart();
    loadOrders();
    loadUserVouchers();
}

// Show notification
function showNotification(message, type = 'info') {
    // Hapus notifikasi sebelumnya
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat notifikasi baru
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Tambahkan style
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Tambahkan style animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Load produk
function loadProducts(filterCategory = 'all') {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    const products = dataManager.getProducts();
    const filteredProducts = filterCategory === 'all' 
        ? products.filter(p => p.isActive)
        : products.filter(p => p.isActive && p.category === filterCategory);
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<div class="empty-cart"><i class="fas fa-box-open"></i><p>Tidak ada produk ditemukan</p></div>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <i class="${product.image}"></i>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">${formatRupiah(product.price)}</div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
    
    // Event listener untuk tombol add to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Tambah ke keranjang
function addToCart(productId) {
    const products = dataManager.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    cart = dataManager.getCart();
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('Stok produk tidak mencukupi', 'error');
            return;
        }
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    dataManager.updateCart(cart);
    loadCart();
    showNotification('Produk ditambahkan ke keranjang', 'success');
    dataManager.addLog('CART_ADD', `Added product ${product.name} to cart`, currentUser?.id);
}

// Load keranjang
function loadCart() {
    const container = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const tota
