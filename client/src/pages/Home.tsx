
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
                  <CardTitle>English Text</CardTitle>
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

            <div className="flex justify-center">
              <Button
                onClick={handleTranslate}
                disabled={translation.isPending || !inputText.trim()}
                className="w-full max-w-xs"
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
            </div>
          </TabsContent>

          <TabsContent value="practice">
            <Card>
              <CardHeader>
                <CardTitle>Practice Section</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Practice content coming soon...</p>
              </CardContent>
            </Card>
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
