package com.example.trains.repository;

import com.example.trains.model.WagonType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WagonTypeRepository extends JpaRepository<WagonType, Integer> {
}