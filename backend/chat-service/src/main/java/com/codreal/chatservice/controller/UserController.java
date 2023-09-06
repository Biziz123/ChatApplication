package com.codreal.chatservice.controller;

import com.codreal.chatservice.exceptions.UserAlreadyExistException;
import com.codreal.chatservice.exceptions.UserNotFoundException;
import com.codreal.chatservice.model.Media;
import com.codreal.chatservice.model.MediaType;
import com.codreal.chatservice.model.User;
import com.codreal.chatservice.services.MediaService;
import com.codreal.chatservice.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private MediaService mediaService;

    @GetMapping("/getall")
    public ResponseEntity<List<User>> getall() throws IOException {
        try {
            return new ResponseEntity<List<User>>(userService.getall(), HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return new ResponseEntity("User not Found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<User> addUser(@RequestBody User user) throws IOException {
        try {
            return new ResponseEntity<User>(userService.addUser(user), HttpStatus.OK);
        } catch (UserAlreadyExistException e) {
            return new ResponseEntity("User already exists", HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/getbyusername/{username}")
    public ResponseEntity<User> getUserByUserName(@PathVariable String username) throws IOException {
        try {
            return new ResponseEntity<User>(userService.getUserByUserName(username), HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return new ResponseEntity("User not Found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getbyusernameandPassword/{username}/{password}")
    public ResponseEntity<User> getUserByUserNameandPassword(@PathVariable Map<String, String> pathVarsMap)
            throws IOException {
        try {
            return new ResponseEntity<User>(
                    userService.getUserByUserNameAndPassword(pathVarsMap.get("username"), pathVarsMap.get("password")),
                    HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return new ResponseEntity("User not Found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/profilePic/upload")
    public ResponseEntity<String> uploadProfilePic(
            @RequestParam("image") MultipartFile image, @RequestParam("userId") String userId,
            @RequestParam("fileType") String fileType)
            throws IOException {
        try {
            mediaService.uploadMedia(Integer.MIN_VALUE, image, MediaType.PROFILE_PICTURE, userId, fileType);
            return ResponseEntity.ok().body("Profile pic uploaded");
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.unprocessableEntity().body(e.getLocalizedMessage());
        }
    }

    @GetMapping("/profilePic/{userId}")
    public ResponseEntity<Media> getProfilePic(@PathVariable String userId)
            throws IOException {
        try {
            Media media = mediaService.getMedia(userId, MediaType.PROFILE_PICTURE);
            return ResponseEntity.ok().body(media);
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.notFound().build();
        }
    }

}
