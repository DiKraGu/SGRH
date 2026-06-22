package com.sgrh.back.controller;

import com.sgrh.back.dto.historique.HistoriqueActionDto;
import com.sgrh.back.service.HistoriqueActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/historique")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class HistoriqueActionController {

    private final HistoriqueActionService historiqueActionService;

    @GetMapping
    public List<HistoriqueActionDto> getHistorique() {
        return historiqueActionService.getHistorique();
    }
}