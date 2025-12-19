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
                    name: "Admin DarkStore",
                    email: "admin@darkstore.com",
                    password: "admin123", // Password plain (dalam production harus hash)
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
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    cart = dataManager.getCart();
    const products = dataManager.getProducts();
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Keranjang belanja Anda kosong</p></div>';
        subtotalEl.textContent = 'Rp 0';
        discountEl.textContent = 'Rp 0';
        totalEl.textContent = 'Rp 0';
        checkoutBtn.disabled = true;
        return;
    }
    
    container.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;
        
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="${product.image}"></i>
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${product.name}</h4>
                <div class="cart-item-category">${product.category}</div>
                <div class="cart-item-price">${formatRupiah(product.price)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${product.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${product.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-item" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(cartItem);
    });
    
    // Hitung diskon voucher
    let discount = 0;
    if (activeVoucher) {
        const vouchers = dataManager.getVouchers();
        const voucher = vouchers.find(v => v.code === activeVoucher);
        if (voucher) {
            if (voucher.type === 'fixed') {
                discount = Math.min(voucher.value, subtotal);
            } else if (voucher.type === 'percentage') {
                discount = (subtotal * voucher.value) / 100;
                if (voucher.minPurchase > 0 && subtotal < voucher.minPurchase) {
                    discount = 0;
                    activeVoucher = null;
                    showNotification(`Voucher hanya berlaku untuk pembelian minimal ${formatRupiah(voucher.minPurchase)}`, 'warning');
                }
            }
        }
    }
    
    const total = subtotal - discount;
    
    subtotalEl.textContent = formatRupiah(subtotal);
    discountEl.textContent = formatRupiah(discount);
    totalEl.textContent = formatRupiah(total);
    checkoutBtn.disabled = total === 0;
    
    // Event listener untuk tombol quantity dan remove
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            updateCartQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            updateCartQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Update quantity keranjang
function updateCartQuantity(productId, change) {
    const products = dataManager.getProducts();
    cart = dataManager.getCart();
    
    const itemIndex = cart.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newQuantity = cart[itemIndex].quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > product.stock) {
        showNotification('Stok produk tidak mencukupi', 'error');
        return;
    }
    
    cart[itemIndex].quantity = newQuantity;
    dataManager.updateCart(cart);
    loadCart();
}

// Hapus dari keranjang
function removeFromCart(productId) {
    cart = dataManager.getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        dataManager.updateCart(cart);
        loadCart();
        showNotification('Produk dihapus dari keranjang', 'info');
    }
}

