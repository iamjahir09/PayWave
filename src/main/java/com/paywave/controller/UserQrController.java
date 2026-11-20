package com.paywave.controller;

import com.paywave.dto.UserQrResponse;
import com.paywave.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserQrController {

    private final UserService userService;

    public UserQrController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/my-qr")
    public ResponseEntity<UserQrResponse> getMyQrCode(){
        UserQrResponse response = userService.getMyQrCode();
        return ResponseEntity.ok(response);
    }
}
