package com.codreal.chatservice.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.codreal.chatservice.model.Media;
import com.codreal.chatservice.model.MediaType;
import java.util.List;

@Repository
public interface MediaRepository extends MongoRepository<Media, String> {

    Optional<Media> findOneByUserIdAndMediaType(String userId, MediaType mediaType);

    void deleteAllByUserIdAndMediaType(String userId, MediaType mediaType);
}
