package com.example.trains.repository;

import com.example.trains.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    @Query("""
    SELECT s FROM Schedule s
    WHERE s.train.id = :trainId
    AND s.arrivalTime < :newDeparture
    AND s.departureTime > :newArrival
""")
    List<Schedule> findConflictingSchedules(
            @Param("trainId") Integer trainId,
            @Param("newArrival") LocalDateTime newArrival,
            @Param("newDeparture") LocalDateTime newDeparture
    );
}