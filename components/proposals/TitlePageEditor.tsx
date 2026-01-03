"use client";

import { FileText, Layout, Upload, X } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface TitlePageStyle {
  theme: "light" | "dark";
  layout: "centered" | "left-aligned" | "split";
  logoUrl?: string;
}

interface TitlePageEditorProps {
  title: string;
  titlePageStyle: TitlePageStyle;
  orientation: "portrait" | "landscape";
  onTitleChange: (title: string) => void;
  onStyleChange: (style: TitlePageStyle) => void;
  onOrientationChange: (orientation: "portrait" | "landscape") => void;
}

export default function TitlePageEditor({
  title,
  titlePageStyle,
  orientation,
  onTitleChange,
  onStyleChange,
  onOrientationChange,
}: TitlePageEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <Input
          label="Proposal Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter proposal title..."
        />
      </div>

      {/* Document Orientation */}
      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
          Document Orientation
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onOrientationChange("portrait")}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
              ${
                orientation === "portrait"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
              }
            `}
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Portrait</span>
          </button>
          <button
            onClick={() => onOrientationChange("landscape")}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
              ${
                orientation === "landscape"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
              }
            `}
          >
            <Layout className="h-4 w-4" />
            <span className="text-sm font-medium">Landscape</span>
          </button>
        </div>
      </div>

      {/* Theme Selector */}
      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
          Theme
        </label>
        <div className="flex gap-2">
          <button
            onClick={() =>
              onStyleChange({ ...titlePageStyle, theme: "light" })
            }
            className={`
              flex-1 px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium
              ${
                titlePageStyle.theme === "light"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
              }
            `}
          >
            Light
          </button>
          <button
            onClick={() =>
              onStyleChange({ ...titlePageStyle, theme: "dark" })
            }
            className={`
              flex-1 px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium
              ${
                titlePageStyle.theme === "dark"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
              }
            `}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Layout Selector */}
      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
          Layout
        </label>
        <div className="flex flex-col gap-2">
          <button
            onClick={() =>
              onStyleChange({
                ...titlePageStyle,
                layout: "centered",
              })
            }
            className={`
              w-full px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium text-left
              ${
                titlePageStyle.layout === "centered"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
              }
            `}
          >
            Centered
          </button>
          <button
            onClick={() =>
              onStyleChange({
                ...titlePageStyle,
                layout: "left-aligned",
              })
            }
            className={`
              w-full px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium text-left
              ${
                titlePageStyle.layout === "left-aligned"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
              }
            `}
          >
            Left Aligned
          </button>
          <button
            onClick={() =>
              onStyleChange({
                ...titlePageStyle,
                layout: "split",
              })
            }
            className={`
              w-full px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium text-left
              ${
                titlePageStyle.layout === "split"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                  : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
              }
            `}
          >
            Split
          </button>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
          Company Logo
        </label>
        {titlePageStyle.logoUrl ? (
          <div className="relative inline-block w-full">
            <div className="flex items-center justify-center p-4 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900">
              <img
                src={titlePageStyle.logoUrl}
                alt="Company Logo"
                className="h-12 w-auto object-contain max-w-full"
              />
              <button
                type="button"
                onClick={() =>
                  onStyleChange({
                    ...titlePageStyle,
                    logoUrl: undefined,
                  })
                }
                className="absolute top-1 right-1 p-1 bg-error-500 text-white rounded-full hover:bg-error-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            <div className="flex flex-col items-center justify-center pt-3 pb-2">
              <Upload className="h-5 w-5 mb-1 text-neutral-400" />
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Upload logo
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onStyleChange({
                      ...titlePageStyle,
                      logoUrl: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}

