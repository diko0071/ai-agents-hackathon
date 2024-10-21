from django.urls import path
from .views import *

urlpatterns = [
    path('conversations/', get_conversation, name='get_conversation'),
    path('conversations/add/', add_conversation, name='add_conversation'),
    path('generate-script/', generate_script, name='generate_script'),
    path('characters/', get_characters, name='get_characters'),
    path('characters/add/', create_characters, name='create_characters'),
    path('conversations/<str:conversation_id>/characters/', get_conversation_characters, name='get_conversation_characters'),
]
