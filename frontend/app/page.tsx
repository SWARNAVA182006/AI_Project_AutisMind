import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Brain,
  Eye,
  Ear,
  MessageSquare,
  Hand,
  RotateCcw,
  Shield,
  Clock,
  HeartHandshake,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

/**
 * Landing Page Component
 * The main entry point for the Autism Screening application.
 * Introduces the tool, its features, and includes important disclaimers.
 */
export default function LandingPage() {
  // Feature cards data - showcasing the 5 screening modules
  const screeningModules = [
    {
      icon: Eye,
      title: "Eye Contact",
      description: "Assesses patterns of eye contact and visual attention during social interactions.",
    },
    {
      icon: Ear,
      title: "Response to Name",
      description: "Evaluates how consistently the child responds when their name is called.",
    },
    {
      icon: MessageSquare,
      title: "Vocalization",
      description: "Analyzes speech patterns, babbling, and verbal communication attempts.",
    },
    {
      icon: Hand,
      title: "Gestures & Pointing",
      description: "Observes use of gestures for communication and shared attention.",
    },
    {
      icon: RotateCcw,
      title: "Repetitive Behavior",
      description: "Identifies repetitive movements, routines, or restricted interests.",
    },
  ];

  // Why choose us - key benefits
  const benefits = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is secure and confidential. We follow strict healthcare privacy standards.",
    },
    {
      icon: Clock,
      title: "Quick Assessment",
      description: "Complete the screening in just 5-10 minutes from the comfort of your home.",
    },
    {
      icon: HeartHandshake,
      title: "Professional Guidance",
      description: "Receive personalized recommendations and next steps based on results.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
                <Brain className="h-4 w-4" />
                <span>AI-Powered Screening Tool</span>
              </div>

              {/* Main headline */}
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Early Detection for
                <span className="text-primary"> Autism Spectrum</span>
              </h1>

              {/* Subheadline */}
              <p className="mb-8 text-lg text-muted-foreground lg:text-xl text-pretty">
                A comprehensive, AI-assisted screening tool designed to help identify early 
                signs of autism. Quick, accessible, and designed with families in mind.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="text-base">
                  <Link href="/screening">
                    Start Screening
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link href="/guidance">Learn More</Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Free to Use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>5-Minute Assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Banner */}
        <section className="border-y border-warning/30 bg-warning/5 py-4">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-warning-foreground">
              <strong>Important:</strong> This is a screening tool, not a diagnostic instrument. 
              Results should be discussed with qualified healthcare professionals for proper evaluation.
            </p>
          </div>
        </section>

        {/* Screening Modules Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                Comprehensive 5-Module Assessment
              </h2>
              <p className="text-muted-foreground">
                Our screening covers five key behavioral areas to provide a thorough evaluation.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {screeningModules.map((module, index) => (
                <Card key={index} className="transition-all hover:shadow-lg hover:border-primary/30">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <module.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {module.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                Why Choose AutiScreen?
              </h2>
              <p className="text-muted-foreground">
                Designed with care, backed by research-informed methods.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-3xl overflow-hidden">
              <CardContent className="p-8 md:p-12 text-center">
                <Brain className="mx-auto mb-6 h-12 w-12 text-primary" />
                <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
                  Ready to Begin?
                </h2>
                <p className="mb-8 text-muted-foreground max-w-xl mx-auto">
                  Take the first step towards understanding. Our screening process is 
                  quick, confidential, and designed to support you every step of the way.
                </p>
                <Button asChild size="lg" className="text-base">
                  <Link href="/screening">
                    Start Free Screening
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
