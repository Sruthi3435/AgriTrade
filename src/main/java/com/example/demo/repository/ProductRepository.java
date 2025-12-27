package com.example.demo.repository;
import com.example.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByFarmerEmail(String email);
    List<Product> findByClosedFalse();
    List<Product> findByClosedFalseAndBiddingEndBefore(LocalDateTime now);
    int countByFarmerEmail(String farmerEmail);

    int countByFarmerEmailAndClosedFalse(String farmerEmail);
    @Query("SELECT MAX(b.amount) FROM Bid b WHERE b.productId = :productId")
    Double findMaxBidByProductId(@Param("productId") Long productId);



}
