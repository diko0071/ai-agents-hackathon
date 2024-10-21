'use client'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { fetchConversations, Conversation, Character, getConversationCharacters } from '@/app/modules/api'
import { Skeleton } from "@/components/ui/skeleton"
import Image from 'next/image'

export default function ConversationList() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getConversations = async () => {
      try {
        const data = await fetchConversations()
        setConversations(data)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching conversations:', err)
        setError('Failed to fetch conversations')
        setIsLoading(false)
      }
    }

    getConversations()
  }, [])

  const fetchCharactersForConversation = async (conversationId: string) => {
    try {
      const characters = await getConversationCharacters(conversationId)
      return characters
    } catch (err) {
      console.error(`Error fetching characters for conversation ${conversationId}:`, err)
      return []
    }
  }

  useEffect(() => {
    const loadCharactersForConversations = async () => {
      if (conversations) {
        const updatedConversations = await Promise.all(
          conversations.map(async (conversation) => {
            const characters = await fetchCharactersForConversation(conversation.id)
            return { ...conversation, characters }
          })
        )
        setConversations(updatedConversations)
      }
    }

    loadCharactersForConversations()
  }, [conversations])

  const renderSkeletonLoader = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Characters</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(3)].map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-10 w-[60px] ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  if (error) return <div>Error: {error}</div>
  if (isLoading) return renderSkeletonLoader()
  if (!conversations) return <div className="px-8 py-6">No conversations found.</div>

  return (
    <div className="px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Conversations</h1>
        <Button onClick={() => router.push('/create-conversation')}>Add New</Button>
      </div>
      {conversations.length === 0 ? (
        <div>No conversations available. Create a new one!</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Characters</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conversations.map((conversation) => (
              <TableRow key={conversation.id}>
                <TableCell className="font-medium">{conversation.conversation_name}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {conversation.characters.map((character, index) => (
                      <Avatar key={index}>
                        {character.profile_picture ? (
                          <Image
                            src={character.profile_picture}
                            alt={character.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback>{character.name.slice(0, 2)}</AvatarFallback>
                        )}
                      </Avatar>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" onClick={() => router.push(`/conversation-details/`)}>Open</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
