from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .models import Conversation, Character
from .serializers import ConversationSerializer, CharacterSerializer
from .prompts import script_generator_prompt
from .services import openai_call, openai_call_image
import json
from django.core.files.base import ContentFile
import requests
from django.db import transaction
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404


# Conversations
@api_view(['GET'])
@authentication_classes([])
@permission_classes([])

def get_conversation(request):
    conversations = Conversation.objects.all()
    serializer = ConversationSerializer(conversations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_conversation(request):
    user = request.user
    serializer = ConversationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  


@api_view(['GET'])
def get_characters(request):
    characters = Character.objects.all()
    serializer = CharacterSerializer(characters, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Charaters 
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def create_characters(request):
    serializer = CharacterSerializer(data=request.data)
    
    if serializer.is_valid():
        character_name = serializer.validated_data['name']
        character_description = serializer.validated_data.get('description', '')
        
        prompt = f'Generate an image for a character: {character_name}. {character_description}'
        image_url = openai_call_image(prompt=prompt)

        try:
            with transaction.atomic():
                character = serializer.save()

                response = requests.get(image_url)
                if response.status_code == 200:
                    image_name = f"{character_name.replace(' ', '_')}.png"
                    image_content = ContentFile(response.content)
                    character.profile_picture.save(image_name, image_content, save=True)
                    
                    character.refresh_from_db()
                    
                    return Response(CharacterSerializer(character).data, status=status.HTTP_201_CREATED)
                else:
                    raise Exception("Failed to download image")
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# Generate Script
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def generate_script(request):
    topic = request.data.get('topic')
    if not topic:
        return Response({"error": "Topic is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        script = openai_call(script_generator_prompt, topic)
        script_data = json.loads(script)
        return Response({'data': script_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def review_and_save_conversation(request):
    serializer = ConversationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_conversation_characters(request, conversation_id):
    conversation = get_object_or_404(Conversation, id=conversation_id)
    characters = conversation.characters.all()
    serializer = CharacterSerializer(characters, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
