package com.codreal.chatservice.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface groupchat extends MongoRepository<groupchat,String> {


}
