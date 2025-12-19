// Admin Panel untuk DarkStore
class AdminManager {
    constructor() {
        this.dataManager = {
            getUsers: () => JSON.parse(localStorage.getItem('darkstore_users') || '[]'),
            getProducts: () => JSON.parse(localStorage.getItem('darkstore_products') || '[]'),
            getOrders: () => JSON.parse(localStorage.getItem('darkstore_orders') || '[]'),
            getVouchers: () => JSON.parse(localStorage.getItem('darkstore_vouchers') || '[]'),
            getTransactions: () => JSON.parse(localStorage.getItem('darkstore_transactions') || '[]'),
            getLogs: () => JSON.parse(localStorage.getItem('darkstore_logs') || '[]'),
            updateUsers: (users) => localStorage.setItem('darkstore_users', JSON.stringify(users)),
            updateProducts: (products) => localStorage.setItem('darkstore_products', JSON.stringify(products)),
            updateOrders: (orders) => localStorage.setItem('darkstore_orders', JSON.stringify(orders)),
            updateVouchers: (vouchers) => localStorage.setItem('darkstore_vouchers', JSON.stringify(vouchers)),
            updateTransactions: (transactions) => localStorage.setItem('darkstore_transactions', JSON.stringify(transactions)),
            addLog: (type, message, userId = null) => {
                const logs = JSON.parse(localStorage.getItem('darkstore_logs') || '[]');
                logs.unshift({
                    id: Date.now(),
                    type,
                    message,
                    userId,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                });
                localStorage.setItem('darkstore_logs', JSON.stringify(logs));
            }
        };
    }
    
    // TAMBAHKAN DI admin-script.js (di dalam class AdminManager)
// Fungsi untuk verifikasi top up manual
verifyTopUp(transactionId) {
    const transactions = this.dataManager.getTransactions();
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
        this.showNotification('Transaksi tidak ditemukan', 'error');
        return;
    }
    
    const users = this.dataManager.getUsers();
    const userIndex = users.findIndex(u => u.id === transaction.userId);
    
    if (userIndex === -1) {
        this.showNotification('User tidak ditemukan', 'error');
        return;
    }
    
