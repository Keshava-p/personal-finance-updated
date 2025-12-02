import api from './api';

export interface Bill {
    _id: string;
    title: string;
    amount: number;
    dueDate: string;
    isPaid: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBillData {
    title: string;
    amount: number;
    dueDate: string;
}

export const billService = {
    getBills: async (): Promise<Bill[]> => {
        try {
            const response = await api.get('/bills');
            return response.data.bills || [];
        } catch (error) {
            console.error('Failed to fetch bills:', error);
            return [];
        }
    },

    createBill: async (billData: CreateBillData): Promise<Bill | null> => {
        try {
            const response = await api.post('/bills', billData);
            return response.data.bill;
        } catch (error) {
            console.error('Failed to create bill:', error);
            return null;
        }
    },

    updateBill: async (id: string, billData: Partial<CreateBillData & { isPaid: boolean }>): Promise<Bill | null> => {
        try {
            const response = await api.put(`/bills/${id}`, billData);
            return response.data.bill;
        } catch (error) {
            console.error('Failed to update bill:', error);
            return null;
        }
    },

    deleteBill: async (id: string): Promise<boolean> => {
        try {
            await api.delete(`/bills/${id}`);
            return true;
        } catch (error) {
            console.error('Failed to delete bill:', error);
            return false;
        }
    },
};
