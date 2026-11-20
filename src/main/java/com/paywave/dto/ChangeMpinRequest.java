package com.paywave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ChangeMpinRequest {

    @NotBlank(message = "Current Mpin is required")
    @Pattern(regexp = "^[0-9]{6}$",message = "Current MPIN must be exactly 6 digits")
    private String currentMpin;

    @NotBlank(message = "New Mpin is required")
    @Pattern(regexp = "^[0-9]{6}$",message = "New MPIN must be exactly 6 digits")
    private String newMpin;

    public ChangeMpinRequest(){

    }

    public ChangeMpinRequest(String currentMpin, String newMpin){
        this.currentMpin = currentMpin;
        this.newMpin = newMpin;
    }

    public String getCurrentMpin() {
        return currentMpin;
    }

    public void setCurrentMpin(String currentMpin) {
        this.currentMpin = currentMpin;
    }

    public String getNewMpin() {
        return newMpin;
    }

    public void setNewMpin(String newMpin) {
        this.newMpin = newMpin;
    }
}
