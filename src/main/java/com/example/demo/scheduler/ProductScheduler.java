package com.example.demo.scheduler;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ProductScheduler {

    private final ProductRepository productRepository;
    private final BidRepository bidRepository;
    private final OrderRepository orderRepository;

    public ProductScheduler(ProductRepository productRepository,
                            BidRepository bidRepository,
                            OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.bidRepository = bidRepository;
        this.orderRepository = orderRepository;
    }

    // Runs every minute
    @Scheduled(fixedRate = 60000)
    public void closeExpiredAuctions() {

        List<Product> expiredAuctions =
                productRepository.findExpiredAuctions(
                        TradeType.AUCTION,
                        ProductStatus.ACTIVE,
                        LocalDateTime.now()
                );

        for (Product product : expiredAuctions) {

            Bid highestBid =
                    bidRepository.findTopByProductIdOrderByAmountDesc(product.getId())
                            .orElse(null);

            product.setStatus(ProductStatus.CLOSED);
            productRepository.save(product);

            if (highestBid != null) {
                Order order = new Order();
                order.setProductId(product.getId());
                order.setFarmerEmail(product.getFarmerEmail());
                order.setRetailerEmail(highestBid.getRetailerEmail());
                order.setFinalPrice(highestBid.getAmount());
                order.setOrderStatus("CONFIRMED");

                orderRepository.save(order);
            }
        }
    }
}
