"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { BrandingSettings as BrandingSettingsType } from "@/types/user";

interface BrandingSettingsProps {
  branding?: BrandingSettingsType;
  onSave: (branding: BrandingSettingsType) => void;
}

export default function BrandingSettings({
  branding,
  onSave,
}: BrandingSettingsProps) {
  const [formData, setFormData] = useState<BrandingSettingsType>({
    companyName: branding?.companyName || "",
    primaryColor: branding?.primaryColor || "#3b82f6",
    secondaryColor: branding?.secondaryColor || "#a855f7",
    logoUrl: branding?.logoUrl || "",
  });

  const handleChange = (field: keyof BrandingSettingsType, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement actual file upload
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("logoUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">
        Branding Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Company Name"
          value={formData.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
          placeholder="Your Company Name"
        />

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Company Logo
          </label>
          {formData.logoUrl ? (
            <div className="relative inline-block">
              <img
                src={formData.logoUrl}
                alt="Logo"
                className="h-20 w-auto object-contain rounded-lg border-2 border-neutral-200 dark:border-neutral-800"
              />
              <button
                type="button"
                onClick={() => handleChange("logoUrl", "")}
                className="absolute -top-2 -right-2 p-1 bg-error-500 text-white rounded-full hover:bg-error-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 mb-2 text-neutral-400" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Click to upload logo
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </label>
          )}
        </div>

        {/* Color Picker */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Primary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="h-10 w-20 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 cursor-pointer"
              />
              <Input
                value={formData.primaryColor}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Secondary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) =>
                  handleChange("secondaryColor", e.target.value)
                }
                className="h-10 w-20 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 cursor-pointer"
              />
              <Input
                value={formData.secondaryColor}
                onChange={(e) =>
                  handleChange("secondaryColor", e.target.value)
                }
                placeholder="#a855f7"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Save Branding
          </Button>
        </div>
      </form>
    </Card>
  );
}

