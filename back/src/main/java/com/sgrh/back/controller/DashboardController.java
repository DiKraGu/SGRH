package com.sgrh.back.controller;

import com.sgrh.back.dto.dashboard.RhDashboardStatsDto;
import com.sgrh.back.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/rh/stats")
    public RhDashboardStatsDto getRhStats() {
        return dashboardService.getRhStats();
    }
}