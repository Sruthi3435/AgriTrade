package com.example.demo.service;

import com.example.demo.model.Order;

public interface OrderService {
    Order createOrderFromBid(Long bidId);
}
