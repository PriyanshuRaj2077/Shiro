package com.shiro.controller;

import com.shiro.dto.MedicineResponse;
import com.shiro.service.MedicineService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/medicine")
public class MedicineController{

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService){
        this.medicineService = medicineService;
    }

    // Endpoint to search for a medicine by name: GET /api/medicine/search?name=dolo
    @GetMapping("/search")
    public List<MedicineResponse> search(@RequestParam String name){
        return medicineService.searchMedicine(name);
    }
}