package com.paywave.controller;

import com.paywave.dto.UserRequest;
import org.springframework.web.bind.annotation.*;

@RestController
public class HelloController {
    @GetMapping("/api/hello")
    public String sayHello(){
        return "Hello Welcome to the payWave";
    }

    @GetMapping("/api/users/{id}")
    public String getUser(@PathVariable int id){
        return "User Id "+ id;
    }

    @GetMapping("/api/transactions")
    public String getTransactions(@RequestParam int limit){
        return "Showing last " + limit + " transactions";
    }

    @GetMapping("api/users/{id}/transaction")
    public String getUserTransaction( @PathVariable int id , @RequestParam(defaultValue = "5") int limit){
        return "Showing last " + limit + " transaction for User " + id;
    }

    @PostMapping("/api/users/register")
    public String registration(@RequestBody UserRequest userRequest){
        return "Registration received ! Name : " + userRequest.getName() + "Mobile Number : " + userRequest.getMobileNumber() + "Email : " + userRequest.getEmail();
    }
}
