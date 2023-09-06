package com.codreal.chatservice.repository;

import com.codreal.chatservice.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository  extends MongoRepository<User, String> {
    Optional<User> findBypassword(String password);

    public User findByUserName(String userName);
}
