"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RiskBadge, RiskLevel } from "@/components/results/risk-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Users,
  Phone,
  MapPin,
  ExternalLink,
  Heart,
  Lightbulb,
  MessageCircle,
  GraduationCap,
  Stethoscope,
  Home,
} from "lucide-react";
import Link from "next/link";

/**
 * Guidance content for each risk level
 * Contains recommendations, resources, and next steps
 */
const guidanceContent = {
  low: {
    icon: CheckCircle,
    title: "Low Risk Guidance",
    summary: "Your screening indicates typical developmental patterns. Continue monitoring and supporting healthy development.",
    recommendations: [
      {
        title: "Continue Regular Monitoring",
        description: "Keep track of developmental milestones and note any changes in behavior or communication patterns.",
        icon: BookOpen,
      },
      {
        title: "Maintain Enriching Environments",
        description: "Provide opportunities for social interaction, play, and learning that support overall development.",
        icon: Home,
      },
      {
        title: "Schedule Routine Check-ups",
        description: "Regular pediatric visits help ensure ongoing healthy development and early detection of any concerns.",
        icon: Stethoscope,
      },
      {
        title: "Stay Informed",
        description: "Learn about developmental milestones so you can recognize any changes that may warrant attention.",
        icon: GraduationCap,
      },
    ],
    resources: [
      { name: "CDC Developmental Milestones", url: "#" },
      { name: "AAP Healthy Children Resources", url: "#" },
      { name: "Zero to Three Development Guide", url: "#" },
    ],
  },
  moderate: {
    icon: AlertCircle,
    title: "Moderate Risk Guidance",
    summary: "Some areas may benefit from further evaluation. Consider scheduling a professional assessment.",
    recommendations: [
      {
        title: "Schedule Professional Evaluation",
        description: "Consult with a developmental pediatrician or child psychologist for comprehensive assessment.",
        icon: Stethoscope,
      },
      {
        title: "Consider Early Intervention",
        description: "Explore early intervention programs that can provide support while awaiting formal evaluation.",
        icon: Lightbulb,
      },
      {
        title: "Document Observations",
        description: "Keep detailed notes of behaviors, patterns, and concerns to share with healthcare providers.",
        icon: BookOpen,
      },
      {
        title: "Connect with Support Groups",
        description: "Join parent support groups to share experiences and learn from others in similar situations.",
        icon: Users,
      },
      {
        title: "Explore Speech-Language Assessment",
        description: "If communication concerns exist, a speech-language pathologist can provide valuable insights.",
        icon: MessageCircle,
      },
    ],
    resources: [
      { name: "Early Intervention Services", url: "#" },
      { name: "Find Developmental Specialists", url: "#" },
      { name: "Parent Support Networks", url: "#" },
      { name: "Speech-Language Pathology Directory", url: "#" },
    ],
  },
  high: {
    icon: AlertTriangle,
    title: "High Risk Guidance",
    summary: "The screening indicates areas of significant concern. We strongly recommend seeking professional evaluation promptly.",
    recommendations: [
      {
        title: "Seek Immediate Professional Evaluation",
        description: "Schedule a comprehensive diagnostic evaluation with a qualified specialist as soon as possible.",
        icon: Stethoscope,
      },
      {
        title: "Explore ABA Therapy Options",
        description: "Applied Behavior Analysis (ABA) is an evidence-based therapy that can be highly beneficial.",
        icon: GraduationCap,
      },
      {
        title: "Occupational Therapy Assessment",
        description: "OT can help address sensory processing and daily living skills challenges.",
        icon: Heart,
      },
      {
        title: "Speech-Language Therapy",
        description: "Communication support through speech therapy can significantly improve outcomes.",
        icon: MessageCircle,
      },
      {
        title: "Educational Support Planning",
        description: "Learn about Individualized Education Programs (IEPs) and special education services.",
        icon: BookOpen,
      },
      {
        title: "Connect with Autism Organizations",
        description: "Organizations like Autism Speaks can provide resources, support, and community connections.",
        icon: Users,
      },
    ],
    resources: [
      { name: "Autism Speaks Resource Guide", url: "#" },
      { name: "Find ABA Therapy Providers", url: "#" },
      { name: "Special Education Rights Guide", url: "#" },
      { name: "Insurance Coverage Resources", url: "#" },
      { name: "Family Support Services", url: "#" },
    ],
  },
};

/**
 * FAQ items for common questions
 */
