// Financial Manager Application
class FinancialManager {
    constructor() {
        this.transactions = this.loadTransactions();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.updateDisplay();
        this.renderTransactions();
    }

    setupEventListeners() {
        const form = document.getElementById('transaction-form');
        const filterType = document.getElementById('filter-type');
        const clearAll = document.getElementById('clear-all');
        const transactionsList = document.getElementById('transactions-list');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        filterType.addEventListener('change', () => this.renderTransactions());
        clearAll.addEventListener('click', () => this.clearAllTransactions());
        
        // Event delegation for delete buttons
        transactionsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('transaction-delete')) {
                const transactionId = parseInt(e.target.getAttribute('data-transaction-id'));
                this.deleteTransaction(transactionId);
            }
        });
    }

    setDefaultDate() {
        const dateInput = document.getElementById('date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    handleSubmit(e) {
        e.preventDefault();

        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;

        if (!description || !amount || amount <= 0) {
            alert('Please enter valid transaction details');
            return;
        }

        const transaction = {
            id: Date.now() + Math.random(), // Prevent duplicate IDs
            description,
            amount,
            type,
            category,
            date,
            timestamp: new Date().toISOString()
        };

        this.addTransaction(transaction);
        e.target.reset();
        this.setDefaultDate();
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.saveTransactions();
        this.updateDisplay();
        this.renderTransactions();
        this.showNotification(`Transaction added: ${transaction.description}`);
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveTransactions();
        this.updateDisplay();
        this.renderTransactions();
        this.showNotification('Transaction deleted');
    }

    clearAllTransactions() {
        if (this.transactions.length === 0) {
            alert('No transactions to clear');
            return;
        }

        if (confirm('Are you sure you want to delete all transactions? This cannot be undone.')) {
            this.transactions = [];
            this.saveTransactions();
            this.updateDisplay();
            this.renderTransactions();
            this.showNotification('All transactions cleared');
        }
    }

    calculateTotals() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;

        return { income, expenses, balance };
    }

    updateDisplay() {
        const { income, expenses, balance } = this.calculateTotals();

        document.getElementById('balance').textContent = this.formatCurrency(balance);
        document.getElementById('income').textContent = this.formatCurrency(income);
        document.getElementById('expenses').textContent = this.formatCurrency(expenses);

        // Update balance color based on positive/negative
        const balanceElement = document.getElementById('balance');
        if (balance < 0) {
            balanceElement.style.color = '#e74c3c';
        } else {
            balanceElement.style.color = '#ffffff';
        }
    }

    renderTransactions() {
        const filterType = document.getElementById('filter-type').value;
        const transactionsList = document.getElementById('transactions-list');

        let filteredTransactions = this.transactions;
        if (filterType !== 'all') {
            filteredTransactions = this.transactions.filter(t => t.type === filterType);
        }

        // Sort by date (newest first) - cache date parsing for efficiency
        filteredTransactions.sort((a, b) => {
            const dateA = a._cachedDate || (a._cachedDate = new Date(a.date));
            const dateB = b._cachedDate || (b._cachedDate = new Date(b.date));
            return dateB - dateA;
        });

        if (filteredTransactions.length === 0) {
            transactionsList.innerHTML = '<p class="empty-state">No transactions found</p>';
            return;
        }

        transactionsList.innerHTML = filteredTransactions.map(transaction => `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-info">
                    <div class="transaction-description">${this.escapeHtml(transaction.description)}</div>
                    <div class="transaction-details">
                        <span class="transaction-category">📁 ${this.escapeHtml(transaction.category)}</span>
                        <span class="transaction-date">📅 ${this.formatDate(transaction.date)}</span>
                    </div>
                </div>
                <span class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </span>
                <button class="transaction-delete" data-transaction-id="${transaction.id}">
                    Delete
                </button>
            </div>
        `).join('');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(Math.abs(amount));
    }

    formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        // Simple notification - could be enhanced with a toast library
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    loadTransactions() {
        try {
            const data = localStorage.getItem('financialTransactions');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading transactions:', error);
            return [];
        }
    }

    saveTransactions() {
        try {
            localStorage.setItem('financialTransactions', JSON.stringify(this.transactions));
        } catch (error) {
            console.error('Error saving transactions:', error);
            alert('Error saving transactions. Please check your browser storage settings.');
        }
    }
}

// Add CSS animation
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

// Initialize the app
new FinancialManager();
