"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { generateScript, createConversation, createCharacter, Character } from "../../api"
import Image from "next/image"

type StoryData = {
  topic: string
  characters: Character[]
  script: string
}

export default function CreateConversation() {
  const [step, setStep] = useState(1)
  const [storyData, setStoryData] = useState<StoryData>({
    topic: "",
    characters: [{ name: "", description: "", id: 0, profile_picture: "", voice_sample: "", created_at: "", updated_at: "" }],
    script: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (step === 3) {
      handleGenerateScript()
    }
  }, [step])

  const handleNext = async () => {
    if (step === 2) {
      await handleCreateCharacters()
    }
    setStep((prevStep) => prevStep + 1)
  }

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1)
  }

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoryData((prevData) => ({ ...prevData, topic: e.target.value }))
  }

  const handleCharacterChange = (index: number, field: keyof Character, value: string) => {
    setStoryData((prevData) => {
      const newCharacters = [...prevData.characters]
      newCharacters[index] = { ...newCharacters[index], [field]: value }
      return { ...prevData, characters: newCharacters }
    })
  }

  const handleAddCharacter = () => {
    setStoryData((prevData) => ({
      ...prevData,
      characters: [...prevData.characters, { name: "", description: "", id: 0, profile_picture: "", voice_sample: "", created_at: "", updated_at: "" }],
    }))
  }

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStoryData((prevData) => ({ ...prevData, script: e.target.value }))
  }

  const handleDeleteCharacter = (index: number) => {
    setStoryData((prevData) => ({
      ...prevData,
      characters: prevData.characters.filter((_, i) => i !== index),
    }))
  }

  const handleGenerateScript = async () => {
    setIsLoading(true);
    try {
      const scriptData = await generateScript(storyData.topic);
      console.log("Script data received:", scriptData);

      // Parse the script data
      const dialogue = Object.entries(scriptData)
        .map(([character, text]) => `${character}: ${text}`)
        .join('\n\n');

      console.log("Parsed dialogue:", dialogue);

      setStoryData(prevData => ({ ...prevData, script: dialogue }));
    } catch (error: any) {
      console.error("Error generating script:", error);
      setStoryData(prevData => ({ ...prevData, script: "Failed to generate script. Please try again." }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCharacters = async () => {
    setIsLoading(true);
    try {
      const createdCharacters = await Promise.all(
        storyData.characters.map(async (character) => {
          const createdCharacter = await createCharacter({
            name: character.name.trim(),
            description: character.description.trim(),
          });
          return createdCharacter;
        })
      );
      setStoryData(prevData => ({ ...prevData, characters: createdCharacters }));
    } catch (error) {
      console.error("Error creating characters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const newConversation = await createConversation({
        conversation_name: storyData.topic,
        characters: storyData.characters,
      });
      console.log("New conversation created:", newConversation);
      // You might want to redirect the user or clear the form here
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Step 1: Choose a Topic</h2>
            <Input
              placeholder="Enter your story topic"
              value={storyData.topic}
              onChange={handleTopicChange}
              className="w-full"
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Step 2: Define Characters</h2>
            {storyData.characters.map((character, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Character {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input
                    placeholder="Character Name"
                    value={character.name}
                    onChange={(e) => handleCharacterChange(index, "name", e.target.value)}
                    className="w-full"
                  />
                  <Input
                    placeholder="Character Description"
                    value={character.description}
                    onChange={(e) => handleCharacterChange(index, "description", e.target.value)}
                    className="w-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleDeleteCharacter(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button onClick={handleAddCharacter} variant="outline">
              Add Character
            </Button>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Step 3: Review</h2>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Topic</h3>
              <p>{storyData.topic}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Characters</h3>
              {storyData.characters.map((character, index) => (
                <div key={index} className="flex items-center space-x-4">
                  {character.profile_picture && (
                    <Image
                      src={character.profile_picture}
                      alt={character.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p><strong>{character.name}</strong>: {character.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Script</h3>
              <Textarea
                placeholder="Enter your script"
                value={storyData.script}
                onChange={handleScriptChange}
                rows={15}
                className="w-full"
              />
              <Button onClick={handleGenerateScript} disabled={isLoading}>
                {isLoading ? "Generating..." : "Regenerate Script"}
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="px-8 py-6">
      <div className="max-w-4xl space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-1/3 h-2 rounded-full ${
                  step >= stepNumber ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>Topic</span>
            <span>Characters</span>
            <span>Review</span>
          </div>
        </div>
        {renderStep()}
        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={step === 1} variant="outline">
            Previous
          </Button>
          {step === 3 ? (
            <Button onClick={handleFinish} disabled={isLoading}>
              {isLoading ? "Creating..." : "Finish"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={isLoading || step === 3}>
              {isLoading ? "Processing..." : "Next"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