// Load pesanan
function loadOrders() {
    const container = document.getElementById('orders-container');
    const orders = dataManager.getOrders();
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    if (userOrders.length === 0) {
        container.innerHTML = '<div class="empty-orders"><i class="fas fa-history"></i><p>Belum ada pesanan</p></div>';
        return;
    }
    
    container.innerHTML = '';
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-info">
                <div class="order-id">${order.code}</div>
                <div class="order-date">${new Date(order.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</div>
                <div class="order-items">${order.items.length} item</div>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-total">${formatRupiah(order.total)}</div>
        `;
        container.appendChild(orderItem);
    });
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'pending': 'Menunggu',
        'processing': 'Diproses',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
}

// Load voucher user
function loadUserVouchers() {
    const container = document.getElementById('user-vouchers');
    const vouchers = dataManager.getVouchers();
    const userVouchers = vouchers.filter(voucher => {
        const now = new Date();
        const validUntil = new Date(voucher.validUntil);
        return voucher.isActive && 
               voucher.usageCount < voucher.maxUsage &&
               now < validUntil;
    });
    
    if (userVouchers.length === 0) {
        container.innerHTML = '<div class="empty-cart"><i class="fas fa-ticket-alt"></i><p>Tidak ada voucher tersedia</p></div>';
        return;
    }
    
    container.innerHTML = '';
    userVouchers.forEach(voucher => {
        const voucherCard = document.createElement('div');
        voucherCard.className = 'voucher-card';
        voucherCard.innerHTML = `
            <div class="voucher-header">
                <span class="voucher-code">${voucher.code}</span>
                <span class="voucher-remaining">Sisa: ${voucher.maxUsage - voucher.usageCount}</span>
            </div>
            <div class="voucher-value">${voucher.type === 'fixed' ? formatRupiah(voucher.value) : `${voucher.value}%`}</div>
            <div class="voucher-desc">${voucher.description}</div>
            <div class="voucher-footer">
                <span>Berlaku hingga: ${new Date(voucher.validUntil).toLocaleDateString('id-ID')}</span>
                ${voucher.minPurchase > 0 ? `<span>Min. belanja: ${formatRupiah(voucher.minPurchase)}</span>` : ''}
            </div>
        `;
        container.appendChild(voucherCard);
    });
}

// Tukar voucher
function redeemVoucher(code) {
    const vouchers = dataManager.getVouchers();
    const voucher = vouchers.find(v => v.code === code.toUpperCase() && v.isActive);
    const now = new Date();
    const validUntil = new Date(voucher?.validUntil);
    
    if (!voucher) {
        showNotification('Kode voucher tidak valid', 'error');
        return false;
    }
    
    if (now >= validUntil) {
        showNotification('Voucher telah kedaluwarsa', 'error');
        return false;
    }
    
    if (voucher.usageCount >= voucher.maxUsage) {
        showNotification('Voucher telah habis digunakan', 'error');
        return false;
    }
    
    // Tambahkan saldo ke user jika voucher fixed
    if (voucher.type === 'fixed') {
        let users = dataManager.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].balance += voucher.value;
            voucher.usageCount++;
            
            // Update data
            dataManager.updateUsers(users);
            dataManager.updateVouchers(vouchers);
            
            // Update current user
            currentUser = users[userIndex];
            localStorage.setItem('darkstore_currentUser', JSON.stringify(currentUser));
            
            // Update UI
            updateUIAfterLogin();
            
            // Tambah transaksi
            const transactions = dataManager.getTransactions();
            transactions.push({
                id: generateId(),
                userId: currentUser.id,
                type: 'voucher',
                amount: voucher.value,
                status: 'completed',
                description: `Voucher redemption: ${voucher.code}`,
                createdAt: new Date().toISOString()
            });
            dataManager.updateTransactions(transactions);
            
            showNotification(`Voucher berhasil ditukar! Anda mendapat ${formatRupiah(voucher.value)}`, 'success');
            return true;
        }
    } else {
        // Voucher persentase
        showNotification(`Voucher ${voucher.code} siap digunakan untuk diskon ${voucher.value}%`, 'success');
        return true;
    }
    
    return false;
}

// Proses checkout
function processCheckout() {
    if (cart.length === 0) {
        showNotification('Keranjang belanja kosong', 'warning');
        return;
    }
    
    // Hitung total
    const products = dataManager.getProducts();
    let subtotal = 0;
    const orderItems = [];
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            subtotal += product.price * item.quantity;
            orderItems.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                total: product.price * item.quantity
            });
        }
    });
    
    // Hitung diskon
    let discount = 0;
    let usedVoucher = null;
    if (activeVoucher) {
        const vouchers = dataManager.getVouchers();
        const voucher = vouchers.find(v => v.code === activeVoucher);
        if (voucher) {
            if (voucher.type === 'fixed') {
                discount = Math.min(voucher.value, subtotal);
            } else if (voucher.type === 'percentage') {
                discount = (subtotal * voucher.value) / 100;
            }
            voucher.usageCount++;
            usedVoucher = voucher.code;
            dataManager.updateVouchers(vouchers);
        }
    }
    
    const total = subtotal - discount;
    
    if (currentUser.balance < total) {
        showNotification('Saldo tidak mencukupi. Silakan top up terlebih dahulu.', 'error');
        return;
    }
    
    // Buat pesanan
    const orders = dataManager.getOrders();
    const order = {
        id: generateId(),
        userId: currentUser.id,
        code: `ORD-${Date.now().toString().slice(-6)}`,
        items: orderItems,
        subtotal: subtotal,
        discount: discount,
        total: total,
        status: 'pending',
        voucherUsed: usedVoucher,
        createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    dataManager.updateOrders(orders);
    
    // Kurangi saldo user
    let users = dataManager.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].balance -= total;
        currentUser = users[userIndex];
        
        // Kurangi stok produk
        orderItems.forEach(item => {
            const productIndex = products.findIndex(p => p.id === item.productId);
            if (productIndex !== -1) {
                products[productIndex].stock -= item.quantity;
            }
        });
        
        // Update semua data
        dataManager.updateUsers(users);
        dataManager.updateProducts(products);
        localStorage.setItem('darkstore_currentUser', JSON.stringify(currentUser));
        
        // Tambah transaksi
        const transactions = dataManager.getTransactions();
        transactions.push({
            id: generateId(),
            userId: currentUser.id,
            type: 'purchase',
            amount: total,
            status: 'completed',
            description: `Purchase order ${order.code}`,
            createdAt: new Date().toISOString()
        });
        dataManager.updateTransactions(transactions);
        
        // Reset cart dan voucher aktif
        cart = [];
        activeVoucher = null;
        dataManager.updateCart(cart);
        
        // Update UI
        updateUIAfterLogin();
        showNotification('Pesanan berhasil dibuat! Admin akan memproses pesanan Anda.', 'success');
        
        // Log activity
        dataManager.addLog('ORDER_CREATED', `Order ${order.code} created with total ${formatRupiah(total)}`, currentUser.id);
        
        // Simulasi notifikasi ke admin
        simulateAdminNotification(order);
    }
}

// Simulasi notifikasi ke admin
function simulateAdminNotification(order) {
    console.log(`[ADMIN NOTIFICATION] Pesanan baru: ${order.code}`);
    console.log(`Total: ${formatRupiah(order.total)}`);
    console.log(`Items: ${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}`);
    console.log(`Email user: ${currentUser.email}`);
}

// Setup navigation
function setupNavigation() {
    // Navigation links
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show target section
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.remove('hidden');
        });
    });
    
    // Back to home when clicking logo
    document.querySelector('.logo').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
        document.querySelector('.nav a[href="#home"]').classList.add('active');
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById('home').classList.remove('hidden');
    });
}

// GANTI FUNCTION INI DI script.js
function setupPaymentGateway() {
    let selectedAmount = 50000;
    let selectedMethod = 'dana';
    let transferProof = null;
    
    // Data rekening/e-wallet
    const paymentAccounts = {
        dana: {
            name: 'DANA',
            type: 'E-Wallet',
            number: '081234872173',
            accountName: 'isi sendiri',
            note: 'Gunakan fitur transfer ke nomor DANA'
        },
        gopay: {
            name: 'Gopay',
            type: 'E-Wallet',
            number: '081234872173',
            accountName: 'isi sendiri',
            note: 'Transfer via Gopay ke nomor di atas'
        },
        bri: {
            name: 'BRI',
            type: 'Bank',
            number: 'no rekening mu',
            accountName: 'isi sendiri',
            note: 'Transfer ke rekening BRI'
        },
        bca: {
            name: 'BCA',
            type: 'Bank',
            number: 'no rekening mu',
            accountName: 'isi sendiri',
            note: 'Transfer ke rekening BCA'
        },
        nobu: {
            name: 'NOBU',
            type: 'Bank',
            number: 'no rekening mu',
            accountName: 'isi sendiri',
            note: 'Transfer ke rekening NOBU'
        },
        bsi: {
            name: 'BSI',
            type: 'Bank',
            number: 'no rekening mu',
            accountName: 'isi sendiri',
            note: 'Transfer ke rekening BSI'
        },
        jatim: {
            name: 'Bank Jatim',
            type: 'Bank',
            number: 'no rekening mu',
            accountName: 'isi sendiri',
            note: 'Transfer ke rekening Bank Jatim'
        }
    };
    
    // Pilih amount top up
    document.querySelectorAll('.topup-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.topup-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            selectedAmount = parseInt(option.getAttribute('data-amount'));
        });
    });
    
    // Custom top up
    document.getElementById('custom-topup-btn').addEventListener('click', () => {
        const customAmount = parseInt(document.getElementById('custom-amount').value);
        if (customAmount && customAmount >= 10000) {
            selectedAmount = customAmount;
            showNotification(`Jumlah top up disetel ke ${formatRupiah(selectedAmount)}`, 'info');
        } else {
            showNotification('Minimum top up adalah Rp 10.000', 'error');
        }
    });
    
    // Pilih metode pembayaran
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', () => {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            selectedMethod = method.getAttribute('data-method');
        });
    });
    
    // Proses pembayaran
    document.getElementById('process-payment').addEventListener('click', () => {
        if (!currentUser) {
            showLoginModal();
            return;
        }
        
        if (selectedAmount < 10000) {
            showNotification('Minimum top up adalah Rp 10.000', 'error');
            return;
        }
        
        // Tampilkan modal payment
        document.getElementById('payment-modal').style.display = 'flex';
        showPaymentStep('method');
        loadTransferInstructions();
    });
    
    // Fungsi untuk menampilkan step payment
    function showPaymentStep(step) {
        document.querySelectorAll('.payment-step').forEach(s => s.classList.remove('active'));
        document.getElementById(`step-${step}`).classList.add('active');
    }
    
    // Load instruksi transfer
    function loadTransferInstructions() {
        const account = paymentAccounts[selectedMethod];
        const uniqueCode = generateUniqueCode();
        const totalAmount = selectedAmount + uniqueCode;
        
        // Update payment details
        document.getElementById('payment-amount').textContent = formatRupiah(selectedAmount);
        document.getElementById('payment-total').textContent = formatRupiah(totalAmount);
        document.getElementById('payment-unique-code').textContent = uniqueCode;
        
        // Show transfer instructions
        const instructionsContainer = document.getElementById('transfer-instructions');
        instructionsContainer.innerHTML = `
            <h4>Transfer ${account.name}</h4>
            <div class="account-info">
                <div class="account-item">
                    <span class="account-label">Jenis:</span>
                    <span class="account-value">${account.type}</span>
                </div>
                <div class="account-item">
                    <span class="account-label">Nomor/Rekening:</span>
                    <span class="account-value">${account.number}</span>
                </div>
                <div class="account-item">
                    <span class="account-label">Atas Nama:</span>
                    <span class="account-value">${account.accountName}</span>
                </div>
                <div class="account-item">
                    <span class="account-label">Catatan:</span>
                    <span class="account-value">${account.note}</span>
                </div>
            </div>
            
            <div class="steps-guide">
                <h5>Langkah-langkah:</h5>
                <ol>
                    <li>Buka aplikasi ${account.name} Anda</li>
                    <li>Masukkan nomor/rekening: <strong>${account.number}</strong></li>
                    <li>Atas nama: <strong>${account.accountName}</strong></li>
                    <li>Transfer jumlah: <strong>${formatRupiah(totalAmount)}</strong></li>
                    <li>${account.type === 'Bank' ? 'Gunakan kode unik di akhir nominal' : 'Pastikan jumlah transfer tepat'}</li>
                    <li>Screenshot/simpan bukti transfer</li>
                </ol>
            </div>
            
            <div class="important-note">
                <p><i class="fas fa-exclamation-triangle"></i> <strong>PENTING:</strong> Transfer harus sesuai dengan total <strong>${formatRupiah(totalAmount)}</strong> (termasuk kode unik ${uniqueCode})</p>
            </div>
        `;
        
        // Reset proof upload
        document.getElementById('proof-upload').value = '';
        document.getElementById('proof-preview').innerHTML = '';
        document.getElementById('proof-preview').classList.add('hidden');
        transferProof = null;
    }
    
    // Generate kode unik 3 digit
    function generateUniqueCode() {
        return Math.floor(Math.random() * 900) + 100;
    }
    
    // Upload proof handler
    document.getElementById('proof-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi file
            if (!file.type.match('image.*') && file.type !== 'application/pdf') {
                showNotification('Hanya file gambar atau PDF yang diizinkan', 'error');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) { // 5MB
                showNotification('Ukuran file maksimal 5MB', 'error');
                return;
            }
            
            transferProof = file;
            
            // Preview untuk gambar
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = document.getElementById('proof-preview');
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Bukti Transfer">
                        <p>${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>
                    `;
                    preview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            } else {
                // Untuk PDF
                const preview = document.getElementById('proof-preview');
                preview.innerHTML = `
                    <i class="fas fa-file-pdf" style="font-size: 3rem; color: #FF0000;"></i>
                    <p>${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>
                `;
                preview.classList.remove('hidden');
            }
        }
    });
    
    // Submit proof button
    document.getElementById('submit-proof').addEventListener('click', () => {
        if (!transferProof) {
            showNotification('Silakan upload bukti transfer terlebih dahulu', 'error');
            return;
        }
        
        // Simulasi proses upload dan verifikasi
        const uniqueCode = parseInt(document.getElementById('payment-unique-code').textContent);
        const totalAmount = selectedAmount + uniqueCode;
        
        // Buat pending transaction
        const pendingTransaction = {
            id: Date.now(),
            userId: currentUser.id,
            type: 'topup',
            amount: selectedAmount,
            method: selectedMethod,
            status: 'pending',
            totalTransfer: totalAmount,
            uniqueCode: uniqueCode,
            proofFile: transferProof.name,
            createdAt: new Date().toISOString()
        };
        
        // Simpan ke localStorage
        let transactions = dataManager.getTransactions();
        transactions.push(pendingTransaction);
        dataManager.updateTransactions(transactions);
        
        // Log activity
        dataManager.addLog('TOPUP_REQUESTED', 
            `Top up request: ${formatRupiah(selectedAmount)} via ${paymentAccounts[selectedMethod].name} - Menunggu verifikasi`, 
            currentUser.id
        );
        
        // Tampilkan success step
        showPaymentStep('success');
        document.getElementById('success-amount').textContent = formatRupiah(selectedAmount);
        document.getElementById('success-method').textContent = paymentAccounts[selectedMethod].name;
        document.getElementById('success-time').textContent = new Date().toLocaleTimeString('id-ID');
        
        // Simulasi notifikasi ke admin
        simulateAdminNotification(pendingTransaction);
        
        showNotification('Bukti transfer telah dikirim! Admin akan memverifikasi.', 'success');
    });
    
    // Selesai button
    document.getElementById('finish-payment').addEventListener('click', () => {
        document.getElementById('payment-modal').style.display = 'none';
        showNotification('Permintaan top up sedang diproses. Cek status di riwayat transaksi.', 'info');
    });
    
    // Close modal
    document.querySelector('.close-payment-modal').addEventListener('click', () => {
        document.getElementById('payment-modal').style.display = 'none';
    });
    
    // Simulasi notifikasi ke admin
    function simulateAdminNotification(transaction) {
        const account = paymentAccounts[transaction.method];
        
        console.log(`[ADMIN NOTIFICATION] Permintaan Top Up Baru!`);
        console.log(`User: ${currentUser.email}`);
        console.log(`Jumlah: ${formatRupiah(transaction.amount)}`);
        console.log(`Metode: ${account.name}`);
        console.log(`Total Transfer: ${formatRupiah(transaction.totalTransfer)}`);
        console.log(`Kode Unik: ${transaction.uniqueCode}`);
        console.log(`Bukti: ${transaction.proofFile}`);
        console.log(`Waktu: ${new Date(transaction.createdAt).toLocaleString('id-ID')}`);
        console.log('');
        console.log(`Instruksi untuk Admin:`);
        console.log(`1. Cek transfer masuk ke ${account.name}: ${account.number}`);
        console.log(`2. Verifikasi jumlah: ${formatRupiah(transaction.totalTransfer)}`);
        console.log(`3. Jika valid, tambahkan saldo ke user`);
        console.log(`4. Update status transaksi menjadi completed`);
    }
}
    
    // Fungsi untuk menampilkan step payment
    function showPaymentStep(step) {
        document.querySelectorAll('.payment-step').forEach(s => s.classList.remove('active'));
        document.getElementById(`step-${step}`).classList.add('active');
    }
    
    // Simulasi pembayaran QRIS
    function simulateQRISPayment(amount) {
        const paymentCode = `TRX-${Date.now().toString().slice(-6)}`;
        document.getElementById('payment-amount').textContent = formatRupiah(amount);
        document.getElementById('payment-code').textContent = paymentCode;
        
        // Simulasi loading QR Code
        setTimeout(() => {
            document.querySelector('.qris-loading').classList.add('hidden');
            document.getElementById('qris-canvas').classList.remove('hidden');
            
            // Buat QR Code sederhana (simulasi)
            const canvas = document.getElementById('qris-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 200;
            
            // Background putih
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 200, 200);
            
            // Pattern QR Code sederhana
            ctx.fillStyle = 'black';
            
            // Kotak besar di sudut
            ctx.fillRect(10, 10, 50, 50);
            ctx.fillRect(140, 10, 50, 50);
            ctx.fillRect(10, 140, 50, 50);
            
            // Pattern dalam
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (Math.random() > 0.5) {
                        ctx.fillRect(70 + i * 6, 70 + j * 6, 4, 4);
                    }
                }
            }
            
            // Simulasi pembayaran berhasil setelah 30 detik
            setTimeout(() => {
                if (paymentTimer) {
                    completePayment(amount, paymentCode);
                }
            }, 30000);
        }, 2000);
    }
    
    // Timer pembayaran
    function startPaymentTimer() {
        if (paymentTimer) clearInterval(paymentTimer);
        
        paymentTimer = setInterval(() => {
            timeLeft--;
            updatePaymentTimer();
            
            if (timeLeft <= 0) {
                clearInterval(paymentTimer);
                showNotification('Waktu pembayaran habis', 'error');
                document.getElementById('payment-modal').style.display = 'none';
            }
        }, 1000);
    }
    
    function updatePaymentTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('payment-timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Selesaikan pembayaran
    function completePayment(amount, paymentCode) {
        clearInterval(paymentTimer);
        
        // Tambahkan saldo ke user
        let users = dataManager.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].balance += amount;
            currentUser = users[userIndex];
            
            // Update data
            dataManager.updateUsers(users);
            localStorage.setItem('darkstore_currentUser', JSON.stringify(currentUser));
            
            // Tambah transaksi
            const transactions = dataManager.getTransactions();
            transactions.push({
                id: generateId(),
                userId: currentUser.id,
                type: 'topup',
                amount: amount,
                method: selectedMethod,
                status: 'completed',
                description: `Top up via ${selectedMethod}`,
                createdAt: new Date().toISOString()
            });
            dataManager.updateTransactions(transactions);
            
            // Log activity
            dataManager.addLog('TOPUP_SUCCESS', `Top up ${formatRupiah(amount)} via ${selectedMethod}`, currentUser.id);
            
            // Update UI
            updateUIAfterLogin();
            
            // Tampilkan success step
            showPaymentStep('success');
            document.getElementById('success-amount').textContent = formatRupiah(amount);
            document.getElementById('success-code').textContent = paymentCode;
            document.getElementById('success-time').textContent = new Date().toLocaleTimeString('id-ID');
        }
    }
    
    // Selesai button
    document.getElementById('finish-payment').addEventListener('click', () => {
        document.getElementById('payment-modal').style.display = 'none';
        showNotification('Top up berhasil! Saldo telah ditambahkan.', 'success');
    });
    
    // Close modal
    document.querySelector('.close-payment-modal').addEventListener('click', () => {
        document.getElementById('payment-modal').style.display = 'none';
        if (paymentTimer) {
            clearInterval(paymentTimer);
        }
    });
}

