package com.shiro.service;

import org.springframework.stereotype.Service;

@Service
public class MedicineService {
    public String searchMedicine(String name){
        if(name.equals("paracetamol")){
            return "details of paracetamol";
        }
        return "Medicine not found";
    }
}
