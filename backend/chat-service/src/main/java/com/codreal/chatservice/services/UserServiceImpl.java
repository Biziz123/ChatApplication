package com.codreal.chatservice.services;

import com.codreal.chatservice.exceptions.UserAlreadyExistException;
import com.codreal.chatservice.exceptions.UserNotFoundException;
import com.codreal.chatservice.model.User;
import com.codreal.chatservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;


    @Override
    public List<User> getall() throws UserNotFoundException {
        List<User> users=userRepository.findAll();
        if (users.isEmpty()){
            throw new UserNotFoundException();
        }else {
           return users;
        }
    }

    @Override
    public User addUser(User user) throws UserAlreadyExistException {
        System.out.println(user);
       Optional<User> user1= Optional.ofNullable(userRepository.findByUserName(user.getUserName()));
        System.out.println(user1);
       if (user1.isPresent()){
           throw new UserAlreadyExistException();
       }else {
           return userRepository.save(user);
       }
    }

    @Override
    public User getUserByUserName(String username) throws UserNotFoundException {
        Optional<User> user1=userRepository.findById(username);

        if (user1.isPresent()){
            return user1.get();
        }else {
            throw new UserNotFoundException();
        }
    }

    @Override
    public User getUserByUserNameAndPassword(String username, String password) throws UserNotFoundException {
        Optional<User> user1=userRepository.findById(username);
        Optional<User> user2=userRepository.findBypassword(password);

        if (user1.isPresent() && user2.isPresent()){
            return user1.get();
        }else {
            throw new UserNotFoundException();
        }
    }



}
