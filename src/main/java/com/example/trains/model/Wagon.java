package com.example.trains.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "wagon", uniqueConstraints = @UniqueConstraint(columnNames = {"train_id", "number"}))
@Getter
@Setter
public class Wagon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 🔗 вагон принадлежит поезду
    @ManyToOne
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;

    // номер вагона (1,2,3...)
    @Column(nullable = false)
    private Integer number;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}