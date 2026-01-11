import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Target, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    getAudienceMatching,
    getContentOptimization,
    type AudienceMatchingResponse,
    type ContentOptimizationResponse,
} from "@/lib/api";

export default function AIGrowth() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("audience");

    // Audience Matching State
    const [audienceForm, setAudienceForm] = useState({
        product_name: "",
        category: "",
        price_range: "",
        description: "",
        target_country: "India",
    });
    const [audienceLoading, setAudienceLoading] = useState(false);
    const [audienceResult, setAudienceResult] = useState<AudienceMatchingResponse | null>(null);

    // Content Optimization State
    const [contentForm, setContentForm] = useState({
        product_name: "",
        product_details: "",
        selected_platform: "",
        target_audience: "",
        category: "",
    });
    const [contentLoading, setContentLoading] = useState(false);
    const [contentResult, setContentResult] = useState<ContentOptimizationResponse | null>(null);

    const handleAudienceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAudienceLoading(true);
        setAudienceResult(null);

        try {
            const result = await getAudienceMatching(audienceForm);
            setAudienceResult(result);
            toast({
                title: "Analysis Complete!",
                description: "AI has identified your target audience and platform recommendations.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to analyze audience. Please try again.",
                variant: "destructive",
            });
        } finally {
            setAudienceLoading(false);
        }
    };

    const handleContentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setContentLoading(true);
        setContentResult(null);

        try {
            const result = await getContentOptimization(contentForm);
            setContentResult(result);
            toast({
                title: "Content Generated!",
                description: "AI has created optimized content for your platform.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to generate content. Please try again.",
                variant: "destructive",
            });
        } finally {
            setContentLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <div>
                    <h1 className="text-3xl font-bold">AI Growth Assistant</h1>
                    <p className="text-muted-foreground">
                        AI-powered audience targeting and content optimization
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="audience" className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Audience & Platform Matching
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Content Optimization
                    </TabsTrigger>
                </TabsList>

                {/* Audience Matching Tab */}
                <TabsContent value="audience" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Input Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Information</CardTitle>
                                <CardDescription>
                                    Enter your product details to get AI-powered audience insights
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAudienceSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="product_name">Product Name</Label>
                                        <Input
                                            id="product_name"
                                            placeholder="e.g., Organic Peanut Butter"
                                            value={audienceForm.product_name}
                                            onChange={(e) =>
                                                setAudienceForm({ ...audienceForm, product_name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Input
                                            id="category"
                                            placeholder="e.g., Health Food"
                                            value={audienceForm.category}
                                            onChange={(e) =>
                                                setAudienceForm({ ...audienceForm, category: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price_range">Price Range</Label>
                                        <Input
                                            id="price_range"
                                            placeholder="e.g., ₹180-250"
                                            value={audienceForm.price_range}
                                            onChange={(e) =>
                                                setAudienceForm({ ...audienceForm, price_range: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Describe your product's key features and benefits..."
                                            value={audienceForm.description}
                                            onChange={(e) =>
                                                setAudienceForm({ ...audienceForm, description: e.target.value })
                                            }
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target_country">Target Country</Label>
                                        <Input
                                            id="target_country"
                                            placeholder="e.g., India"
                                            value={audienceForm.target_country}
                                            onChange={(e) =>
                                                setAudienceForm({ ...audienceForm, target_country: e.target.value })
                                            }
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={audienceLoading}>
                                        {audienceLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Target className="mr-2 h-4 w-4" />
                                                Analyze Audience
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Results */}
                        <div className="space-y-4">
                            {audienceResult && (
                                <>
                                    {/* Target Audience */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Target className="h-5 w-5 text-blue-600" />
                                                Target Audience
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Age Range</p>
                                                <p className="text-lg font-semibold">
                                                    {audienceResult.target_audience.age_range}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Buying Intent</p>
                                                <Badge variant="secondary">
                                                    {audienceResult.target_audience.buying_intent}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Interests</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {audienceResult.target_audience.interests.map((interest, idx) => (
                                                        <Badge key={idx} variant="outline">
                                                            {interest}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Summary</p>
                                                <p className="text-sm mt-1">{audienceResult.target_audience.summary}</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Platform Recommendations */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-green-600" />
                                                Platform Recommendations
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {audienceResult.platform_recommendations.map((platform, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-4 border rounded-lg space-y-2 hover:bg-accent/50 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold">{platform.platform}</h4>
                                                        <Badge variant="default">{platform.confidence_score}% Match</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{platform.reason}</p>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {platform.keywords.map((keyword, kidx) => (
                                                            <Badge key={kidx} variant="secondary" className="text-xs">
                                                                {keyword}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Overall Strategy */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Sparkles className="h-5 w-5 text-purple-600" />
                                                Overall Strategy
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm">{audienceResult.overall_strategy}</p>
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {!audienceResult && !audienceLoading && (
                                <Card className="border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                        <Target className="h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">
                                            Fill in the product details and click "Analyze Audience" to get AI-powered
                                            recommendations
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* Content Optimization Tab */}
                <TabsContent value="content" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Input Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Details</CardTitle>
                                <CardDescription>
                                    Generate platform-specific optimized content
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleContentSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="content_product_name">Product Name</Label>
                                        <Input
                                            id="content_product_name"
                                            placeholder="e.g., Organic Peanut Butter"
                                            value={contentForm.product_name}
                                            onChange={(e) =>
                                                setContentForm({ ...contentForm, product_name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product_details">Product Details</Label>
                                        <Textarea
                                            id="product_details"
                                            placeholder="Detailed product description..."
                                            value={contentForm.product_details}
                                            onChange={(e) =>
                                                setContentForm({ ...contentForm, product_details: e.target.value })
                                            }
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="selected_platform">Platform</Label>
                                        <Input
                                            id="selected_platform"
                                            placeholder="e.g., Amazon India, Instagram, Blog"
                                            value={contentForm.selected_platform}
                                            onChange={(e) =>
                                                setContentForm({ ...contentForm, selected_platform: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target_audience_content">Target Audience</Label>
                                        <Input
                                            id="target_audience_content"
                                            placeholder="e.g., Health-conscious adults 25-40"
                                            value={contentForm.target_audience}
                                            onChange={(e) =>
                                                setContentForm({ ...contentForm, target_audience: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content_category">Category</Label>
                                        <Input
                                            id="content_category"
                                            placeholder="e.g., Health Food"
                                            value={contentForm.category}
                                            onChange={(e) =>
                                                setContentForm({ ...contentForm, category: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={contentLoading}>
                                        {contentLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Generate Content
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Results */}
                        <div className="space-y-4">
                            {contentResult && (
                                <>
                                    {/* Optimized Content */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Sparkles className="h-5 w-5 text-purple-600" />
                                                Optimized Content for {contentResult.platform}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                                                <p className="mt-1 p-3 bg-accent rounded-md font-medium">
                                                    {contentResult.optimized_content.title}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">
                                                    Description
                                                </Label>
                                                <p className="mt-1 p-3 bg-accent rounded-md text-sm">
                                                    {contentResult.optimized_content.description}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">
                                                    Call to Action
                                                </Label>
                                                <p className="mt-1 p-3 bg-accent rounded-md font-semibold text-primary">
                                                    {contentResult.optimized_content.call_to_action}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">
                                                    Tags/Hashtags
                                                </Label>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {contentResult.optimized_content.hashtags_or_tags.map((tag, idx) => (
                                                        <Badge key={idx} variant="secondary">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Posting Strategy */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-green-600" />
                                                Posting Strategy
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Best Timing</p>
                                                <p className="text-sm mt-1">{contentResult.posting_strategy.best_timing}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Format</p>
                                                <p className="text-sm mt-1">{contentResult.posting_strategy.format}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                                                <p className="text-sm mt-1">{contentResult.posting_strategy.frequency}</p>
                                            </div>
                                            {contentResult.posting_strategy.additional_tips.length > 0 && (
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground mb-2">
                                                        Additional Tips
                                                    </p>
                                                    <ul className="space-y-1">
                                                        {contentResult.posting_strategy.additional_tips.map((tip, idx) => (
                                                            <li key={idx} className="text-sm flex items-start gap-2">
                                                                <span className="text-primary mt-1">•</span>
                                                                <span>{tip}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Compliance Warnings */}
                                    {contentResult.compliance_warnings.length > 0 && (
                                        <Card className="border-orange-200 bg-orange-50/50">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-orange-700">
                                                    <AlertCircle className="h-5 w-5" />
                                                    Compliance Warnings
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-2">
                                                    {contentResult.compliance_warnings.map((warning, idx) => (
                                                        <li key={idx} className="text-sm flex items-start gap-2">
                                                            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                                            <span>{warning}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Action Recommendations */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Target className="h-5 w-5 text-blue-600" />
                                                Action Recommendations
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {contentResult.action_recommendations.map((action, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 border rounded-lg space-y-1 hover:bg-accent/50 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium text-sm">{action.action}</p>
                                                        <Badge
                                                            variant={
                                                                action.priority === "high"
                                                                    ? "destructive"
                                                                    : action.priority === "medium"
                                                                        ? "default"
                                                                        : "secondary"
                                                            }
                                                        >
                                                            {action.priority}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Impact: {action.expected_impact}
                                                    </p>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {!contentResult && !contentLoading && (
                                <Card className="border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                        <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">
                                            Fill in the content details and click "Generate Content" to get AI-optimized
                                            marketing content
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
