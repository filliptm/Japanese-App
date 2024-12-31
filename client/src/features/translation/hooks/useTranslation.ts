import { useMutation } from "@tanstack/react-query";
import { translateText } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function useTranslation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: translateText,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
