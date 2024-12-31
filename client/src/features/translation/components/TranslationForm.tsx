import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";

export function TranslationForm() {
  const [inputText, setInputText] = useState("");
  const { toast } = useToast();
  const translation = useTranslation();

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
  );
}
