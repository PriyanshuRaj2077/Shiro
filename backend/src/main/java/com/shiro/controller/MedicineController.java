package com.shiro.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//@RestController
//@RequestMapping(/"api/medicine")
//public class MedicineController {
//
//    @GetMapping("/hello")
//    public String hello() {
//        return "Hello from Shiro!";
//    }
//}

@RestController
@RequestMapping("/api/medicine")
public class MedicineController{
    @GetMapping("/search")
    public String search(@RequestParam String name){
         if (name.equals("paracetamole")){
            return "details of paracetamole";}
        }
        return "Medicine not found";
    }
}