import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { translateText } from "@/lib/api";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Japanese Language Learning
          </h1>
          <p className="mt-2 text-muted-foreground">
            Powered by Claude AI Translation
          </p>
        </header>

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
                className="min-h-[200px] resize-none"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Japanese Translation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] p-3 bg-muted rounded-md">
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
      </div>
    </div>
  );
}
