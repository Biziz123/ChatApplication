package com.codreal.chatservice.services;

import com.codreal.chatservice.exceptions.ChatNotFoundException;
import com.codreal.chatservice.exceptions.NoChatExistsInTheRepository;
import com.codreal.chatservice.model.Chat;
import com.codreal.chatservice.model.Media;
import com.codreal.chatservice.model.MediaType;
import com.codreal.chatservice.model.Message;
import com.codreal.chatservice.repository.ChatRepository;

import org.apache.tomcat.util.buf.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    private MediaService mediaService;

    public Chat addChat(Chat chat) {
        chat.setChatId(sequenceGeneratorService.generateSequence(Chat.SEQUENCE_NAME));
        return chatRepository.save(chat);
    }

    public void deleteChats(int chatId) {
        chatRepository.deleteById(chatId);
    }

    @Override
    public List<Chat> findallchats() throws NoChatExistsInTheRepository {
        if (chatRepository.findAll().isEmpty()) {
            throw new NoChatExistsInTheRepository();
        } else {
            return chatRepository.findAll();
        }

    }

    @Override
    public Chat getById(int id) throws ChatNotFoundException {
        Optional<Chat> chatid = chatRepository.findById(id);
        if (chatid.isPresent()) {
            Chat chat = chatid.get();
            if (chat.getMessageList() != null && !chat.getMessageList().isEmpty()) {
                chat.getMessageList().stream().map((message) -> {
                    if (message != null) {
                        if (message.getReplyMedia() != null) {
                            String mediaId = message.getReplyMedia();
                            Media media = this.mediaService.getMediaById(mediaId);
                            message.setReplyMediaContent(media);
                        }
                    }
                    return message;
                }).collect(Collectors.toList());
            }
            return chat;

        } else {
            throw new ChatNotFoundException();
        }
    }

    @Override
    public HashSet<Chat> getChatByFirstUserName(String username) throws ChatNotFoundException {
        HashSet<Chat> chat = chatRepository.getChatByFirstUserName(username);

        if (chat.isEmpty()) {
            throw new ChatNotFoundException();
        } else {
            return chat;
        }
    }

    @Override
    public HashSet<Chat> getChatBySecondUserName(String username) throws ChatNotFoundException {
        HashSet<Chat> chat = chatRepository.getChatBySecondUserName(username);
        if (chat.isEmpty()) {
            throw new ChatNotFoundException();
        } else {
            return chat;
        }
    }

    @Override
    public HashSet<Chat> getChatByFirstUserNameOrSecondUserName(String username) throws ChatNotFoundException {
        HashSet<Chat> chat = chatRepository.getChatByFirstUserName(username);
        HashSet<Chat> chat1 = chatRepository.getChatBySecondUserName(username);

        chat1.addAll(chat);

        if (chat.isEmpty() && chat1.isEmpty()) {
            throw new ChatNotFoundException();
        } else if (chat1.isEmpty()) {
            return chat;
        } else {
            return chat1;
        }
    }

    @Override
    public HashSet<Chat> getChatByFirstUserNameAndSecondUserName(String firstUserName, String secondUserName)
            throws ChatNotFoundException {
        HashSet<Chat> chat = chatRepository.getChatByFirstUserNameAndSecondUserName(firstUserName, secondUserName);
        HashSet<Chat> chat1 = chatRepository.getChatBySecondUserNameAndFirstUserName(firstUserName, secondUserName);
        if (chat.isEmpty() && chat1.isEmpty()) {
            throw new ChatNotFoundException();
        } else if (chat.isEmpty()) {
            return chat1;
        } else {
            return chat;
        }
    }

    @Override
    public Chat addMessage(Message add, int chatId) throws ChatNotFoundException {
        Optional<Chat> chat = chatRepository.findById(chatId);
        Chat abc = chat.get();

        if (abc.getMessageList() == null) {
            List<Message> msg = new ArrayList<>();
            msg.add(add);
            abc.setMessageList(msg);
            return chatRepository.save(abc);
        } else {
            List<Message> rates = abc.getMessageList();
            rates.add(add);
            abc.setMessageList(rates);
            return chatRepository.save(abc);
        }
    }

    @Override
    public Chat addMediaMessage(Message add, Integer chatId, MultipartFile image, String fileType, String userId,
            MediaType mediaType) throws ChatNotFoundException, Exception {
        Optional<Chat> chat = chatRepository.findById(chatId);
        Chat abc = chat.get();

        String uploadedMediaId = this.mediaService.uploadMessageMedia(chatId, image, mediaType, userId, fileType);
        add.setReplyMedia(uploadedMediaId);
        add.setReplymessage(null);

        if (abc.getMessageList() == null) {
            List<Message> msg = new ArrayList<>();
            msg.add(add);
            abc.setMessageList(msg);
            return chatRepository.save(abc);
        } else {
            List<Message> rates = abc.getMessageList();
            rates.add(add);
            abc.setMessageList(rates);
            return chatRepository.save(abc);
        }
    }

}
