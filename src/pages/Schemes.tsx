import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, CheckCircle, ExternalLink, Search, Building2 } from "lucide-react";
import { getSchemes, getMatchedSchemes, type Scheme } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SchemeCard({ scheme, isMatched }: { scheme: Scheme; isMatched?: boolean }) {
  return (
    <Card className="shadow-card transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          {isMatched && (
            <StatusBadge variant="success">
              <CheckCircle className="mr-1 h-3 w-3" />
              Eligible
            </StatusBadge>
          )}
        </div>
        <CardTitle className="mt-3 text-lg leading-tight">{scheme.name}</CardTitle>
        <CardDescription className="line-clamp-2">{scheme.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Eligibility</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{scheme.eligibility}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Benefits</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{scheme.benefits}</p>
        </div>
        {scheme.link && (
          <Button variant="outline" className="w-full gap-2" asChild>
            <a href={scheme.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Learn More
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function Schemes() {
  const [search, setSearch] = useState("");
  const [profileId] = useState<number | null>(() => {
    const stored = localStorage.getItem("startup_profile_id");
    return stored ? Number(stored) : null;
  });

  const { data: allSchemes, isLoading: allLoading } = useQuery({
    queryKey: ["schemes"],
    queryFn: getSchemes,
  });

  const { data: matchedSchemes, isLoading: matchedLoading } = useQuery({
    queryKey: ["matched-schemes", profileId],
    queryFn: () => (profileId ? getMatchedSchemes(profileId) : Promise.resolve([])),
    enabled: !!profileId,
  });

  const isLoading = allLoading || matchedLoading;

  const filteredSchemes = allSchemes?.filter(
    (scheme) =>
      scheme.name.toLowerCase().includes(search.toLowerCase()) ||
      scheme.description.toLowerCase().includes(search.toLowerCase())
  );

  const matchedIds = new Set(matchedSchemes?.map((s) => s.id));

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Government Schemes"
        description="Discover schemes and benefits for your business"
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search schemes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {!profileId && (
        <Card className="border-warning/50 bg-warning/5 shadow-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-warning/20 p-3">
              <Building2 className="h-6 w-6 text-warning" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Complete your profile</p>
              <p className="text-sm text-muted-foreground">
                Set up your startup profile to see personalized scheme recommendations
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="/onboarding">Set Up Profile</a>
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={profileId ? "matched" : "all"} className="space-y-6">
        <TabsList>
          {profileId && (
            <TabsTrigger value="matched" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              For You ({matchedSchemes?.length || 0})
            </TabsTrigger>
          )}
          <TabsTrigger value="all" className="gap-2">
            <FileText className="h-4 w-4" />
            All Schemes ({allSchemes?.length || 0})
          </TabsTrigger>
        </TabsList>

        {profileId && (
          <TabsContent value="matched" className="space-y-6">
            {matchedSchemes?.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-lg font-medium">No matched schemes</p>
                  <p className="text-sm text-muted-foreground">
                    Update your profile to find eligible schemes
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {matchedSchemes?.map((scheme, index) => (
                  <div
                    key={scheme.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <SchemeCard scheme={scheme} isMatched />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="all" className="space-y-6">
          {filteredSchemes?.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-lg font-medium">No schemes found</p>
                <p className="text-sm text-muted-foreground">Try a different search term</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSchemes?.map((scheme, index) => (
                <div
                  key={scheme.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <SchemeCard scheme={scheme} isMatched={matchedIds.has(scheme.id)} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
