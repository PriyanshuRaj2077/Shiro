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

    // Call openFDA API directly using search queries and return the response
    public OpenFdaResponse fetchMedicine(String name) {
        try {
            // Added wildcard * to search similar names and limited results to 15
            return restClient
                    .get()
                    .uri("https://api.fda.gov/drug/label.json?search=openfda.brand_name:" + name + "*&limit=15")
                    .retrieve()
                    .body(OpenFdaResponse.class);
        } catch (Exception e) {
            // Print error to console and return null safely if no drug is found
            System.err.println("Error fetching from openFDA: " + e.getMessage());
            return null;
        }
    }
}
