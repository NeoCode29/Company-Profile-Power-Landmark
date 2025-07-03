export interface PaymentHistoryItem {
  orderId: string;
  transactionId: string;
  amount: number;
  status: string;
  paymentType: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export class PaymentHistoryManager {
  private static readonly STORAGE_KEY = 'payment_history';
  private static readonly MAX_HISTORY_SIZE = 50;

  // Save payment to history
  static savePayment(payment: PaymentHistoryItem): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const history = this.getHistory();
      
      // Check if payment already exists
      const existingIndex = history.findIndex(h => h.orderId === payment.orderId);
      
      if (existingIndex !== -1) {
        // Update existing payment
        history[existingIndex] = { ...history[existingIndex], ...payment, updatedAt: new Date().toISOString() };
      } else {
        // Add new payment to the beginning
        history.unshift(payment);
      }
      
      // Keep only the latest payments
      const limitedHistory = history.slice(0, this.MAX_HISTORY_SIZE);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedHistory));
      return true;
    } catch (error) {
      console.error('Error saving payment to history:', error);
      return false;
    }
  }

  // Get all payment history
  static getHistory(): PaymentHistoryItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const savedHistory = localStorage.getItem(this.STORAGE_KEY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error('Error loading payment history:', error);
      return [];
    }
  }

  // Update payment status
  static updatePaymentStatus(orderId: string, status: string, transactionId?: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const history = this.getHistory();
      const paymentIndex = history.findIndex(h => h.orderId === orderId);
      
      if (paymentIndex !== -1) {
        history[paymentIndex] = {
          ...history[paymentIndex],
          status,
          transactionId: transactionId || history[paymentIndex].transactionId,
          updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  }

  // Remove payment from history
  static removePayment(orderId: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const history = this.getHistory();
      const filteredHistory = history.filter(h => h.orderId !== orderId);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredHistory));
      return true;
    } catch (error) {
      console.error('Error removing payment from history:', error);
      return false;
    }
  }

  // Clear all history
  static clearHistory(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing payment history:', error);
      return false;
    }
  }

  // Get payment by order ID
  static getPaymentByOrderId(orderId: string): PaymentHistoryItem | null {
    const history = this.getHistory();
    return history.find(h => h.orderId === orderId) || null;
  }

  // Get statistics
  static getStatistics() {
    const history = this.getHistory();
    
    return {
      total: history.length,
      successful: history.filter(h => h.status === 'capture' || h.status === 'settlement').length,
      pending: history.filter(h => h.status === 'pending').length,
      failed: history.filter(h => ['deny', 'cancel', 'expire', 'failure'].includes(h.status)).length,
      totalAmount: history.reduce((sum, h) => sum + h.amount, 0),
      successfulAmount: history
        .filter(h => h.status === 'capture' || h.status === 'settlement')
        .reduce((sum, h) => sum + h.amount, 0)
    };
  }

  // Search payments
  static searchPayments(query: string): PaymentHistoryItem[] {
    const history = this.getHistory();
    const lowercaseQuery = query.toLowerCase();
    
    return history.filter(payment => 
      payment.orderId.toLowerCase().includes(lowercaseQuery) ||
      payment.transactionId.toLowerCase().includes(lowercaseQuery) ||
      payment.customerName.toLowerCase().includes(lowercaseQuery) ||
      payment.customerEmail.toLowerCase().includes(lowercaseQuery) ||
      payment.paymentType.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Filter payments by status
  static filterByStatus(status: string): PaymentHistoryItem[] {
    const history = this.getHistory();
    return history.filter(payment => payment.status === status);
  }

  // Get payments in date range
  static getPaymentsByDateRange(startDate: Date, endDate: Date): PaymentHistoryItem[] {
    const history = this.getHistory();
    
    return history.filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }
} 