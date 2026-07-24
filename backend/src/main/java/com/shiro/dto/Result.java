package com.shiro.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

// Represents a single drug result inside openFDA response list
public class Result {

    @JsonProperty("openfda")
    private OpenFda openFda;

    private List<String> purpose;

    @JsonProperty("mechanism_of_action")
    private List<String> mechanismOfAction;

    @JsonProperty("adverse_reactions")
    private List<String> adverseReactions;

    @JsonProperty("active_ingredient")
    private List<String> activeIngredient;

    @JsonProperty("indications_and_usage")
    private List<String> indicationsAndUsage;

    private List<String> warnings;

    // Getters and Setters
    public OpenFda getOpenFda() {
        return openFda;
    }

    public void setOpenFda(OpenFda openFda) {
        this.openFda = openFda;
    }

    public List<String> getPurpose() {
        return purpose;
    }

    public void setPurpose(List<String> purpose) {
        this.purpose = purpose;
    }

    public List<String> getMechanismOfAction() {
        return mechanismOfAction;
    }

    public void setMechanismOfAction(List<String> mechanismOfAction) {
        this.mechanismOfAction = mechanismOfAction;
    }

    public List<String> getAdverseReactions() {
        return adverseReactions;
    }

    public void setAdverseReactions(List<String> adverseReactions) {
        this.adverseReactions = adverseReactions;
    }

    public List<String> getActiveIngredient() {
        return activeIngredient;
    }

    public void setActiveIngredient(List<String> activeIngredient) {
        this.activeIngredient = activeIngredient;
    }

    public List<String> getIndicationsAndUsage() {
        return indicationsAndUsage;
    }

    public void setIndicationsAndUsage(List<String> indicationsAndUsage) {
        this.indicationsAndUsage = indicationsAndUsage;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }
}