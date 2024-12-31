
import { useState } from "react";
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
            <TabsTrigger value="practice">Practice</TabsTrigger>
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

          <TabsContent value="practice">
            <div className="space-y-4">
              <Tabs defaultValue="katakana" className="w-full">
                <TabsList>
                  <TabsTrigger value="katakana">Katakana</TabsTrigger>
                  <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
                </TabsList>
                
                <TabsContent value="katakana">
                  <div className="space-y-4 mt-4">
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
