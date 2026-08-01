package com.shiro.service;

import com.shiro.client.OpenFdaClient;
import com.shiro.dto.MedicineResponse;
import com.shiro.dto.OpenFdaResponse;
import com.shiro.dto.Result;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;

@Service
public class MedicineService {

    private final OpenFdaClient openFdaClient;

    public MedicineService(OpenFdaClient openFdaClient) {
        this.openFdaClient = openFdaClient;
    }

    public List<MedicineResponse> searchMedicine(String name) {
        OpenFdaResponse response = openFdaClient.fetchMedicine(name);
        List<MedicineResponse> list = new ArrayList<>();

        if (response == null || response.getResults() == null) {
            return list;
        }

        for (Result result : response.getResults()) {
            if (result.getOpenFda() == null ||
                result.getOpenFda().getBrandName() == null || 
                result.getOpenFda().getBrandName().isEmpty()) {
                continue;
            }

            MedicineResponse medicineResponse = new MedicineResponse();
            medicineResponse.setBrandName(result.getOpenFda().getBrandName().get(0));

            medicineResponse.setGenericName(
                    result.getOpenFda().getGenericName() != null && !result.getOpenFda().getGenericName().isEmpty()
                            ? result.getOpenFda().getGenericName().get(0)
                            : null
            );

            // waterfall for purpose

            String purpose = null;
            if (result.getPurpose() != null && !result.getPurpose().isEmpty()) {
                purpose = result.getPurpose().get(0);
            } else if (result.getIndicationsAndUsage() != null && !result.getIndicationsAndUsage().isEmpty()) {
                purpose = result.getIndicationsAndUsage().get(0);
            } else if (result.getIndicationsAndUsageTable() != null && !result.getIndicationsAndUsageTable().isEmpty()) {
                purpose = result.getIndicationsAndUsageTable().get(0);
            } else if (result.getDescription() != null && !result.getDescription().isEmpty()) {
                purpose = result.getDescription().get(0);
            } else {
                purpose = "Information about the purpose of this medicine is not available on the label.";
            }
            medicineResponse.setPurpose(purpose);

            // waterfall for mechanism

            String mechanism = null;
            if (result.getMechanismOfAction() != null && !result.getMechanismOfAction().isEmpty()) {
                mechanism = result.getMechanismOfAction().get(0);
            } else if (result.getActiveIngredient() != null && !result.getActiveIngredient().isEmpty()) {
                mechanism = "Active Ingredient: " + result.getActiveIngredient().get(0);
            } else if (result.getDescription() != null && !result.getDescription().isEmpty()) {
                mechanism = result.getDescription().get(0);
            } else {
                mechanism = "Information about how this medicine works is not available on the label.";
            }
            medicineResponse.setMechanism(mechanism);


            // waterfall fall for side effects

            List<String> sideEffects = null;
            if (result.getAdverseReactions() != null && !result.getAdverseReactions().isEmpty()) {
                sideEffects = result.getAdverseReactions();
            } else if (result.getWarnings() != null && !result.getWarnings().isEmpty()) {
                sideEffects = result.getWarnings();
            } else if (result.getWarningsAndCautions() != null && !result.getWarningsAndCautions().isEmpty()) {
                sideEffects = result.getWarningsAndCautions();
            } else if (result.getPrecautions() != null && !result.getPrecautions().isEmpty()) {
                sideEffects = result.getPrecautions();
            } else {
                List<String> fallbackSideEffects = new ArrayList<>();
                fallbackSideEffects.add("No specific side effects or warnings are reported on the label.");
                sideEffects = fallbackSideEffects;
            }
            medicineResponse.setSideEffects(sideEffects);

            list.add(medicineResponse);
        }

        return list;
    }
}