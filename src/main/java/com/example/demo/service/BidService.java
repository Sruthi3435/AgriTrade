package com.example.demo.service;

import com.example.demo.model.Bid;
import java.util.List;

public interface BidService {
    Bid placeBid(Long productId, double amount, String retailerEmail);
    List<Bid> getBids(Long productId);
}
