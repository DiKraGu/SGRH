package com.sgrh.back.controller;

import com.sgrh.back.dto.dashboard.AdminDashboardStatsDto;
import com.sgrh.back.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/stats")
    public AdminDashboardStatsDto getAdminStats() {
        return adminDashboardService.getAdminStats();
    }
}