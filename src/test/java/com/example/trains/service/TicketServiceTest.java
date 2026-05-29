package com.example.trains.service;

import com.example.trains.dto.TicketDTO;
import com.example.trains.model.*;
import com.example.trains.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import java.math.BigDecimal;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private SeatRepository seatRepository;

    @InjectMocks
    private TicketService ticketService;

    @BeforeEach
    void setupSecurity() {

        User userDetails = new User(
                "user",
                "password",
                List.of(() -> "ROLE_USER")
        );

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                )
        );
    }

    @Test
    void shouldCreateTicket() {

        com.example.trains.model.User user =
                new com.example.trains.model.User();

        user.setId(1);

        Train train = new Train();
        train.setId(1);

        Wagon wagon = new Wagon();
        wagon.setTrain(train);
        wagon.setPrice(new BigDecimal(500));

        Seat seat = new Seat();
        seat.setId(1);
        seat.setNumber("A1");
        seat.setWagon(wagon);

        Schedule schedule = new Schedule();
        schedule.setId(1);
        schedule.setTrain(train);

        TicketDTO dto = new TicketDTO();
        dto.setScheduleId(1);
        dto.setSeatId(1);

        when(userRepository.findByUsername("user"))
                .thenReturn(Optional.of(user));

        when(scheduleRepository.findById(1))
                .thenReturn(Optional.of(schedule));

        when(seatRepository.findById(1))
                .thenReturn(Optional.of(seat));

        when(ticketRepository.findByScheduleId(1))
                .thenReturn(List.of());

        when(ticketRepository.save(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TicketDTO result = ticketService.createTicket(dto);

        assertNotNull(result);
        assertEquals(new BigDecimal(500), result.getPrice());
        assertEquals("A1", result.getSeatNumber());
    }

    @Test
    void shouldThrowIfSeatBelongsToAnotherTrain() {

        com.example.trains.model.User user =
                new com.example.trains.model.User();

        Train train1 = new Train();
        train1.setId(1);

        Train train2 = new Train();
        train2.setId(2);

        Wagon wagon = new Wagon();
        wagon.setTrain(train2);

        Seat seat = new Seat();
        seat.setId(1);
        seat.setWagon(wagon);

        Schedule schedule = new Schedule();
        schedule.setTrain(train1);

        TicketDTO dto = new TicketDTO();
        dto.setScheduleId(1);
        dto.setSeatId(1);

        when(userRepository.findByUsername("user"))
                .thenReturn(Optional.of(user));

        when(scheduleRepository.findById(1))
                .thenReturn(Optional.of(schedule));

        when(seatRepository.findById(1))
                .thenReturn(Optional.of(seat));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> ticketService.createTicket(dto)
        );

        assertEquals(
                "Seat does not belong to this train",
                ex.getMessage()
        );
    }

    @Test
    void shouldThrowIfSeatAlreadyTaken() {

        com.example.trains.model.User user =
                new com.example.trains.model.User();

        user.setId(1);

        Train train = new Train();
        train.setId(1);

        Wagon wagon = new Wagon();
        wagon.setTrain(train);

        Seat seat = new Seat();
        seat.setId(1);
        seat.setWagon(wagon);

        Schedule schedule = new Schedule();
        schedule.setId(1);
        schedule.setTrain(train);

        Ticket existingTicket = new Ticket();
        existingTicket.setId(99);
        existingTicket.setSeat(seat);

        TicketDTO dto = new TicketDTO();
        dto.setScheduleId(1);
        dto.setSeatId(1);

        when(userRepository.findByUsername("user"))
                .thenReturn(Optional.of(user));

        when(scheduleRepository.findById(1))
                .thenReturn(Optional.of(schedule));

        when(seatRepository.findById(1))
                .thenReturn(Optional.of(seat));

        when(ticketRepository.findByScheduleId(1))
                .thenReturn(List.of(existingTicket));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> ticketService.createTicket(dto)
        );

        assertEquals(
                "Seat already taken for this schedule",
                ex.getMessage()
        );
    }

    @Test
    void shouldReturnOnlyUserTicketsForUserRole() {

        com.example.trains.model.User user =
                new com.example.trains.model.User();

        user.setId(1);

        when(userRepository.findByUsername("user"))
                .thenReturn(Optional.of(user));

        when(ticketRepository.findByUserId(1))
                .thenReturn(List.of());

        List<TicketDTO> result = ticketService.getAllTickets();

        assertNotNull(result);
    }
}