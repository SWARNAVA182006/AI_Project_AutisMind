"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/**
 * Props interface for ScreeningCard component
 * Defines the structure for each screening module
 */
interface ScreeningCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  questionType: "slider" | "radio";
  sliderValue?: number;
  onSliderChange?: (value: number[]) => void;
  radioValue?: string;
  onRadioChange?: (value: string) => void;
  radioOptions?: { value: string; label: string }[];
  isActive?: boolean;
}

/**
 * ScreeningCard Component
 * Reusable card for each screening module (Eye Contact, Response to Name, etc.)
 * Supports both slider and radio button input types for flexibility.
 */
export function ScreeningCard({
  title,
  description,
  icon: Icon,
  questionType,
  sliderValue = 50,
  onSliderChange,
  radioValue,
  onRadioChange,
  radioOptions = [],
  isActive = false,
}: ScreeningCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isActive
          ? "border-primary shadow-lg ring-2 ring-primary/20"
          : "border-border hover:border-primary/30 hover:shadow-md"
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          {/* Icon container with primary color background */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Slider input type */}
        {questionType === "slider" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Rarely</span>
              <span className="font-medium text-foreground">{sliderValue}%</span>
              <span>Always</span>
            </div>
            <Slider
              value={[sliderValue]}
              onValueChange={onSliderChange}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        )}

        {/* Radio button input type */}
        {questionType === "radio" && (
          <RadioGroup value={radioValue} onValueChange={onRadioChange} className="space-y-3">
            {radioOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
                  radioValue === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer flex-1 font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}
