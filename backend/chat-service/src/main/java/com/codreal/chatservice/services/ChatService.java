package com.codreal.chatservice.services;

import com.codreal.chatservice.exceptions.ChatAlreadyExistException;
import com.codreal.chatservice.exceptions.ChatNotFoundException;
import com.codreal.chatservice.exceptions.NoChatExistsInTheRepository;
import com.codreal.chatservice.model.Chat;
import com.codreal.chatservice.model.MediaType;
import com.codreal.chatservice.model.Message;
import com.codreal.chatservice.model.User;

import java.util.HashSet;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface ChatService {

    public Chat addChat(Chat chat) throws ChatAlreadyExistException;

    public void deleteChats(int chatId);

    List<Chat> findallchats() throws NoChatExistsInTheRepository;

    Chat getById(int id) throws ChatNotFoundException;

    HashSet<Chat> getChatByFirstUserName(String username) throws ChatNotFoundException;

    HashSet<Chat> getChatBySecondUserName(String username) throws ChatNotFoundException;

    HashSet<Chat> getChatByFirstUserNameOrSecondUserName(String username) throws ChatNotFoundException;

    HashSet<Chat> getChatByFirstUserNameAndSecondUserName(String firstUserName, String secondUserName)
            throws ChatNotFoundException;

    Chat addMessage(Message add, int chatId) throws ChatNotFoundException;

    Chat addMediaMessage(Message add, Integer chatId, MultipartFile image, String fileType, String userId,
            MediaType mediaType) throws ChatNotFoundException, Exception;
}
