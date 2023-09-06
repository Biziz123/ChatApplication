package com.codreal.chatservice.model;

import java.util.Date;

public class Message {

    private String senderEmail;
    private Date time = new Date(System.currentTimeMillis());
    private String replymessage;
    private String replyMedia;
    private Media replyMediaContent;

    public Message() {
    }

    public Message(String senderEmail, Date time, String replymessage) {
        this.senderEmail = senderEmail;
        this.time = time;
        this.replymessage = replymessage;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public String getReplymessage() {
        return replymessage;
    }

    public void setReplymessage(String replymessage) {
        this.replymessage = replymessage;
    }

    public String getReplyMedia() {
        return replyMedia;
    }

    public void setReplyMedia(String replyMedia) {
        this.replyMedia = replyMedia;
    }

    public Media getReplyMediaContent() {
        return replyMediaContent;
    }

    public void setReplyMediaContent(Media replyMediaContent) {
        this.replyMediaContent = replyMediaContent;
    }

}
