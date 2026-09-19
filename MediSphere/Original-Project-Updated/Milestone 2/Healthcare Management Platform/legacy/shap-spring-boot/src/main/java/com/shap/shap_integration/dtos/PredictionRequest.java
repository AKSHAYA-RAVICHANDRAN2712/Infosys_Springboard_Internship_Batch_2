package com.shap.shap_integration.dtos;

public class PredictionRequest {

    private double age;
    private double sysBP;
    private double totChol;
    private double BMI;
    private double glucose;

    public double getAge() {
        return age;
    }

    public void setAge(double age) {
        this.age = age;
    }

    public double getSysBP() {
        return sysBP;
    }

    public void setSysBP(double sysBP) {
        this.sysBP = sysBP;
    }

    public double getTotChol() {
        return totChol;
    }

    public void setTotChol(double totChol) {
        this.totChol = totChol;
    }

    public double getBMI() {
        return BMI;
    }

    public void setBMI(double BMI) {
        this.BMI = BMI;
    }

    public double getGlucose() {
        return glucose;
    }

    public void setGlucose(double glucose) {
        this.glucose = glucose;
    }
}