const faqItems = [
  {
    question: "What is the difference between screening and diagnosis?",
    answer: "Screening is a preliminary assessment that identifies potential areas of concern, while diagnosis is a comprehensive evaluation performed by qualified professionals to definitively determine if a condition exists. Our screening tool helps identify if further evaluation may be beneficial.",
  },
  {
    question: "How accurate is this screening tool?",
    answer: "This screening tool is designed to identify potential areas of concern based on behavioral observations. However, it is not a diagnostic instrument. Many factors can influence screening results, and only a comprehensive professional evaluation can provide a definitive diagnosis.",
  },
  {
    question: "What should I do if the screening shows high risk?",
    answer: "If your screening results indicate high risk, we recommend scheduling an appointment with a developmental pediatrician, child psychologist, or autism specialist as soon as possible. Early intervention has been shown to significantly improve outcomes.",
  },
  {
    question: "How often should I complete the screening?",
    answer: "For children under 3, developmental changes occur rapidly. Consider repeating the screening every 3-6 months or whenever you notice significant behavioral changes. For older children, annual screenings or as recommended by healthcare providers.",
  },
  {
    question: "Can this tool be used for adults?",
    answer: "This screening tool is primarily designed for young children. Adult autism screening requires different assessment criteria and methods. If you have concerns about autism in an adult, please consult with a mental health professional who specializes in adult autism assessment.",
  },
  {
    question: "What is early intervention and why is it important?",
    answer: "Early intervention refers to services and support provided to young children with developmental delays or disabilities. Research shows that early intervention during the critical early years of brain development can significantly improve outcomes in communication, social skills, and overall functioning.",
  },
];

/**
 * GuidancePage Component
 * Provides detailed guidance, resources, and next steps based on risk level.
 * Features tabbed navigation for different risk levels and helpful FAQs.
 */
export default function GuidancePage() {
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>("low");
  const currentGuidance = guidanceContent[selectedRisk];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Page header */}
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-4">Guidance & Resources</h1>
            <p className="text-muted-foreground">
              Find personalized recommendations and resources based on your screening results. 
              Select your risk level to view relevant guidance.
            </p>
          </div>

          {/* Risk Level Tabs */}
          <Tabs
            value={selectedRisk}
            onValueChange={(value) => setSelectedRisk(value as RiskLevel)}
            className="max-w-4xl mx-auto"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="low" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Low Risk</span>
                <span className="sm:hidden">Low</span>
              </TabsTrigger>
              <TabsTrigger value="moderate" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Moderate Risk</span>
                <span className="sm:hidden">Moderate</span>
              </TabsTrigger>
              <TabsTrigger value="high" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">High Risk</span>
                <span className="sm:hidden">High</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content for each risk level */}
            {(["low", "moderate", "high"] as RiskLevel[]).map((risk) => {
              const guidance = guidanceContent[risk];
              return (
                <TabsContent key={risk} value={risk} className="space-y-8">
                  {/* Summary Card */}
                  <Card className="overflow-hidden">
                    <CardHeader className={`${
                      risk === "low" ? "bg-success/5 border-b border-success/20" :
                      risk === "moderate" ? "bg-warning/5 border-b border-warning/20" :
                      "bg-destructive/5 border-b border-destructive/20"
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
                          risk === "low" ? "bg-success/10" :
                          risk === "moderate" ? "bg-warning/10" :
                          "bg-destructive/10"
                        }`}>
                          <guidance.icon className={`h-7 w-7 ${
                            risk === "low" ? "text-success" :
                            risk === "moderate" ? "text-warning-foreground" :
                            "text-destructive"
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{guidance.title}</CardTitle>
                          <CardDescription className="mt-1 text-base">
                            {guidance.summary}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Recommendations Grid */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Recommended Actions
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {guidance.recommendations.map((rec, index) => (
                        <Card key={index} className="transition-shadow hover:shadow-md">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <rec.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground mb-1">
                                  {rec.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {rec.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Resources Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Helpful Resources
                      </CardTitle>
                      <CardDescription>
                        External links to reputable organizations and information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {guidance.resources.map((resource, index) => (
                          <li key={index}>
                            <a
                              href={resource.url}
                              className="flex items-center gap-2 text-primary hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                              {resource.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Contact & Emergency Support */}
          <div className="max-w-4xl mx-auto mt-12 grid gap-4 md:grid-cols-2">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Need to Talk?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Connect with trained specialists who can answer your questions.
                    </p>
                    <Button variant="outline" size="sm">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Find Local Services
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Locate specialists and support services in your area.
                    </p>
                    <Button variant="outline" size="sm">
                      Find Providers
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <Card>
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-8 pb-8">
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Ready to Take the Next Step?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start a new screening or review your previous results.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button asChild>
                    <Link href="/screening">Start Screening</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/history">View History</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
