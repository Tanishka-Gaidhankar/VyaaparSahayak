import { useState } from "react";
import { Megaphone, Sparkles, Users, Palette, Copy, RefreshCw, Tag, MessageSquare, Target } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const BRAND_TONES = [
  { value: "professional", label: "Professional", description: "Formal, trustworthy, expert" },
  { value: "friendly", label: "Friendly", description: "Warm, approachable, conversational" },
  { value: "playful", label: "Playful", description: "Fun, energetic, youthful" },
  { value: "bold", label: "Bold", description: "Confident, daring, impactful" },
  { value: "minimal", label: "Minimal", description: "Clean, simple, straightforward" },
];

const TARGET_AUDIENCES = [
  { value: "young_professionals", label: "Young Professionals (25-35)" },
  { value: "families", label: "Families with Kids" },
  { value: "health_conscious", label: "Health-Conscious Consumers" },
  { value: "budget_shoppers", label: "Budget-Conscious Shoppers" },
  { value: "premium_buyers", label: "Premium/Luxury Buyers" },
  { value: "small_business", label: "Small Business Owners" },
];

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter/X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp Status" },
];

interface GeneratedContent {
  captions: string[];
  offers: string[];
  hashtags: string[];
}

export default function Marketing() {
  const { toast } = useToast();
  const [brandTone, setBrandTone] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [platform, setPlatform] = useState<string>("instagram");
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const generateContent = async () => {
    if (!brandTone || !targetAudience || !productName) {
      toast({
        title: "Missing Information",
        description: "Please fill in brand tone, target audience, and product name.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI-generated content based on inputs
    const toneLabel = BRAND_TONES.find(t => t.value === brandTone)?.label || "Professional";
    const audienceLabel = TARGET_AUDIENCES.find(a => a.value === targetAudience)?.label || "";

    const mockContent: Record<string, GeneratedContent> = {
      professional: {
        captions: [
          `Introducing ${productName} – crafted for those who demand excellence. Quality you can trust, results you can see. 🎯`,
          `${productName}: Where innovation meets reliability. Elevate your standards today. ✨`,
          `We're proud to present ${productName}. Built with precision, delivered with care. Your success is our priority.`,
        ],
        offers: [
          "Limited Time: Get 15% off on bulk orders (min. 10 units)",
          "Free premium packaging on orders above ₹2,000",
          "Early bird discount: First 50 customers get exclusive pricing",
        ],
        hashtags: ["#QualityFirst", "#PremiumProducts", "#BusinessExcellence", "#TrustedBrand", "#MadeInIndia"],
      },
      friendly: {
        captions: [
          `Hey there! 👋 Meet ${productName} – your new favorite! Made with love, just for you. 💕`,
          `Good things come to those who try ${productName}! Trust us, you're gonna love this one. 😊`,
          `We're so excited to share ${productName} with you! It's everything you've been looking for and more! 🎉`,
        ],
        offers: [
          "🎁 Share with a friend and both of you get 20% off!",
          "Happy Hour Sale! Order in the next 2 hours for a surprise gift 🎊",
          "Join our family! First order? Here's ₹200 off on us! 💝",
        ],
        hashtags: ["#LoveThis", "#HappyCustomers", "#ShareTheJoy", "#NewFavorite", "#GoodVibesOnly"],
      },
      playful: {
        captions: [
          `POV: You just discovered ${productName} and your life will never be the same 🚀✨`,
          `${productName} just dropped and it's giving everything! No cap, this one's a vibe 🔥`,
          `When ${productName} enters the chat 👀💯 IYKYK`,
        ],
        offers: [
          "🎮 Spin the wheel for a chance to win up to 40% off!",
          "Tag your bestie & both win mystery discounts! 🎲",
          "Flash sale alert! ⚡ 50% off for the next 60 mins only!",
        ],
        hashtags: ["#Trending", "#MustHave", "#GameChanger", "#ViralProduct", "#TreatYourself"],
      },
      bold: {
        captions: [
          `${productName}. No compromises. No excuses. Just results. 💪`,
          `The future is here. ${productName} is changing the game. Are you in or out? 🔥`,
          `${productName}: For those who refuse to settle for ordinary. Be extraordinary. ⚡`,
        ],
        offers: [
          "MASSIVE SALE: 30% off – Today only. Don't miss it.",
          "VIP Access: Unlock exclusive pricing. Limited spots.",
          "Act now or regret later. Best prices won't last.",
        ],
        hashtags: ["#NoLimits", "#GameChanger", "#BeTheBest", "#PowerMove", "#Unstoppable"],
      },
      minimal: {
        captions: [
          `${productName}. Simple. Effective. Yours.`,
          `Less noise. More quality. ${productName}.`,
          `${productName} – because sometimes, simple is better.`,
        ],
        offers: [
          "Clean deal: 10% off. No strings attached.",
          "Free delivery. Always.",
          "Subscribe & save 15% every month.",
        ],
        hashtags: ["#SimpleLife", "#LessIsMore", "#Quality", "#Minimalist", "#Essential"],
      },
    };

    setGeneratedContent(mockContent[brandTone] || mockContent.professional);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Marketing Studio"
        description="AI-powered content generation for your brand"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Brand Setup
            </CardTitle>
            <CardDescription>Configure your brand voice and target audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Brand Tone */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                Brand Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BRAND_TONES.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => setBrandTone(tone.value)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      brandTone === tone.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium text-sm">{tone.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{tone.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Target Audience
              </label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience..." />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_AUDIENCES.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value}>
                      {audience.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Platform
              </label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Product Name</label>
              <Input
                placeholder="e.g., Organic Peanut Butter"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Product Description (optional)</label>
              <Textarea
                placeholder="Brief description of your product..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={generateContent} disabled={isGenerating} className="w-full" size="lg">
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Marketing Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <div className="space-y-6">
          {/* Captions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                AI-Generated Captions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {generatedContent?.captions ? (
                generatedContent.captions.map((caption, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted/50 border border-border group relative"
                  >
                    <p className="text-sm pr-8">{caption}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(caption)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Configure your brand and generate content</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Offers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4 text-accent" />
                Offer Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {generatedContent?.offers ? (
                generatedContent.offers.map((offer, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-accent/5 border border-accent/20 group relative flex items-start gap-3"
                  >
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      Offer {index + 1}
                    </Badge>
                    <p className="text-sm flex-1">{offer}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={() => copyToClipboard(offer)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Offers will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hashtags */}
          {generatedContent?.hashtags && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Suggested Hashtags</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatedContent.hashtags.join(" "))}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => copyToClipboard(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {generatedContent && (
            <Button variant="outline" className="w-full" onClick={generateContent}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Content
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
