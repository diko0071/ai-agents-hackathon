'use client'
import { Button } from "@/components/ui/button"
import { Triangle, Flag, Gift } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { SquareTerminal, Bot, Code2, Book, Settings2, LifeBuoy, SquareUser, LibraryBig, BookText, Home, Highlighter, LogOut, Loader2, BookKey } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import Link from "next/link"
import { MessageSquare, VenetianMask, GalleryVerticalEnd } from "lucide-react"


export default function MenuSidebar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const closeFeedbackDialog = () => {
    setIsFeedbackOpen(false);
  };

  const [isSocialReviewOpen, setIsSocialReviewOpen] = useState(false);
  const closeSocialReviewDialog = () => {
    setIsSocialReviewOpen(false);
  };

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500); 
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
    <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Link href="/">
          <Button variant="outline" size="icon" aria-label="Home">
            <GalleryVerticalEnd className="size-5" />
          </Button>
          </Link>
        </div>
        <nav className="grid gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Conversations"
                onClick={() => router.push('/conversations')}
              >
                <MessageSquare className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Conversations
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Characters"
                onClick={() => router.push('/characters')}
              >
                <VenetianMask className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Characters
            </TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
        <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="mt-auto rounded-lg"
                aria-label="Logout"
                onClick={() => {
                  setIsSocialReviewOpen(true);
                }}
              >
                <LogOut className="size-5" />
              </Button>
            </TooltipTrigger>
          </Tooltip>
          </nav>
          </aside>
        </TooltipProvider>
      )
  }