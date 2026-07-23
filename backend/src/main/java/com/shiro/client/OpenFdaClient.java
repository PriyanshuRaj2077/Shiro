package com.shiro.client;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class OpenFdaClient {

    private final RestClient restClient;

    public OpenFdaClient(RestClient restClient){
        this.restClient = restClient;
    }

    public String fetchMedicine(String name) {
        return restClient
                .get()
                .uri("https://api.fda.gov/drug/label.json?search=openfda.brand_name:" + name)
                .retrieve()
                .body(String.class);

    }
}
