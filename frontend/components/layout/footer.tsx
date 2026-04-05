import Link from "next/link";
import { Brain } from "lucide-react";

/**
 * Footer Component
 * Site footer with navigation links and legal disclaimer.
 * Important: Includes medical disclaimer as this is a screening tool.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">AutiScreen</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered autism screening tool designed to support early detection and intervention.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/screening" className="text-muted-foreground hover:text-primary transition-colors">
                  Start Screening
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-muted-foreground hover:text-primary transition-colors">
                  Results
                </Link>
              </li>
              <li>
                <Link href="/guidance" className="text-muted-foreground hover:text-primary transition-colors">
                  Guidance
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/history" className="text-muted-foreground hover:text-primary transition-colors">
                  Session History
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground">About Autism</span>
              </li>
              <li>
                <span className="text-muted-foreground">FAQs</span>
              </li>
              <li>
                <span className="text-muted-foreground">Contact Support</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">Privacy Policy</span>
              </li>
              <li>
                <span className="text-muted-foreground">Terms of Service</span>
              </li>
              <li>
                <span className="text-muted-foreground">Data Protection</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer section */}
        <div className="mt-8 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <p className="text-sm text-warning-foreground">
            <strong>Important Disclaimer:</strong> This tool is designed for screening purposes only and 
            should not be used as a diagnostic instrument. Results should be discussed with qualified 
            healthcare professionals. Always consult with a licensed medical practitioner for proper 
            diagnosis and treatment recommendations.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AutiScreen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
