package com.example.trains.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommentDTO {

    private Integer id;
    private String username;
    private String content;
    private LocalDateTime createdAt;
}