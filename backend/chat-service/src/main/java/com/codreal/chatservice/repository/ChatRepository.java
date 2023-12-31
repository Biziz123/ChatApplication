package com.codreal.chatservice.repository;

import com.codreal.chatservice.model.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.HashSet;

@Repository
public interface ChatRepository extends MongoRepository<Chat, Integer> {

    HashSet<Chat> getChatByFirstUserName(String UserName);

    HashSet<Chat> getChatBySecondUserName(String UserName);

    HashSet<Chat> getChatByFirstUserNameAndSecondUserName(String firstUserName, String secondUserName);

    HashSet<Chat> getChatBySecondUserNameAndFirstUserName(String firstUserName, String secondUserName);
}
