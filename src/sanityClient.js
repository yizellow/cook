import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "rav5u5wh",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || "2025-01-01",
  useCdn: true, // set to `false` to bypass the edge cache
});

// GROQ queries
export const queries = {
  // 獲取所有 chefMenu
  getChefMenus: `*[_type == "chefMenu"] | order(order asc) {
    _id,
    _type,
    title,
    order,
    question1,
    question2,
    question3
  }`,

  // 根據 ID 獲取特定 chefMenu
  getChefMenu: `*[_type == "chefMenu" && _id == $id][0] {
    _id,
    _type,
    title,
    order,
    question1,
    question2,
    question3
  }`,

  // 獲取所有訂單
  getOrders: `*[_type == "order"] | order(_createdAt desc) {
    _id,
    _type,
    customer,
    order,
    _createdAt
  }`,

  // 按 chef 分組獲取訂單
  getOrdersGroupedByChef: `*[_type == "order"] | order(_createdAt desc) {
    _id,
    customer,
    order,
    _createdAt
  }`,
};
