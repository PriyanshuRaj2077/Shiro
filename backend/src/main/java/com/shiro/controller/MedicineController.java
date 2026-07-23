package com.shiro.controller;

import com.shiro.service.MedicineService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/medicine")
public class MedicineController{

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService){
        this.medicineService = medicineService;
    }

    @GetMapping("/search")
    public String search(@RequestParam String name){
        return medicineService.searchMedicine(name);
    }
}