package com.example.demo.service;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repo;

    public ProductServiceImpl(ProductRepository repo) {
        this.repo = repo;
    }
    @Override
    public Product addProduct(Product product, String farmerEmail) {

        product.setFarmerEmail(farmerEmail);



        product.setClosed(false);

        return repo.save(product);
    }



    @Override
    public List<Product> getProductsByFarmer(String farmerEmail) {
        return repo.findByFarmerEmail(farmerEmail);
    }

    @Override
    public List<Product> getActiveProducts() {
        return repo.findByClosedFalse();
    }

    @Override
    public void closeProduct(Long id) {
        Product p = repo.findById(id).orElseThrow();
        p.setClosed(true);
        repo.save(p);
    }
}
