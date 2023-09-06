package com.codreal.chatservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.annotation.processing.Generated;
import java.util.ArrayList;

@Document(collection = "users")
public class User {


    @Id
    private String id;

    private String userName;

    private String password;
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }



    public User(String userName,String password) {
        this.userName = userName;
        this.password=password;
    }



    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public User() {
    }

    @Override
    public String toString() {
        return "User{" +
                "userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                '}';
    }

    public User(String userName, String password,String rol) {
        this.userName = userName;this.password=password;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
