package com.example.trains.service;

import com.example.trains.dto.SeatDTO;
import com.example.trains.model.Seat;
import com.example.trains.model.Train;
import com.example.trains.repository.SeatRepository;
import com.example.trains.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final TrainRepository trainRepository;

    public SeatService(SeatRepository seatRepository, TrainRepository trainRepository) {
        this.seatRepository = seatRepository;
        this.trainRepository = trainRepository;
    }

    // CREATE
    public SeatDTO createSeat(SeatDTO dto) {

        Train train = trainRepository.findById(dto.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        Seat seat = new Seat();
        seat.setTrain(train);
        seat.setNumber(dto.getNumber());

        Seat saved = seatRepository.save(seat);
        return mapToDTO(saved);
    }

    // GET ALL
    public List<SeatDTO> getAllSeats() {
        return seatRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // GET BY TRAIN
    public List<SeatDTO> getSeatsByTrainId(Integer trainId) {
        return seatRepository.findByTrainId(trainId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // DELETE
    public void deleteSeat(Integer id) {
        seatRepository.deleteById(id);
    }

    // MAPPER
    private SeatDTO mapToDTO(Seat seat) {
        SeatDTO dto = new SeatDTO();
        dto.setId(seat.getId());
        dto.setTrainId(seat.getTrain().getId());
        dto.setNumber(seat.getNumber());
        return dto;
    }
}