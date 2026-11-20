package com.paywave.controller;

import com.paywave.dto.ChangeMpinRequest;
import com.paywave.dto.UpdateProfileRequest;
import com.paywave.dto.UserProfileResponse;
import com.paywave.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {
    private final UserService userService;

    public UserProfileController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(){
        UserProfileResponse profile = userService.getMyProfile();
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request){
        UserProfileResponse updatedProfile = userService.updateMyProfile(request);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/change-mpin")
    public ResponseEntity<String> changeMpin(@Valid @RequestBody ChangeMpinRequest request){
        userService.changeMpin(request);
        return ResponseEntity.ok("Mpin changed succesfully");
    }
}
