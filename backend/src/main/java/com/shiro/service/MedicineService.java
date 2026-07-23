package com.shiro.service;

import com.shiro.client.OpenFdaClient;
import org.springframework.stereotype.Service;

@Service
public class MedicineService {

        private final OpenFdaClient openFdaClient;

        public MedicineService(OpenFdaClient openFdaClient){
            this.openFdaClient = openFdaClient;
        }
        public String searchMedicine(String name) {
            return openFdaClient.fetchMedicine(name);
        }
}
