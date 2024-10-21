from django.db import models
from useraccount.models import User


class Character(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='hackathon/character_profile_pictures/', blank=True, null=True)
    voice_sample = models.FileField(upload_to='hackathon/character_voice_samples/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    conversation_name = models.CharField(max_length=255)
    final_video_url = models.URLField(blank=True, null=True)
    conversation_user_prompt = models.TextField(blank=True, null=True)
    characters = models.ManyToManyField(Character)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ConversationMessage(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    message = models.TextField()
    video_url = models.URLField(blank=True, null=True)
    character = models.ForeignKey(Character, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)