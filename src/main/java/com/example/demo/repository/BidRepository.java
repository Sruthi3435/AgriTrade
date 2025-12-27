package com.example.demo.repository;
import com.example.demo.model.Bid;

import lombok.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface BidRepository extends JpaRepository<Bid,Long> {

    List<Bid> findByProductId(Long productId);
    Optional<Bid> findTopByProductIdOrderByAmountDesc(Long productId);
    boolean existsByProductIdAndRetailerEmail(Long productId, String retailerEmail);
    List<Bid> findByRetailerEmail(String retailerEmail);
    List<Bid> findByRetailerEmailAndAcceptedTrue(String email);
    @Query("SELECT MAX(b.amount) FROM Bid b WHERE b.productId = :productId")
    Double findHighestBidForProduct(Long productId);
    @Query("SELECT MAX(b.amount) FROM Bid b WHERE b.productId = :productId")
    Double findMaxBidByProductId(@Param("productId") Long productId);

}