// Setup voucher system
function setupVoucherSystem() {
    // Buka modal voucher
    document.getElementById('open-voucher-modal').addEventListener('click', () => {
        document.getElementById('voucher-modal').style.display = 'flex';
    });
    
    // Tukar voucher
    document.getElementById('redeem-voucher').addEventListener('click', () => {
        const code = document.getElementById('voucher-code').value.trim();
        if (code) {
            if (redeemVoucher(code)) {
                document.getElementById('voucher-code').value = '';
                loadUserVouchers();
            }
        } else {
            showNotification('Masukkan kode voucher', 'error');
        }
    });
    
    // Gunakan voucher di keranjang
    document.getElementById('apply-voucher-btn').addEventListener('click', () => {
        const code = document.getElementById('apply-voucher').value.trim();
        const vouchers = dataManager.getVouchers();
        const voucher = vouchers.find(v => v.code === code.toUpperCase() && v.isActive);
        const now = new Date();
        const validUntil = new Date(voucher?.validUntil);
        
        if (!voucher) {
            showNotification('Kode voucher tidak valid', 'error');
            return;
        }
        
        if (now >= validUntil) {
            showNotification('Voucher telah kedaluwarsa', 'error');
            return;
        }
        
        if (voucher.usageCount >= voucher.maxUsage) {
            showNotification('Voucher telah habis digunakan', 'error');
            return;
        }
        
        activeVoucher = voucher.code;
        showNotification(`Voucher ${voucher.code} berhasil diterapkan`, 'success');
        loadCart();
    });
    
    // Close modal voucher
    document.querySelector('.close-voucher-modal').addEventListener('click', () => {
        document.getElementById('voucher-modal').style.display = 'none';
    });
}

