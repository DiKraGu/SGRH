package com.sgrh.back.service;

import com.sgrh.back.dto.historique.HistoriqueActionDto;
import com.sgrh.back.entity.HistoriqueAction;
import com.sgrh.back.repository.HistoriqueActionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoriqueActionService {

    private final HistoriqueActionRepository historiqueActionRepository;

    public void enregistrerAction(String utilisateur, String action, String details) {
        HistoriqueAction historiqueAction = HistoriqueAction.builder()
                .dateAction(LocalDateTime.now())
                .utilisateur(utilisateur)
                .action(action)
                .details(details)
                .build();

        historiqueActionRepository.save(historiqueAction);
    }

    public List<HistoriqueActionDto> getHistorique() {
        return historiqueActionRepository.findAllByOrderByDateActionDesc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    private HistoriqueActionDto toDto(HistoriqueAction historiqueAction) {
        return HistoriqueActionDto.builder()
                .id(historiqueAction.getId())
                .dateAction(historiqueAction.getDateAction())
                .utilisateur(historiqueAction.getUtilisateur())
                .action(historiqueAction.getAction())
                .details(historiqueAction.getDetails())
                .build();
    }
}