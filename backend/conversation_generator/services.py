from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.utilities.dalle_image_generator import DallEAPIWrapper
from langchain_community.callbacks import get_openai_callback
import time
import os
import json
from dotenv import load_dotenv

load_dotenv()


def openai_call(system_message, user_message, model_name="gpt-4o-mini"):
    
    llm = ChatOpenAI(model_name=model_name, temperature=0, api_key=os.getenv("OPENAI_API_KEY"))

    messages = [
        SystemMessage(content=system_message),
        HumanMessage(content=user_message)
    ]

    response = llm.invoke(messages)

    return response.content 

def openai_call_image(prompt, size="1024x1024", quality="standard", n=1):
    """
    Generate an image using OpenAI's DALL-E model via Langchain.
    
    :param prompt: The text description of the image to generate.
    :param size: The size of the image (e.g., "1024x1024", "512x512", "256x256").
    :param quality: The quality of the image ("standard" or "hd").
    :param n: The number of images to generate.
    :return: A list of image URLs.
    """
    dalle = DallEAPIWrapper()
    
    response = dalle.run(prompt)
    
    return response

def create_video(conversation,avatar_id,voice_id):
    
    HEYGEN_API_KEY = os.getenv("HEYGEN_API_KEY")
    
    headers = {
    'X-Api-Key': HEYGEN_API_KEY,
    'Content-Type': 'application/json',
    }

    json_data = {
        'video_inputs': [
            {
                'character': {
                    'type': 'avatar',
                    'avatar_id': avatar_id,
                    'avatar_style': 'normal',
                },
                'voice': {
                    'type': 'text',
                    'input_text': conversation.conversation_user_prompt,
                    'voice_id': voice_id,
                },
                'background': {
                    'type': 'color',
                    'value': '#008000',
                },
            },
        ],
        'dimension': {
            'width': 1280,
            'height': 720,
        },
        'aspect_ratio': '16:9',
        'test': True,
    }

    response = requests.post('https://api.heygen.com/v2/video/generate', headers=headers, json=json_data)
    return response

def check_video_status(video_id):
    
    HEYGEN_API_KEY = os.getenv("HEYGEN_API_KEY")
    
    headers = {
        'X-Api-Key': HEYGEN_API_KEY
    }
    
    response = requests.get(f'https://api.heygen.com/v1/video_status.get?video_id=<{video_id}>', headers=headers)
    return response

def download_video(video_id):
    
    while True:
        response = check_video_status(video_id)
        status = response.json()["data"]["status"]
    
        if status == "completed":
            video_url = response.json()["data"]["video_url"]
            thumbnail_url = response.json()["data"]["thumbnail_url"]
            print(
                f"Video generation completed! \nVideo URL: {video_url} \nThumbnail URL: {thumbnail_url}"
            )
    
            # Save the video to a file
            video_filename = f"generated_video_{video_id}.mp4"
            with open(video_filename, "wb") as video_file:
                video_content = requests.get(video_url).content
                video_file.write(video_content)
            break
            
        elif status == "processing" or status == "pending":
            print("Video is still processing. Checking status...")
            time.sleep(5)  # Sleep for 5 seconds before checking again
            
        elif status == "failed":
            error = response.json()["data"]["error"]
            print(f"Video generation failed. '{error}'")
            break
