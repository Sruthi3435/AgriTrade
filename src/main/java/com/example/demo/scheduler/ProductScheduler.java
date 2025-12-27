package com.example.demo.scheduler;


import com.example.demo.model.Product;
import com.example.demo.model.Order;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.OrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
public class ProductScheduler {

    private final ProductRepository productRepo;
    private final BidRepository bidRepo;
    private final OrderRepository orderRepo;

    public ProductScheduler(ProductRepository productRepo,
                            BidRepository bidRepo,
                            OrderRepository orderRepo) {
        this.productRepo = productRepo;
        this.bidRepo = bidRepo;
        this.orderRepo = orderRepo;
    }

    @Scheduled(fixedRate = 60000)
    public void closeExpiredBids() {
        List<Product> active = productRepo.findByClosedFalse();

        for (Product p : active) {
            if (p.getBiddingEnd() != null && LocalDateTime.now().isAfter(p.getBiddingEnd())) {
                p.setClosed(true);
                productRepo.save(p);
            }
        }
    }

}
