"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState('landscape_4_3');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedImage('');
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, image_size: imageSize }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      setGeneratedImage(data.images[0].url);
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">fal.ai Image Generator</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generate Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              required
            />
            <Select value={imageSize} onValueChange={setImageSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select image size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square_hd">Square HD</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="portrait_4_3">Portrait 4:3</SelectItem>
                <SelectItem value="portrait_16_9">Portrait 16:9</SelectItem>
                <SelectItem value="landscape_4_3">Landscape 4:3</SelectItem>
                <SelectItem value="landscape_16_9">Landscape 16:9</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {generatedImage && (
            <div className="mt-4 w-full">
              <img src={generatedImage} alt="Generated" className="w-full h-auto rounded-lg" />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}