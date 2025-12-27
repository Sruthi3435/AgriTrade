package com.example.demo.service;

import com.example.demo.model.Bid;
import com.example.demo.model.Order;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepo;
    private final BidRepository bidRepo;

    public OrderServiceImpl(OrderRepository orderRepo, BidRepository bidRepo) {
        this.orderRepo = orderRepo;
        this.bidRepo = bidRepo;
    }

    @Override
    public Order createOrderFromBid(Long bidId) {
        Bid bid = bidRepo.findById(bidId).orElseThrow();

        Order order = new Order();        // default constructor

        order.setProductId(bid.getProductId());
        order.setRetailerEmail(bid.getRetailerEmail());
        order.setFinalPrice(bid.getAmount());
        order.setFarmerEmail(bid.getFarmerEmail());
        order.setCreatedAt(LocalDateTime.now());

        order.setDeliveryStatus("CONFIRMED");

        return orderRepo.save(order);
    }

}
