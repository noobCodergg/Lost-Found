import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api/post", 
    withCredentials: true,
  });

export const uploadPost = (formData) =>
  API.post("/upload-post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


export const getAllPost = (query = {}) => {
  return API.get('/get-all-post', {
    params: query,
  });
};


  export const deleteMovie = (id)=>API.delete(`/delete-movie/${id}`)
  export const updateMovie = (id,status) =>API.put(`/update-movie/${id}`,{status})
  export const getMovieById = (id) =>API.get(`/get-movie-by-id/${id}`)
  /**export const getProductById = (id) => API.get(`/get-product/${id}`);
  export const deleteProduct = (id) =>API.delete(`/delete-product/${id}`)

  export const updateProductById = (id, data) => API.put(`/update-product/${id}`,data);
  export const getAllProduct = () =>API.get('/get-all-products')
  export const updateProductStatus=(id)=>API.put(`/update-product-status/${id}`)
  export const getProductByStatus = ( search = '') =>
  API.get('/get-product-by-status', {
    params: { search },
  });**/