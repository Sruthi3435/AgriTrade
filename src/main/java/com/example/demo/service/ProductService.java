package com.example.demo.service;

import com.example.demo.model.Product;

import java.util.List;

public interface ProductService {

    Product addProduct(Product product, String farmerEmail);

    List<Product> getProductsByFarmer(String farmerEmail);

    List<Product> getActiveProducts();

    void closeProduct(Long id);
}
