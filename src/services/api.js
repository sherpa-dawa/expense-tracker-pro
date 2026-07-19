const API_BASE_URL = 'https://api.expensetracker.com/v1';

class ApiService {
  async request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  async getExpenses(userId) { return this.request(`/expenses?userId=${userId}`); }
  async createExpense(data) { return this.request('/expenses', { method: 'POST', body: JSON.stringify(data) }); }
  async updateExpense(id, data) { return this.request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async deleteExpense(id) { return this.request(`/expenses/${id}`, { method: 'DELETE' }); }
  async syncData(userId, data) { return this.request(`/sync/${userId}`, { method: 'POST', body: JSON.stringify(data) }); }
}

export const api = new ApiService();
