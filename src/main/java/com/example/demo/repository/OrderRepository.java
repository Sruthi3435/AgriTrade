package com.example.demo.repository;

import com.example.demo.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ----------- BASIC FINDERS -----------
    List<Order> findByRetailerEmail(String retailerEmail);
    List<Order> findByFarmerEmail(String farmerEmail);

    // ----------- STATS FOR FARMER -----------
    @Query("SELECT SUM(o.finalPrice) FROM Order o WHERE o.farmerEmail = :email")
    Double sumFinalPriceByFarmerEmail(@Param("email") String email);

    int countByFarmerEmailAndDeliveryStatus(String farmerEmail, String deliveryStatus);



    // ----------- STATS FOR RETAILER -----------
    @Query("SELECT SUM(o.finalPrice) FROM Order o WHERE o.retailerEmail = :email")
    Double sumFinalPriceByRetailerEmail(@Param("email") String email);

    int countByRetailerEmail(String retailerEmail);

    int countByRetailerEmailAndDeliveryStatus(String retailerEmail, String deliveryStatus);



    // ----------- RECENT ORDERS FOR RETAILER -----------
    List<Order> findTop5ByRetailerEmailOrderByCreatedAtDesc(String email);



    // ----------- ANALYTICS (MONTHLY) -----------
    @Query("""
            SELECT MONTH(o.createdAt), COUNT(o)
            FROM Order o
            WHERE o.retailerEmail = :email
            GROUP BY MONTH(o.createdAt)
           """)
    List<Object[]> countOrdersPerMonthForRetailer(@Param("email") String email);

    @Query("""
            SELECT MONTH(o.createdAt), SUM(o.finalPrice)
            FROM Order o
            WHERE o.retailerEmail = :email
            GROUP BY MONTH(o.createdAt)
           """)
    List<Object[]> spendingPerMonth(@Param("email") String email);
}