    if (confirm(`Verifikasi top up ${this.formatRupiah(transaction.amount)} dari user ${users[userIndex].email}?`)) {
        // Update saldo user
        users[userIndex].balance += transaction.amount;
        this.dataManager.updateUsers(users);
        
        // Update status transaksi
        transaction.status = 'completed';
        transaction.verifiedAt = new Date().toISOString();
        transaction.verifiedBy = 'admin';
        this.dataManager.updateTransactions(transactions);
        
        // Log activity
        this.dataManager.addLog('TOPUP_VERIFIED', 
            `Top up verified: ${this.formatRupiah(transaction.amount)} for user ${users[userIndex].email}`
        );
        
        this.showNotification('Top up berhasil diverifikasi! Saldo telah ditambahkan.', 'success');
        
        // Reload data jika diperlukan
        this.loadUsersManagement();
    }
}

    // Check admin authentication
    checkAdminAuth() {
        const currentUser = JSON.parse(localStorage.getItem('darkstore_currentUser') || 'null');
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Akses ditolak! Hanya admin yang dapat mengakses panel ini.');
            window.location.href = '../index.html';
            return false;
        }
        return true;
    }
    
    // Format Rupiah
    formatRupiah(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }
    
    // Update dashboard stats
    updateDashboardStats() {
        const users = this.dataManager.getUsers();
        const products = this.dataManager.getProducts();
        const orders = this.dataManager.getOrders();
        const vouchers = this.dataManager.getVouchers();
        const logs = this.dataManager.getLogs();
        
        // Hitung total users (exclude admin)
        const totalUsers = users.filter(u => u.role === 'user').length;
        document.getElementById('total-users').textContent = totalUsers;
        
        // Total products
        document.getElementById('total-products').textContent = products.length;
        
        // Today's orders
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order => 
            new Date(order.createdAt).toDateString() === today
        ).length;
        document.getElementById('today-orders').textContent = todayOrders;
        
        // Total revenue
        const totalRevenue = orders
            .filter(order => order.status === 'completed')
            .reduce((sum, order) => sum + order.total, 0);
        document.getElementById('total-revenue').textContent = this.formatRupiah(totalRevenue);
        
        // Load recent orders
        this.loadRecentOrders();
    }
    
    // Load recent orders
    loadRecentOrders() {
        const tbody = document.getElementById('recent-orders-body');
        const orders = this.dataManager.getOrders();
        const users = this.dataManager.getUsers();
        
        tbody.innerHTML = '';
        
        const recentOrders = [...orders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);
        
        if (recentOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 30px;">
                        <i class="fas fa-shopping-bag" style="font-size: 2rem; color: #94a3b8; margin-bottom: 10px; display: block;"></i>
                        <p style="color: #94a3b8;">Belum ada pesanan</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        recentOrders.forEach(order => {
            const user = users.find(u => u.id === order.userId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.code}</td>
                <td>${user?.name || 'Unknown'}</td>
                <td>${this.formatRupiah(order.total)}</td>
                <td><span class="status-badge status-${order.status}">${this.getStatusText(order.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-view view-order" data-id="${order.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.showOrderModal(orderId);
            });
        });
    }
    
    // Get status text
    getStatusText(status) {
        const statusMap = {
            'pending': 'Menunggu',
            'processing': 'Diproses',
            'completed': 'Selesai',
            'cancelled': 'Dibatalkan'
        };
        return statusMap[status] || status;
    }
    
    // Load products management
    loadProductsManagement() {
        const tbody = document.getElementById('products-table-body');
        const products = this.dataManager.getProducts();
        
        tbody.innerHTML = '';
        
        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 30px;">
                        <i class="fas fa-box-open" style="font-size: 2rem; color: #94a3b8; margin-bottom: 10px; display: block;"></i>
                        <p style="color: #94a3b8;">Belum ada produk</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${this.formatRupiah(product.price)}</td>
                <td>${product.stock}</td>
                <td><span class="status-badge ${product.isActive ? 'status-active' : 'status-inactive'}">
                    ${product.isActive ? 'Aktif' : 'Nonaktif'}
                </span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit edit-product" data-id="${product.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete delete-product" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.editProduct(productId);
            });
        });
        
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.deleteProduct(productId);
            });
        });
    }
    
    // Load users management
    loadUsersManagement() {
        const tbody = document.getElementById('users-table-body');
        const users = this.dataManager.getUsers();
        
        // Filter hanya user (bukan admin)
        const regularUsers = users.filter(u => u.role === 'user');
        
        tbody.innerHTML = '';
        
        if (regularUsers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 30px;">
                        <i class="fas fa-users" style="font-size: 2rem; color: #94a3b8; margin-bottom: 10px; display: block;"></i>
                        <p style="color: #94a3b8;">Belum ada pengguna</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        regularUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${this.formatRupiah(user.balance)}</td>
                <td>${user.role === 'admin' ? 'Admin' : 'User'}</td>
                <td><span class="status-badge ${user.isActive ? 'status-active' : 'status-inactive'}">
                    ${user.isActive ? 'Aktif' : 'Dibanned'}
                </span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit manage-user" data-id="${user.id}">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.manage-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.manageUser(userId);
            });
        });
    }
    
    // Load orders management
    loadOrdersManagement(filterStatus = 'all') {
        const tbody = document.getElementById('orders-table-body');
        const orders = this.dataManager.getOrders();
        const users = this.dataManager.getUsers();
        
        tbody.innerHTML = '';
        
        let filteredOrders = [...orders];
        if (filterStatus !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
        }
        
        if (filteredOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 30px;">
                        <i class="fas fa-shopping-bag" style="font-size: 2rem; color: #94a3b8; margin-bottom: 10px; display: block;"></i>
                        <p style="color: #94a3b8;">Tidak ada pesanan</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .forEach(order => {
                const user = users.find(u => u.id === order.userId);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.code}</td>
                    <td>${user?.name || 'Unknown'}</td>
                    <td>${order.items.length} item</td>
                    <td>${this.formatRupiah(order.total)}</td>
                    <td><span class="status-badge status-${order.status}">${this.getStatusText(order.status)}</span></td>
                    <td>${new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon btn-view view-order" data-id="${order.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        
        // Add event listeners
        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.showOrderModal(orderId);
            });
        });
    }
    
    // Load vouchers management
    loadVouchersManagement() {
        const tbody = document.getElementById('vouchers-table-body');
        const vouchers = this.dataManager.getVouchers();
        
        tbody.innerHTML = '';
        
        if (vouchers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align: center; padding: 30px;">
                        <i class="fas fa-ticket-alt" style="font-size: 2rem; color: #94a3b8; margin-bottom: 10px; display: block;"></i>
                        <p style="color: #94a3b8;">Belum ada voucher</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        vouchers.forEach(voucher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${voucher.code}</strong></td>
                <td>${voucher.type === 'fixed' ? this.formatRupiah(voucher.value) : `${voucher.value}%`}</td>
                <td>${voucher.type === 'fixed' ? 'Fixed' : 'Percentage'}</td>
                <td>${voucher.description || '-'}</td>
                <td>${voucher.minPurchase ? this.formatRupiah(voucher.minPurchase) : '-'}</td>
                <td>${voucher.maxUsage}</td>
                <td>${voucher.usageCount}</td>
                <td>${new Date(voucher.validUntil).toLocaleDateString('id-ID')}</td>
                <td><span class="status-badge ${voucher.isActive ? 'status-active' : 'status-inactive'}">
                    ${voucher.isActive ? 'Aktif' : 'Nonaktif'}
                </span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-delete delete-voucher" data-id="${voucher.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.delete-voucher').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const voucherId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.deleteVoucher(voucherId);
            });
        });
    }
    
    // Load logs
    loadLogs() {
        const tbody = document.getElementById('transactions-table-body');
        const logs = this.dataManager.getLogs();
        
        tbody.innerHTML = '';
        
        if (logs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 30px;">
                        <i class="fas fa-exchange-alt" style="font-size: 2rem; color: #94a3b8; margin-bottom: 10px; display: block;"></i>
                        <p style="color: #94a3b8;">Belum ada log</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        logs.slice(0, 50).forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>LOG-${log.id.toString().slice(-6)}</td>
                <td>${log.userId || 'System'}</td>
                <td>${log.type}</td>
                <td>${log.message}</td>
                <td><span class="status-badge status-completed">Log</span></td>
                <td>${new Date(log.timestamp).toLocaleString('id-ID')}</td>
                <td>${log.userAgent?.substring(0, 30)}...</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // Show order modal
    showOrderModal(orderId) {
        const orders = this.dataManager.getOrders();
        const users = this.dataManager.getUsers();
        
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        
        const user = users.find(u => u.id === order.userId);
        
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-item">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>${this.formatRupiah(item.total)}</span>
                </div>
            `;
        });
        
        document.getElementById('order-details').innerHTML = `
            <div class="order-detail-item">
                <span>Kode Pesanan:</span>
                <span>${order.code}</span>
            </div>
            <div class="order-detail-item">
                <span>Pengguna:</span>
                <span>${user?.name || 'Unknown'} (${user?.email || '-'})</span>
            </div>
            <div class="order-detail-item">
                <span>Tanggal:</span>
                <span>${new Date(order.createdAt).toLocaleString('id-ID')}</span>
            </div>
            <div class="order-detail-item">
                <span>Status:</span>
                <span class="status-badge status-${order.status}">${this.getStatusText(order.status)}</span>
            </div>
            <div class="order-items-list">
                <h4>Items:</h4>
                ${itemsHtml}
            </div>
            <div class="order-detail-item">
                <span>Subtotal:</span>
                <span>${this.formatRupiah(order.subtotal)}</span>
            </div>
            <div class="order-detail-item">
                <span>Diskon:</span>
                <span>${this.formatRupiah(order.discount)}</span>
            </div>
            <div class="order-detail-item">
                <span>Total:</span>
                <span><strong>${this.formatRupiah(order.total)}</strong></span>
            </div>
            ${order.voucherUsed ? `
            <div class="order-detail-item">
                <span>Voucher:</span>
                <span>${order.voucherUsed}</span>
            </div>
            ` : ''}
        `;
        
        document.getElementById('order-status').value = order.status;
        document.getElementById('order-modal').style.display = 'flex';
        
        // Store order id for update
        document.getElementById('update-order-btn').setAttribute('data-id', orderId);
    }
    
    // Update order status
    updateOrderStatus(orderId, newStatus) {
        const orders = this.dataManager.getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) return;
        
        orders[orderIndex].status = newStatus;
        this.dataManager.updateOrders(orders);
        
        // Jika status completed, kirim notifikasi email (simulasi)
        if (newStatus === 'completed') {
            this.simulateEmailNotification(orders[orderIndex]);
        }
        
        // Jika status cancelled, kembalikan saldo
        if (newStatus === 'cancelled') {
            const order = orders[orderIndex];
            const users = this.dataManager.getUsers();
            const userIndex = users.findIndex(u => u.id === order.userId);
            
            if (userIndex !== -1) {
                users[userIndex].balance += order.total;
                this.dataManager.updateUsers(users);
                
                // Tambah transaksi refund
                const transactions = this.dataManager.getTransactions();
                transactions.push({
                    id: Date.now(),
                    userId: order.userId,
                    type: 'refund',
                    amount: order.total,
                    status: 'completed',
                    description: `Refund for cancelled order ${order.code}`,
                    createdAt: new Date().toISOString()
                });
                this.dataManager.updateTransactions(transactions);
            }
        }
        
        // Log activity
        this.dataManager.addLog('ORDER_UPDATED', `Order ${order.code} status changed to ${newStatus}`);
        
        this.loadOrdersManagement();
        this.loadRecentOrders();
        this.showNotification('Status pesanan diperbarui', 'success');
    }
    
    // Simulate email notification
    simulateEmailNotification(order) {
        console.log(`[EMAIL NOTIFICATION] Pesanan ${order.code} telah selesai diproses`);
        console.log(`Kirim produk ke email user`);
    }
    
    // Edit product
    editProduct(productId) {
        const products = this.dataManager.getProducts();
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        document.getElementById('product-modal-title').textContent = 'Edit Produk';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-active').checked = product.isActive;
        
        document.getElementById('product-modal').style.display = 'flex';
    }
    
    // Delete product
    deleteProduct(productId) {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            const products = this.dataManager.getProducts();
            const productIndex = products.findIndex(p => p.id === productId);
            
            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                this.dataManager.updateProducts(products);
                this.dataManager.addLog('PRODUCT_DELETED', `Product deleted: ID ${productId}`);
                this.loadProductsManagement();
                this.showNotification('Produk berhasil dihapus', 'success');
            }
        }
    }
    
    // Save product
    saveProduct(formData) {
        const products = this.dataManager.getProducts();
        const productId = formData.id ? parseInt(formData.id) : Date.now();
        
        const product = {
            id: productId,
            name: formData.name,
            category: formData.category,
            description: formData.description,
            price: parseInt(formData.price),
            stock: parseInt(formData.stock),
            image: formData.image || 'fas fa-box',
            isActive: formData.active === 'on',
            createdAt: formData.id ? products.find(p => p.id === productId)?.createdAt : new Date().toISOString()
        };
        
        if (formData.id) {
            // Update existing product
            const index = products.findIndex(p => p.id === productId);
            if (index !== -1) {
                products[index] = product;
                this.dataManager.addLog('PRODUCT_UPDATED', `Product updated: ${product.name}`);
            }
        } else {
            // Add new product
            products.push(product);
            this.dataManager.addLog('PRODUCT_CREATED', `Product created: ${product.name}`);
        }
        
        this.dataManager.updateProducts(products);
        this.loadProductsManagement();
        this.updateDashboardStats();
        this.showNotification(`Produk ${formData.id ? 'diperbarui' : 'ditambahkan'}`, 'success');
    }
    
    // Manage user
    manageUser(userId) {
        const users = this.dataManager.getUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) return;
        
        const action = prompt(`Pilih aksi untuk ${user.name}:\n1. Ban/Unban\n2. Edit Saldo\n\nMasukkan angka pilihan:`);
        
        if (action === '1') {
            const newStatus = !user.isActive;
            if (confirm(`Apakah Anda yakin ingin ${newStatus ? 'membuka ban' : 'memban'} pengguna ini?`)) {
                user.isActive = newStatus;
                this.dataManager.updateUsers(users);
                this.dataManager.addLog('USER_STATUS_CHANGED', `User ${user.email} ${newStatus ? 'unbanned' : 'banned'}`);
                this.loadUsersManagement();
                this.showNotification(`Pengguna berhasil ${newStatus ? 'dibuka ban' : 'diban'}`, 'success');
            }
        } else if (action === '2') {
            const amount = prompt(`Masukkan jumlah saldo untuk ${user.name} (gunakan - untuk mengurangi):`);
            if (amount && !isNaN(amount)) {
                const changeAmount = parseInt(amount);
                user.balance += changeAmount;
                
                if (user.balance < 0) user.balance = 0;
                
                this.dataManager.updateUsers(users);
                this.dataManager.addLog('USER_BALANCE_CHANGED', `User ${user.email} balance changed by ${changeAmount}`);
                
                // Add transaction
                const transactions = this.dataManager.getTransactions();
                transactions.push({
                    id: Date.now(),
                    userId: user.id,
                    type: 'adjustment',
                    amount: Math.abs(changeAmount),
                    status: 'completed',
                    description: `Admin adjustment: ${changeAmount > 0 ? 'Added' : 'Deducted'} ${this.formatRupiah(Math.abs(changeAmount))}`,
                    createdAt: new Date().toISOString()
                });
                this.dataManager.updateTransactions(transactions);
                
                this.loadUsersManagement();
                this.showNotification(`Saldo ${user.name} diubah menjadi ${this.formatRupiah(user.balance)}`, 'success');
            }
        }
    }
    
    // Create voucher
    createVoucher() {
        document.getElementById('voucher-form').reset();
        document.getElementById('voucher-modal').style.display = 'flex';
    }
    
    // Delete voucher
    deleteVoucher(voucherId) {
        if (confirm('Apakah Anda yakin ingin menghapus voucher ini?')) {
            const vouchers = this.dataManager.getVouchers();
            const voucherIndex = vouchers.findIndex(v => v.id === voucherId);
            
            if (voucherIndex !== -1) {
                vouchers.splice(voucherIndex, 1);
                this.dataManager.updateVouchers(vouchers);
                this.dataManager.addLog('VOUCHER_DELETED', `Voucher deleted: ID ${voucherId}`);
                this.loadVouchersManagement();
                this.showNotification('Voucher berhasil dihapus', 'success');
            }
        }
    }
    
    // Save voucher
    saveVoucher(formData) {
        const vouchers = this.dataManager.getVouchers();
        
        const voucher = {
            id: Date.now(),
            code: formData.code.toUpperCase(),
            value: parseFloat(formData.value),
            type: formData.type,
            description: formData.description,
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
            validUntil: formData.validUntil,
            maxUsage: parseInt(formData.maxUsage),
            usageCount: 0,
            minPurchase: formData.minPurchase ? parseInt(formData.minPurchase) : 0,
            isActive: true
        };
        
        vouchers.push(voucher);
        this.dataManager.updateVouchers(vouchers);
        this.dataManager.addLog('VOUCHER_CREATED', `Voucher created: ${voucher.code}`);
        this.loadVouchersManagement();
        this.showNotification('Voucher berhasil dibuat', 'success');
    }
    
    // Add balance to user
    addBalanceToUser() {
        const users = this.dataManager.getUsers();
        const userSelect = document.getElementById('user-select');
        
        userSelect.innerHTML = '<option value="">Pilih Pengguna</option>';
        
        const regularUsers = users.filter(u => u.role === 'user' && u.isActive);
        regularUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name} (${user.email}) - Saldo: ${this.formatRupiah(user.balance)}`;
            userSelect.appendChild(option);
        });
        
        document.getElementById('balance-form').reset();
        document.getElementById('balance-modal').style.display = 'flex';
    }
    
    // Process balance adjustment
    processBalanceAdjustment(formData) {
        const userId = parseInt(formData.userId);
        const users = this.dataManager.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            this.showNotification('Pengguna tidak ditemukan', 'error');
            return;
        }
        
        const amount = parseInt(formData.amount);
        const action = formData.action;
        
        if (action === 'add') {
            users[userIndex].balance += amount;
        } else if (action === 'subtract') {
            users[userIndex].balance -= amount;
            if (users[userIndex].balance < 0) {
                users[userIndex].balance = 0;
            }
        }
        
        this.dataManager.updateUsers(users);
        this.dataManager.addLog('USER_BALANCE_ADJUSTED', `User ${users[userIndex].email} balance ${action === 'add' ? 'added' : 'subtracted'} ${amount}`);
        
        // Add transaction record
        const transactions = this.dataManager.getTransactions();
        transactions.push({
            id: Date.now(),
            userId: userId,
            type: 'adjustment',
            amount: amount,
            status: 'completed',
            reason: formData.reason || 'Admin adjustment',
            createdAt: new Date().toISOString()
        });
        this.dataManager.updateTransactions(transactions);
        
        this.loadUsersManagement();
        this.showNotification(`Saldo ${action === 'add' ? 'ditambahkan' : 'dikurangi'} sebesar ${this.formatRupiah(amount)}`, 'success');
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
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
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
    
    // Backup data
    backupData() {
        const backup = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: {
                users: this.dataManager.getUsers(),
                products: this.dataManager.getProducts(),
                orders: this.dataManager.getOrders(),
                vouchers: this.dataManager.getVouchers(),
                transactions: this.dataManager.getTransactions(),
                logs: this.dataManager.getLogs()
            }
        };

        const dataStr = JSON.stringify(backup, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `darkstore_backup_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        this.dataManager.addLog('BACKUP_CREATED', 'Data backup downloaded by admin');
        this.showNotification('Backup data berhasil didownload', 'success');
    }
    
    // Export logs
    exportLogs() {
        const logs = this.dataManager.getLogs();
        const dataStr = JSON.stringify(logs, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `darkstore_logs_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        this.dataManager.addLog('LOGS_EXPORTED', `Exported ${logs.length} logs by admin`);
        this.showNotification('Logs berhasil diexport', 'success');
    }
    
    // Setup navigation
    setupAdminNavigation() {
        // Navigation links
        document.querySelectorAll('.admin-nav a').forEach(link => {
            if (link.classList.contains('back-to-store')) return;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.admin-nav a').forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Hide all sections
                document.querySelectorAll('.admin-section').forEach(section => {
                    section.classList.add('hidden');
                });
                
                // Show target section
                const targetId = link.getAttribute('href').substring(1);
                document.getElementById(targetId).classList.remove('hidden');
                
                // Load data for the section
                switch(targetId) {
                    case 'products':
                        this.loadProductsManagement();
                        break;
                    case 'users':
                        this.loadUsersManagement();
                        break;
                    case 'orders':
                        this.loadOrdersManagement();
                        break;
                    case 'vouchers':
                        this.loadVouchersManagement();
                        break;
                    case 'transactions':
                        this.loadLogs();
                        break;
                }
            });
        });
    }
    
    // Setup modals
    setupModals() {
        // Product modal
        document.getElementById('add-new-product').addEventListener('click', () => {
            document.getElementById('product-modal-title').textContent = 'Tambah Produk Baru';
            document.getElementById('product-form').reset();
            document.getElementById('product-id').value = '';
            document.getElementById('product-active').checked = true;
            document.getElementById('product-modal').style.display = 'flex';
        });
        
        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                id: document.getElementById('product-id').value,
                name: document.getElementById('product-name').value,
                category: document.getElementById('product-category').value,
                description: document.getElementById('product-description').value,
                price: document.getElementById('product-price').value,
                stock: document.getElementById('product-stock').value,
                image: document.getElementById('product-image').value,
                active: document.getElementById('product-active').checked ? 'on' : 'off'
            };
            
            this.saveProduct(formData);
            document.getElementById('product-modal').style.display = 'none';
        });
        
        // Voucher modal
        document.getElementById('create-voucher').addEventListener('click', () => this.createVoucher());
        document.getElementById('create-voucher-btn').addEventListener('click', () => this.createVoucher());
        
        document.getElementById('voucher-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                code: document.getElementById('voucher-code').value,
                value: document.getElementById('voucher-value').value,
                type: document.getElementById('voucher-type').value,
                description: document.getElementById('voucher-description').value,
                maxUsage: document.getElementById('voucher-max-usage').value,
                minPurchase: document.getElementById('voucher-min-purchase').value,
                validUntil: document.getElementById('voucher-valid-until').value
            };
            
            this.saveVoucher(formData);
            document.getElementById('voucher-modal').style.display = 'none';
        });
        
        // Balance modal
        document.getElementById('add-balance-btn').addEventListener('click', () => this.addBalanceToUser());
        
        document.getElementById('balance-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                userId: document.getElementById('user-select').value,
                action: document.getElementById('balance-action').value,
                amount: document.getElementById('balance-amount').value,
                reason: document.getElementById('balance-reason').value
            };
            
            this.processBalanceAdjustment(formData);
            document.getElementById('balance-modal').style.display = 'none';
        });
        
        // Order status update
        document.getElementById('update-order-btn').addEventListener('click', () => {
            const orderId = parseInt(document.getElementById('update-order-btn').getAttribute('data-id'));
            const newStatus = document.getElementById('order-status').value;
            
            this.updateOrderStatus(orderId, newStatus);
            document.getElementById('order-modal').style.display = 'none';
        });
        
        // Order status filter
        document.getElementById('order-status-filter').addEventListener('change', (e) => {
            this.loadOrdersManagement(e.target.value);
        });
        
        // Close all modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }
    
    // Setup backup buttons
    setupBackupButtons() {
        // Backup button
        const backupBtn = document.createElement('button');
        backupBtn.className = 'btn-secondary';
        backupBtn.innerHTML = '<i class="fas fa-download"></i> Backup Data';
        backupBtn.style.marginLeft = '10px';
        
        backupBtn.addEventListener('click', () => {
            this.backupData();
        });
        
        // Add to quick actions
        const quickActions = document.querySelector('.quick-actions .actions-grid');
        if (quickActions) {
            quickActions.appendChild(backupBtn);
        }
        
        // Export logs button
        const exportLogsBtn = document.createElement('button');
        exportLogsBtn.className = 'btn-secondary';
        exportLogsBtn.innerHTML = '<i class="fas fa-file-export"></i> Export Logs';
        exportLogsBtn.style.marginLeft = '10px';
        
        exportLogsBtn.addEventListener('click', () => {
            this.exportLogs();
        });
        
        if (quickActions) {
            quickActions.appendChild(exportLogsBtn);
        }
    }
    
    // Initialize admin
    initAdmin() {
        if (!this.checkAdminAuth()) return;
        
        this.updateDashboardStats();
        this.setupAdminNavigation();
        this.setupModals();
        this.setupBackupButtons();
        
        // Load initial data
        this.loadProductsManagement();
        this.loadUsersManagement();
        this.loadOrdersManagement();
        this.loadVouchersManagement();
        this.loadLogs();
        
        // Setup quick actions
        document.getElementById('send-notif-btn').addEventListener('click', () => {
            this.showNotification('Fitur notifikasi akan datang!', 'info');
        });
    }
}

// Initialize admin when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const adminManager = new AdminManager();
    adminManager.initAdmin();
});
