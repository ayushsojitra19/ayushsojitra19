import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/v1",
    }),
    tagTypes: ["Products", "AdminProducts", "Product"],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: '/products',
                params: {
                    page: params?.page,
                    keyword: params?.keyword,
                    category: params?.category,
                    "price[gte]": params?.min,
                    "price[lte]": params?.max,
                    "ratings[gte]": params?.ratings,
                }
            }),
            providesTags: ["Products"]
        }),
        getProductDetails: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: "Product", id }],
        }),
        getAdminProducts: builder.query({
            query: () => `/admin/products`,
            providesTags: ["AdminProducts"],
        }),
        createProduct: builder.mutation({
            query: (body) => ({
                url: `/admin/products`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ["AdminProducts"],
        }),
        updateProduct: builder.mutation({
            query: ({ id, body }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => ["AdminProducts", "Products", { type: "Product", id }],
        }),
        uploadProductImages: builder.mutation({
            query: ({ id, body }) => ({
                url: `/admin/products/${id}/upload_images`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => ["AdminProducts", "Products", { type: "Product", id }],
        }),
        deleteProductImages: builder.mutation({
            query: ({ id, body }) => ({
                url: `/admin/products/${id}/delete_images`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => ["AdminProducts", "Products", { type: "Product", id }],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/admin/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["AdminProducts", "Products"],
        }),
    }),
});

export const { 
    useGetProductsQuery, 
    useGetProductDetailsQuery, 
    useGetAdminProductsQuery, 
    useCreateProductMutation, 
    useUpdateProductMutation, 
    useUploadProductImagesMutation, 
    useDeleteProductImagesMutation ,
    useDeleteProductMutation
} = productApi;
