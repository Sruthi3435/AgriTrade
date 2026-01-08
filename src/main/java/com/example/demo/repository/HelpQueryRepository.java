package com.example.demo.repository;

import com.example.demo.model.HelpQuery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HelpQueryRepository extends JpaRepository<HelpQuery, Long> {

    List<HelpQuery> findByStatusOrderByCreatedAtDesc(String status);
}
