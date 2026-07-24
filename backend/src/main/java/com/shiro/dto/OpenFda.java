package com.shiro.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class OpenFda {

    @JsonProperty("brand_name")
    private List<String> brandName;

    @JsonProperty("generic_name")
    private List<String> genericName;

    public List<String> getBrandName() {
        return brandName;
    }

    public void setBrandName(List<String> brandName) {
        this.brandName = brandName;
    }

    public List<String> getGenericName() {
        return genericName;
    }

    public void setGenericName(List<String> genericName) {
        this.genericName = genericName;
    }
}