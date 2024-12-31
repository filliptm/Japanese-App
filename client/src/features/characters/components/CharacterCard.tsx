import { Card, CardContent } from "@/components/ui/card";
import { Character } from "../types";

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  return (
    <Card 
      className="hover:bg-accent cursor-pointer transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4 text-center">
        <p className="text-3xl mb-1">{character.char}</p>
        <p className="text-sm text-muted-foreground">{character.romaji}</p>
      </CardContent>
    </Card>
  );
}
