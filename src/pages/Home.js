import { getProducts } from "@/api/productApi";
import ProductList from "@/components/product/ProductList";
import { Component } from "@/core/Component";
import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import Search from "@components/product/Search";

const Home = Component({
  template: () => {
    return /* HTML */ `
      <div class="min-h-screen bg-gray-50">
        <header id="header" class="bg-white shadow-sm sticky top-0 z-40"></header>
        <main class="max-w-md mx-auto px-4 py-4">
          <!-- 검색 및 필터 -->
          <div id="search" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4"></div>
          <!-- 상품 목록 -->
          <div id="products-list" class="mb-6"></div>
        </main>
        <footer id="footer" class="bg-white shadow-sm sticky top-0 z-40"></footer>
      </div>
    `;
  },

  initialState: () => ({
    products: [],
    pagination: {},
    filters: {},
    loading: true,
    error: null,
  }),

  children: ({ state, mountChildren }) => {
    // Header와 Footer는 항상 마운트
    mountChildren(Header, "#header");
    mountChildren(Footer, "#footer");
    mountChildren(Search, "#search");
    mountChildren(ProductList, "#products-list", {
      products: state.products,
      loading: state.loading,
      pagination: state.pagination,
    });
  },

  onMounted: async ({ setState }) => {
    try {
      // API 호출
      const { products, pagination, filters } = await getProducts();

      // 데이터 로드 완료 후 setState
      setState({
        products,
        pagination,
        filters,
        loading: false,
      });
      // setState 후 자동으로 render() → children() 호출됨!
    } catch (error) {
      console.error("상품 로드 실패:", error);
      setState({
        error: error.message,
        loading: false,
      });
    }
  },
});

export default Home;
