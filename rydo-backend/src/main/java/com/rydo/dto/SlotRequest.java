package com.rydo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlotRequest {
    private Long bikeId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