// GANTI FUNCTION INI DI script.js

// Setup auth system
function setupAuth() {
    // Tampilkan modal login saat pertama kali
    if (!localStorage.getItem('darkstore_currentUser')) {
        setTimeout(() => {
            showLoginModal();
        }, 1000);
    }
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        const users = dataManager.getUsers();
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password && 
            u.isActive
        );
        
        if (user) {
            // Success login
            currentUser = user;
            localStorage.setItem('darkstore_currentUser', JSON.stringify(user));
            
            // Reset form
            document.getElementById('login-form').reset();
            
            // Update UI
            updateUIAfterLogin();
            
            // Show welcome message
            showWelcomeMessage();
            
            // Log activity
            dataManager.addLog('LOGIN_SUCCESS', `User logged in: ${email}`, user.id);
            
            // Close modal
            document.getElementById('login-modal').style.display = 'none';
        } else {
            // Failed login
            showNotification('Email atau password salah', 'error');
            dataManager.addLog('LOGIN_FAILED', `Failed login attempt: ${email}`);
            
            // Add shake animation
            const form = document.getElementById('login-form');
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
        }
    });
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        
        // Validation
        if (password.length < 6) {
            showNotification('Password minimal 6 karakter', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Password tidak sama', 'error');
            return;
        }
        
        const users = dataManager.getUsers();
        
        // Check if email already exists
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            showNotification('Email sudah terdaftar', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            balance: 0,
            role: 'user',
            isActive: true,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        dataManager.updateUsers(users);
        
        // Auto login setelah register
        currentUser = newUser;
        localStorage.setItem('darkstore_currentUser', JSON.stringify(newUser));
        
        // Reset form
        document.getElementById('register-form').reset();
        
        // Update UI
        updateUIAfterLogin();
        
        // Show success message
        showNotification('Registrasi berhasil! Selamat datang di DarkStore.', 'success');
        dataManager.addLog('REGISTER_SUCCESS', `New user registered: ${email}`, newUser.id);
        
        // Close modal
        document.getElementById('login-modal').style.display = 'none';
    });
    
    // Switch between login and register
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('modal-title').textContent = 'Daftar Akun Baru';
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    });
    
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('modal-title').textContent = 'Login ke DarkStore';
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });
    
    // Close modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('login-modal').style.display = 'none';
        
        // Jika belum login, tetap tampilkan modal
        if (!currentUser) {
            setTimeout(() => {
                document.getElementById('login-modal').style.display = 'flex';
            }, 100);
        }
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.id === 'login-modal') {
            document.getElementById('login-modal').style.display = 'none';
            
            // Jika belum login, tetap tampilkan modal
            if (!currentUser) {
                setTimeout(() => {
                    document.getElementById('login-modal').style.display = 'flex';
                }, 100);
            }
        }
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        
        if (currentUser) {
            dataManager.addLog('LOGOUT', `User logged out: ${currentUser.email}`, currentUser.id);
        }
        
        // Clear current user
        currentUser = null;
        localStorage.removeItem('darkstore_currentUser');
        
        // Reset cart
        dataManager.updateCart([]);
        
        // Show login modal
        showLoginModal();
        
        // Reset UI
        document.getElementById('user-balance').textContent = 'Rp 0';
        document.querySelector('.user-email').textContent = 'user@example.com';
        
        // Hide admin link
        document.getElementById('admin-link').classList.add('hidden');
        
        // Hide all sections except home
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById('home').classList.remove('hidden');
        
        // Reset navigation
        document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
        document.querySelector('.nav a[href="#home"]').classList.add('active');
        
        showNotification('Anda telah logout', 'info');
    });
    
    // Force login untuk aksi tertentu
    setupForceLogin();
}

