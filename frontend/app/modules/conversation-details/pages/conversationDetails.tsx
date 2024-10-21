import { ScrollArea } from "@/components/ui/scroll-area"

export default function DetailPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Video Conversation Detail</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-12">
            <iframe 
              className="w-full h-[400px] object-cover rounded-lg"
              src="https://app.heygen.com/embeds/1bdb32ceff9346f98e97e4a0aba43842" 
              title="HeyGen video player" 
              frameBorder="0" 
              allow="encrypted-media; fullscreen;" 
              allowFullScreen
            ></iframe>
          </div>
          <ScrollArea className="bg-muted p-4 rounded-lg h-64">
            <h2 className="text-lg font-semibold mb-2">Newton's Speech</h2>
            <p className="text-sm text-muted-foreground">
              Ah, the realm of physics! My work laid the foundation for classical mechanics with my laws of motion and universal gravitation. In 1687, I published 'Philosophiæ Naturalis Principia Mathematica,' where I introduced the three laws of motion. The first law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force. The second law relates force, mass, and acceleration, while the third law tells us that for every action, there is an equal and opposite reaction. My work explained not only terrestrial motion but also celestial phenomena, such as the orbits of planets around the sun. It was a revolutionary time for science, and I believe it set the stage for future discoveries.
            </p>
          </ScrollArea>
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-12">
            <iframe 
              className="w-full h-[400px] object-cover rounded-lg"
              src="https://app.heygen.com/embeds/896caac696534049b4131d934082744e" 
              title="HeyGen video player" 
              frameBorder="0" 
              allow="encrypted-media; fullscreen;" 
              allowFullScreen
            ></iframe>
          </div>
          <ScrollArea className="bg-muted p-4 rounded-lg h-64">
            <h2 className="text-lg font-semibold mb-2">Einstein's Speech</h2>
            <p className="text-sm text-muted-foreground">
              Indeed, Isaac, your contributions were monumental, but as the 20th century approached, we began to see the limitations of classical mechanics. My theory of relativity, published in 1905 and expanded in 1915, introduced a new way of understanding gravity and the fabric of space-time. I proposed that gravity is not just a force but a curvature of space-time caused by mass. This was a radical shift from your view, where gravity was a force acting at a distance. My famous equation, E=mc², showed the equivalence of mass and energy, fundamentally changing our understanding of the universe. While your laws work perfectly for everyday situations, my theories apply to extreme conditions, such as near light speed or in strong gravitational fields. Together, our ideas form the backbone of modern physics.
            </p>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
