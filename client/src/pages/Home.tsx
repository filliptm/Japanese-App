import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { translateText } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslationForm } from "@/features/translation/components/TranslationForm";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [options, setOptions] = useState<Array<{ char: string; romaji: string }>>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const allKatakana = [
    { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' },
    { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' },
    { char: 'オ', romaji: 'o' }, { char: 'カ', romaji: 'ka' },
    { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' },
    { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' }
  ];

  const currentCard = allKatakana[currentCardIndex];

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateOptions = (correct: { char: string; romaji: string }) => {
    const otherOptions = allKatakana.filter(k => k.romaji !== correct.romaji);
    const shuffledOptions = shuffleArray(otherOptions).slice(0, 4);
    const allOptions = shuffleArray([...shuffledOptions, correct]);
    setOptions(allOptions);
  };

  const nextCard = () => {
    setShowAnswer(false);
    const nextIndex = Math.floor(Math.random() * allKatakana.length);
    setCurrentCardIndex(nextIndex);
    generateOptions(allKatakana[nextIndex]);
  };

  React.useEffect(() => {
    if (isFlashcardMode) {
      generateOptions(currentCard);
    }
  }, [isFlashcardMode]);
  const { toast } = useToast();

  const translation = useMutation({
    mutationFn: translateText,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTranslate = () => {
    if (!inputText.trim()) {
      toast({
        title: "Please enter some text",
        description: "The input text cannot be empty",
        variant: "destructive",
      });
      return;
    }
    translation.mutate(inputText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-2 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
        <Tabs defaultValue="translate" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="translate">Translate</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="translate" className="space-y-8">
            <TranslationForm />
          </TabsContent>

          <TabsContent value="characters">
            <div className="space-y-4">
              <Tabs defaultValue="katakana" className="w-full">
                <TabsList>
                  <TabsTrigger value="katakana">Katakana</TabsTrigger>
                  <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
                </TabsList>

                <TabsContent value="katakana">
                  <div className="p-4 text-center">
                    Katakana learning content coming soon...
                  </div>
                </TabsContent>

                <TabsContent value="hiragana">
                  <div className="p-4 text-center text-muted-foreground">
                    Hiragana section coming soon...
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Translation History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Translation history coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}