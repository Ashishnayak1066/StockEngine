import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    title: string;
    date: string;
    summary: string;
  } | null;
}

export function ArticleModal({ isOpen, onClose, article }: ArticleModalProps) {
  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Market Analysis</Badge>
            <Badge variant="outline" className="bg-accent/10 text-muted-foreground border-border">Technology</Badge>
          </div>
          <DialogTitle className="text-2xl font-bold leading-tight">{article.title}</DialogTitle>
          
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Senior Analyst</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-foreground/90 leading-relaxed mt-4">
          <p className="font-medium text-lg">{article.summary}</p>
          
          <p>
            Market sentiment remains bullish as key indicators suggest sustained growth in the sector. 
            Institutional investors have been increasing their positions over the last quarter, 
            signaling confidence in long-term value creation.
          </p>
          
          <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary my-6">
            <p className="italic text-muted-foreground">
              "The fundamentals are stronger than they've been in years. We're looking at a potential 
              breakout scenario if the upcoming earnings report meets the consensus estimates."
            </p>
          </div>

          <h3 className="text-xl font-bold mt-6 mb-2">Key Takeaways</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Revenue growth projected to exceed 15% YoY</li>
            <li>Operating margins expanding due to efficiency measures</li>
            <li>New product pipeline looks robust for Q4</li>
          </ul>

          <p className="mt-4">
            However, risks remain. Macroeconomic headwinds could dampen consumer spending, 
            and supply chain constraints have not fully eased. Investors should maintain a balanced 
            portfolio and monitor the technical resistance levels closely.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
