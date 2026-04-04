import { sanityClient, queries } from "./sanityClient.js";

export const sanityService = {
  // 獲取所有 chef menus
  async getChefMenus() {
    try {
      const result = await sanityClient.fetch(queries.getChefMenus);
      return result;
    } catch (error) {
      console.error("Error fetching chef menus:", error);
      throw error;
    }
  }, 

  // 根據 ID 獲取特定 chef menu
  async getChefMenu(id) {
    try {
      const result = await sanityClient.fetch(queries.getChefMenu, { id });
      return result;
    } catch (error) {
      console.error("Error fetching chef menu:", error);
      throw error;
    }
  },

  // 獲取所有訂單
  async getOrders() {
    try {
      const result = await sanityClient.fetch(queries.getOrders);
      return result;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // 創建新訂單（通過 Netlify Function）
  async createOrder(orderData) {
    try {
      const response = await fetch("/.netlify/functions/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
};
