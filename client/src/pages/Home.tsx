import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { translateText } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [options, setOptions] = useState<Array<{ char: string; romaji: string }>>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  
  const allKatakana = [
    { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
    { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
    { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
    { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' },
    { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' },
    { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
    { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' },
    { char: 'ヤ', romaji: 'ya' }, { char: 'ユ', romaji: 'yu' }, { char: 'ヨ', romaji: 'yo' },
    { char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' },
    { char: 'ワ', romaji: 'wa' }, { char: 'ヲ', romaji: 'wo' }, { char: 'ン', romaji: 'n' }
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
    // Filter out the correct answer
    const otherOptions = allKatakana.filter(k => k.romaji !== correct.romaji);
    
    // Get 4 random options from the remaining characters
    // Try to include options from different character groups for better learning
    const groups = [
      otherOptions.filter(k => k.romaji.endsWith('a')),
      otherOptions.filter(k => k.romaji.endsWith('i')),
      otherOptions.filter(k => k.romaji.endsWith('u')),
      otherOptions.filter(k => k.romaji.endsWith('e')),
      otherOptions.filter(k => k.romaji.endsWith('o')),
      otherOptions.filter(k => !['a', 'i', 'u', 'e', 'o'].includes(k.romaji.slice(-1)))
    ].filter(group => group.length > 0);
    
    let selectedOptions: typeof allKatakana = [];
    
    // Try to pick one from each group if possible
    for (let i = 0; i < Math.min(4, groups.length); i++) {
      if (groups[i].length > 0) {
        const randomIndex = Math.floor(Math.random() * groups[i].length);
        selectedOptions.push(groups[i][randomIndex]);
        // Remove the selected option to avoid duplicates
        groups[i] = groups[i].filter((_, idx) => idx !== randomIndex);
      }
    }
    
    // If we don't have 4 options yet, add more from the remaining characters
    if (selectedOptions.length < 4) {
      const remainingOptions = otherOptions.filter(option => 
        !selectedOptions.some(selected => selected.romaji === option.romaji)
      );
      const additionalOptions = shuffleArray(remainingOptions).slice(0, 4 - selectedOptions.length);
      selectedOptions = [...selectedOptions, ...additionalOptions];
    }
    
    // Combine with the correct answer and shuffle
    const allOptions = shuffleArray([...selectedOptions, correct]);
    setOptions(allOptions);
  };

  const nextCard = () => {
    setShowAnswer(false);
    
    // Get a new random index that's different from the current one
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * allKatakana.length);
    } while (nextIndex === currentCardIndex && allKatakana.length > 1);
    
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
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>English Text</span>
                    <Button
                      onClick={handleTranslate}
                      disabled={translation.isPending || !inputText.trim()}
                      size="sm"
                    >
                      {translation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Translating...
                        </>
                      ) : (
                        "Translate"
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter English text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[120px] md:min-h-[200px] resize-none"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Japanese Translation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[120px] md:min-h-[200px] p-2 md:p-3 bg-muted rounded-md">
                    {translation.isPending ? (
                      <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : translation.data ? (
                      <div className="space-y-4">
                        <p className="text-lg">{translation.data.japanese}</p>
                        <p className="text-sm text-muted-foreground">
                          {translation.data.romaji}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {translation.data.syllables}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center">
                        Translation will appear here
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            
          </TabsContent>

          <TabsContent value="characters">
            <div className="space-y-4">
              <Tabs defaultValue="katakana" className="w-full">
                <TabsList>
                  <TabsTrigger value="katakana">Katakana</TabsTrigger>
                  <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
                </TabsList>
                
                <TabsContent value="katakana">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Katakana Chart</h3>
                    <Button
                      onClick={() => setIsFlashcardMode(prev => !prev)}
                      variant="outline"
                    >
                      {isFlashcardMode ? "View Chart" : "Practice Flashcards"}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {isFlashcardMode ? (
                      <div className="flex flex-col items-center space-y-4">
                        <Card className="w-48 h-48 flex items-center justify-center">
                          <CardContent className="text-center p-6">
                            <p className="text-6xl mb-4">
                              {currentCard.char}
                            </p>
                          </CardContent>
                        </Card>
                        <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                          {options.map((option, index) => (
                            <Button
                              key={index}
                              variant={selectedAnswer === option.romaji 
                                ? (showAnswer 
                                  ? option.romaji === currentCard.romaji 
                                    ? "default"
                                    : "destructive"
                                  : "default")
                                : "outline"
                              }
                              onClick={() => {
                                setSelectedAnswer(option.romaji);
                                setShowAnswer(true);
                              }}
                              disabled={showAnswer}
                              className="h-20 text-lg"
                            >
                              {option.romaji}
                            </Button>
                          ))}
                        </div>
                        <Button 
                          onClick={() => {
                            nextCard();
                            setSelectedAnswer("");
                          }} 
                          className="w-full max-w-md"
                        >
                          Next Card
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {[
                          [
                            { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' }
                          ],
                      [
                        { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' }
                      ],
                      [
                        { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' }
                      ],
                      [
                        { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' }
                      ],
                      [
                        { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' }
                      ],
                      [
                        { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' }
                      ],
                      [
                        { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' }
                      ],
                      [
                        { char: 'ヤ', romaji: 'ya' }, { char: 'ユ', romaji: 'yu' }, { char: 'ヨ', romaji: 'yo' }
                      ],
                      [
                        { char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' }
                      ],
                      [
                        { char: 'ワ', romaji: 'wa' }, { char: 'ヲ', romaji: 'wo' }, { char: 'ン', romaji: 'n' }
                      ]
                    ].map((row, rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-5 gap-4">
                        {row.map((item, index) => (
                          <Card key={index} className="hover:bg-accent cursor-pointer transition-colors">
                            <CardContent className="p-4 text-center">
                              <p className="text-3xl mb-1">{item.char}</p>
                              <p className="text-sm text-muted-foreground">{item.romaji}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ))}
                    </div>
                    )}
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