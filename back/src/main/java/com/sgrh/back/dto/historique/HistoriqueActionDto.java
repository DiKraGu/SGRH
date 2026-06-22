package com.sgrh.back.dto.historique;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoriqueActionDto {

    private Long id;
    private LocalDateTime dateAction;
    private String utilisateur;
    private String action;
    private String details;
}