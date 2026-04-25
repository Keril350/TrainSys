package com.example.trains.repository;

import com.example.trains.model.Wagon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WagonRepository extends JpaRepository<Wagon, Integer> {

    List<Wagon> findByTrainId(Integer trainId);

    boolean existsByTrainIdAndNumber(Integer trainId, Integer number);
}