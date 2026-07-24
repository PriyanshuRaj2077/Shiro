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

    // Call client to get drug label results and map them to our response DTO
    public List<MedicineResponse> searchMedicine(String name) {
        OpenFdaResponse response = openFdaClient.fetchMedicine(name);
        List<MedicineResponse> list = new ArrayList<>();

        // Stop if response is null (e.g. 404 error from openFDA)
        if (response == null || response.getResults() == null) {
            return list;
        }

        // Loop through all drug label results
        for (Result result : response.getResults()) {
            // Make sure the result has at least a brand name
            if (result.getOpenFda() == null || 
                result.getOpenFda().getBrandName() == null || 
                result.getOpenFda().getBrandName().isEmpty()) {
                continue;
            }

            MedicineResponse medicineResponse = new MedicineResponse();
            medicineResponse.setBrandName(result.getOpenFda().getBrandName().get(0));

            // Set generic name if present
            medicineResponse.setGenericName(
                    result.getOpenFda().getGenericName() != null && !result.getOpenFda().getGenericName().isEmpty()
                            ? result.getOpenFda().getGenericName().get(0)
                            : null
            );

            // Set Purpose (use Indications as fallback for OTC drugs)
            String purpose = null;
            if (result.getPurpose() != null && !result.getPurpose().isEmpty()) {
                purpose = result.getPurpose().get(0);
            } else if (result.getIndicationsAndUsage() != null && !result.getIndicationsAndUsage().isEmpty()) {
                purpose = result.getIndicationsAndUsage().get(0);
            }
            medicineResponse.setPurpose(purpose);

            // Set Mechanism (use Active Ingredient as fallback for OTC drugs)
            String mechanism = null;
            if (result.getMechanismOfAction() != null && !result.getMechanismOfAction().isEmpty()) {
                mechanism = result.getMechanismOfAction().get(0);
            } else if (result.getActiveIngredient() != null && !result.getActiveIngredient().isEmpty()) {
                mechanism = result.getActiveIngredient().get(0);
            }
            medicineResponse.setMechanism(mechanism);

            // Set Side Effects (use Warnings as fallback for OTC drugs)
            List<String> sideEffects = null;
            if (result.getAdverseReactions() != null && !result.getAdverseReactions().isEmpty()) {
                sideEffects = result.getAdverseReactions();
            } else if (result.getWarnings() != null && !result.getWarnings().isEmpty()) {
                sideEffects = result.getWarnings();
            }
            medicineResponse.setSideEffects(sideEffects);

            list.add(medicineResponse);
        }

        return list;
    }
}