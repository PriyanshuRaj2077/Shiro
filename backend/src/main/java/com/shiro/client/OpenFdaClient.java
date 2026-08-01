package com.shiro.client;

import com.shiro.dto.OpenFdaResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;


@Component
public class OpenFdaClient {

    private final RestClient restClient;

    public OpenFdaClient(RestClient restClient){
        this.restClient = restClient;
    }

    public OpenFdaResponse fetchMedicine(String name) {
        try {
            return restClient
                    .get()
                    .uri("https://api.fda.gov/drug/label.json?search=openfda.brand_name:" + name + "*&limit=15")
                    .retrieve()
                    .body(OpenFdaResponse.class);
        } catch (Exception e) {
            System.err.println("Error fetching from openFDA: " + e.getMessage());
            return null;
        }
    }
}
