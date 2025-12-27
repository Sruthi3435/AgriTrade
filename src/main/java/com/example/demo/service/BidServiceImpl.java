package com.example.demo.service;

import com.example.demo.model.Bid;
import com.example.demo.model.Product;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidServiceImpl implements BidService {

    private final BidRepository bidRepo;
    private final ProductRepository productRepo;

    public BidServiceImpl(BidRepository bidRepo, ProductRepository productRepo) {
        this.bidRepo = bidRepo;
        this.productRepo = productRepo;
    }

    @Override
    public Bid placeBid(Long productId, double amount, String retailerEmail) {

        Product product = productRepo.findById(productId).orElseThrow();

        if (product.isClosed())
            throw new RuntimeException("Bidding closed");

        Bid bid = new Bid();    // <-- use default constructor
        bid.setProductId(productId);
        bid.setRetailerEmail(retailerEmail);
        bid.setAmount(amount);
        bid.setCreatedAt(LocalDateTime.now());

        return bidRepo.save(bid);
    }

    @Override
    public List<Bid> getBids(Long productId) {
        return bidRepo.findByProductId(productId);
    }
}
