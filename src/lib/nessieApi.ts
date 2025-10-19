import axios from "axios";

const apiBase = "https://api.nessieisreal.com";
const apiKey = process.env.NEXT_PUBLIC_NESSIE_API_KEY || "YOUR_NESSIE_API_KEY";

const nessie = axios.create({
  baseURL: apiBase,
  params: { key: apiKey }
});

export const getAccounts = async (customerId: string) =>
  nessie.get(`/accounts?customer_id=${customerId}`);

export const getTransactions = async (accountId: string) =>
  nessie.get(`/accounts/${accountId}/transactions`);

export const getPurchases = async (accountId: string) =>
  nessie.get(`/accounts/${accountId}/purchases`);