// Show login modal
function showLoginModal() {
    // Reset form
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
    
    // Show login form by default
    document.getElementById('modal-title').textContent = 'Login ke DarkStore';
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    
    // Show modal
    document.getElementById('login-modal').style.display = 'flex';
}

// Show welcome message
function showWelcomeMessage() {
    // Remove existing message
    const existingMessage = document.querySelector('.welcome-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'welcome-message';
    welcomeMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Selamat datang, ${currentUser.name}!</span>
    `;
    
    document.body.appendChild(welcomeMsg);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (welcomeMsg.parentNode) {
            welcomeMsg.style.opacity = '0';
            welcomeMsg.style.transform = 'translateY(-10px)';
            setTimeout(() => welcomeMsg.remove(), 300);
        }
    }, 3000);
}

// Setup force login untuk protected actions
function setupForceLogin() {
    // Protected buttons/actions
    const protectedActions = [
        '#process-payment',        // Top up
        '#checkout-btn',           // Checkout
        '#open-voucher-modal',     // Tukar voucher
        '#apply-voucher-btn'       // Apply voucher
    ];
    
    protectedActions.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener('click', (e) => {
                if (!currentUser) {
                    e.preventDefault();
                    showLoginModal();
                    showNotification('Silakan login terlebih dahulu', 'warning');
                }
            });
        }
    });
    
    // Protected navigation
    const protectedNavs = ['#cart', '#orders', '#voucher'];
    protectedNavs.forEach(navId => {
        const navLink = document.querySelector(`.nav a[href="${navId}"]`);
        if (navLink) {
            navLink.addEventListener('click', (e) => {
                if (!currentUser) {
                    e.preventDefault();
                    showLoginModal();
                    showNotification('Silakan login untuk mengakses halaman ini', 'warning');
                    
                    // Highlight home instead
                    document.querySelectorAll('.nav a').forEach(link => {
                        link.classList.remove('active');
                    });
                    document.querySelector('.nav a[href="#home"]').classList.add('active');
                }
            });
        }
    });
}

// Update checkLoginStatus function
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('darkstore_currentUser');
    
    if (loggedInUser) {
        try {
            currentUser = JSON.parse(loggedInUser);
            
            // Check if user still exists in database
            const users = dataManager.getUsers();
            const userExists = users.some(u => u.id === currentUser.id);
            
            if (userExists) {
                updateUIAfterLogin();
                showWelcomeMessage();
            } else {
                // User tidak ditemukan, force logout
                localStorage.removeItem('darkstore_currentUser');
                currentUser = null;
                showLoginModal();
            }
        } catch (error) {
            // Invalid JSON, force logout
            localStorage.removeItem('darkstore_currentUser');
            currentUser = null;
            showLoginModal();
        }
    } else {
        showLoginModal();
    }
}

// Update initApp function
function initApp() {
    // Initialize data first
    dataManager.initData();
    
    // Check login status
    checkLoginStatus();
    
    // Setup semua function
    setupNavigation();
    setupAuth();
    setupPaymentGateway();
    setupVoucherSystem();
    setupProductFilter();
    setupCheckout();
    setupBackupSystem();
    
    // Load initial data jika sudah login
    if (currentUser) {
        loadProducts();
        loadCart();
        loadOrders();
        loadUserVouchers();
    }
}

// Setup product filter
function setupProductFilter() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            loadProducts(category);
        });
    });
}

// Setup checkout
function setupCheckout() {
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin checkout?')) {
            processCheckout();
        }
    });
}

// Setup backup/restore system
function setupBackupSystem() {
    // Backup button
    const backupBtn = document.createElement('button');
    backupBtn.className = 'btn-secondary backup-btn';
    backupBtn.innerHTML = '<i class="fas fa-download"></i> Backup Data';
    backupBtn.style.marginTop = '20px';
    backupBtn.style.marginLeft = '10px';
    
    backupBtn.addEventListener('click', () => {
        dataManager.backupData();
        showNotification('Data backup berhasil didownload', 'success');
    });
    
    // Add to admin panel area
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
        adminLink.parentNode.insertBefore(backupBtn, adminLink.nextSibling);
    }
    
    // Restore input (hidden)
    const restoreInput = document.createElement('input');
    restoreInput.type = 'file';
    restoreInput.accept = '.json';
    restoreInput.id = 'restore-file';
    restoreInput.style.display = 'none';
    
    restoreInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            dataManager.restoreData(file)
                .then(() => {
                    showNotification('Data berhasil direstore', 'success');
                    location.reload(); // Reload page untuk update data
                })
                .catch(error => {
                    showNotification('Gagal restore data: ' + error.message, 'error');
                });
        }
    });
    
    document.body.appendChild(restoreInput);
    
    // Restore button
    const restoreBtn = document.createElement('button');
    restoreBtn.className = 'btn-secondary restore-btn';
    restoreBtn.innerHTML = '<i class="fas fa-upload"></i> Restore Data';
    restoreBtn.style.marginTop = '20px';
    restoreBtn.style.marginLeft = '10px';
    
    restoreBtn.addEventListener('click', () => {
        if (confirm('Restore akan mengganti semua data dengan backup. Lanjutkan?')) {
            restoreInput.click();
        }
    });
    
    if (adminLink) {
        adminLink.parentNode.insertBefore(restoreBtn, backupBtn.nextSibling);
    }
    
    // Export logs button
    const exportLogsBtn = document.createElement('button');
    exportLogsBtn.className = 'btn-secondary export-logs-btn';
    exportLogsBtn.innerHTML = '<i class="fas fa-file-export"></i> Export Logs';
    exportLogsBtn.style.marginTop = '20px';
    exportLogsBtn.style.marginLeft = '10px';
    
    exportLogsBtn.addEventListener('click', () => {
        dataManager.exportLogs();
        showNotification('Logs berhasil diexport', 'success');
    });
    
    if (adminLink) {
        adminLink.parentNode.insertBefore(exportLogsBtn, restoreBtn.nextSibling);
    }
}

// Show login modal
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

// Initialize aplikasi
function initApp() {
    checkLoginStatus();
    setupNavigation();
    setupAuth();
    setupPaymentGateway();
    setupVoucherSystem();
    setupProductFilter();
    setupCheckout();
    setupBackupSystem();
    
    // Load data awal
    loadProducts();
    loadCart();
    loadOrders();
    loadUserVouchers();
}

// Jalankan aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', initApp);
