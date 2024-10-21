import ApiService from "../apiService";

export type Character = {
    id: number;
    name: string;
    description: string;
    profile_picture: string;
    voice_sample: string | null;
    created_at: string;
    updated_at: string;
}

export type Conversation = {
    id: string;
    conversation_name: string;
    characters: Character[];
}

export type ConversationDetails = {
    id: number;
    conversation_name: string;
    characters: Character[];
    final_video_url: string;
    conversation_user_prompt: string;
}

export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await ApiService.get_public('/api/conversations/');
    if (response && typeof response === 'object') {
      if ('error_code' in response && 'message' in response) {
        throw new Error(response.message);
      } else if (Array.isArray(response)) {
        return response.map((conversation: any): Conversation => ({
          id: conversation?.id ?? '',
          conversation_name: conversation?.conversation_name ?? '',
          characters: conversation?.characters?.map((character: any) => ({
            name: character?.name ?? '',
            image_url: character?.image_url ?? '',
          })) ?? [],
        }));
      } else {
        throw new Error('Unexpected response format');
      }
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error: any) {
    console.error('fetchConversations error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};


export const getConversationCharacters = async (conversationId: string): Promise<Character[]> => {
    try {
      const response = await ApiService.get_public(`/api/conversations/${conversationId}/characters/`);
      if (response && Array.isArray(response)) {
        return response.map((character: any): Character => ({
          id: character?.id ?? 0,
          name: character?.name ?? '',
          description: character?.description ?? '',
          profile_picture: character?.profile_picture ?? '',
          voice_sample: character?.voice_sample ?? null,
          created_at: character?.created_at ?? '',
          updated_at: character?.updated_at ?? '',
        }));
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error: any) {
      console.error('getConversationCharacters error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  export type Script = {
    [key: string]: string;
  }
  
  export const generateScript = async (topic: string): Promise<Script> => {
    try {
      const formData = new FormData();
      formData.append('topic', topic);
  
      const response = await ApiService.post_form('/api/generate-script/', formData);
      
      console.log('Raw response:', response);
  
      if (response && typeof response === 'object') {
        if ('data' in response && typeof response.data === 'object') {
          if (Object.entries(response.data).every(([key, value]) => typeof key === 'string' && typeof value === 'string')) {
            return response.data as Script;
          } else {
            console.error('Script data has unexpected format:', response.data);
            throw new Error('Generated script has unexpected format');
          }
        } else if ('error' in response) {
          throw new Error(response.error);
        } else {
          console.error('Unexpected response format:', response);
          throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
        }
      } else {
        console.error('Unexpected response type:', typeof response);
        throw new Error(`Unexpected response type: ${typeof response}`);
      }
    } catch (error: any) {
      console.error('generateScript error:', error);
      if (error.response?.data) {
        console.error('Server error response:', error.response.data);
        throw new Error(`Server error: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  };


export const createConversation = async (conversationData: Partial<Conversation>): Promise<Conversation> => {
  try {
    const response = await ApiService.post('/api/conversations/create/', conversationData);
    if (response && typeof response === 'object' && 'id' in response) {
      return response as Conversation;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error: any) {
    console.error('createConversation error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const createCharacter = async (characterData: { name: string; description: string }): Promise<Character> => {
    try {
      const formData = new FormData();
      formData.append('name', characterData.name);
      formData.append('description', characterData.description);
  
      const response = await ApiService.post_form('/api/characters/add/', formData);
      
      if (response && typeof response === 'object' && 'id' in response) {
        return {
          id: response.id,
          name: response.name,
          description: response.description,
          profile_picture: response.profile_picture,
          voice_sample: response.voice_sample,
          created_at: response.created_at,
          updated_at: response.updated_at
        };
      } else {
        console.error('Unexpected response format:', response);
        throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
      }
    } catch (error: any) {
      console.error('createCharacter error:', error);
      if (error.response) {
        console.error('Server error response:', error.response.data);
        throw new Error(`Server error: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error(`Error setting up request: ${error.message}`);
      }
    }
  };
