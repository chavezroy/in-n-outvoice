"use client";

import { Proposal } from "@/types/proposal";

interface TitlePageProps {
  proposal: Proposal;
}

// A4 page dimensions
const PAGE_DIMENSIONS = {
  portrait: {
    width: "210mm",
    minHeight: "297mm",
  },
  landscape: {
    width: "297mm",
    minHeight: "210mm",
  },
};

export default function TitlePage({ proposal }: TitlePageProps) {
  const isLandscape = proposal.orientation === "landscape";
  const pageDimensions = isLandscape
    ? PAGE_DIMENSIONS.landscape
    : PAGE_DIMENSIONS.portrait;

  const style = proposal.titlePageStyle || {
    theme: "light",
    layout: "centered",
  };

  const isDark = style.theme === "dark";
  const isCentered = style.layout === "centered";
  const isLeftAligned = style.layout === "left-aligned";
  const isSplit = style.layout === "split";

  return (
    <div
      className={`
        shadow-xl rounded-sm
        ${isDark ? "bg-neutral-900" : "bg-white"}
      `}
      style={{
        width: pageDimensions.width,
        minHeight: pageDimensions.minHeight,
        pageBreakAfter: "always",
      }}
    >
      <div
        className={`
          h-full p-12 flex flex-col
          ${isCentered && "items-center justify-center text-center"}
          ${isLeftAligned && "justify-center"}
          ${isSplit && "justify-between"}
        `}
      >
        {isSplit ? (
          <>
            {/* Split Layout */}
            <div className="flex-1 flex flex-col justify-center">
              <h1
                className={`
                  text-5xl font-bold mb-4
                  ${isDark ? "text-white" : "text-neutral-900"}
                `}
              >
                {proposal.title}
              </h1>
              <div
                className={`
                  text-lg
                  ${isDark ? "text-neutral-300" : "text-neutral-600"}
                `}
              >
                {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div
              className={`
                mt-auto pt-8 border-t-2 flex flex-col items-center gap-4
                ${isDark ? "border-neutral-700 text-neutral-400" : "border-neutral-200 text-neutral-500"}
              `}
            >
              {style.logoUrl && (
                <img
                  src={style.logoUrl}
                  alt="Company Logo"
                  className="h-12 w-auto object-contain opacity-80"
                />
              )}
              <p className="text-sm">Proposal Document</p>
            </div>
          </>
        ) : isLeftAligned ? (
          <>
            {/* Left-Aligned Layout */}
            <div className="flex-1 flex flex-col justify-center">
              <div
                className={`
                  w-16 h-1 mb-8
                  ${isDark ? "bg-primary-400" : "bg-primary-600"}
                `}
              />
              <h1
                className={`
                  text-5xl font-bold mb-6
                  ${isDark ? "text-white" : "text-neutral-900"}
                `}
              >
                {proposal.title}
              </h1>
              <div
                className={`
                  text-lg
                  ${isDark ? "text-neutral-300" : "text-neutral-600"}
                `}
              >
                {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Centered Layout (Default) */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {proposal.orientation && (
                <span
                  className={`
                    px-4 py-2 text-sm font-medium rounded-full mb-8
                    ${
                      isDark
                        ? "bg-primary-900/30 text-primary-300"
                        : "bg-primary-100 text-primary-700"
                    }
                  `}
                >
                  {proposal.orientation === "landscape"
                    ? "Landscape"
                    : "Portrait"}
                </span>
              )}
              <h1
                className={`
                  text-6xl font-bold mb-6
                  ${isDark ? "text-white" : "text-neutral-900"}
                `}
              >
                {proposal.title}
              </h1>
              <div
                className={`
                  text-xl
                  ${isDark ? "text-neutral-300" : "text-neutral-600"}
                `}
              >
                {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </>
        )}

        {/* Company Logo - Bottom Center (for Centered and Left-Aligned layouts) */}
        {!isSplit && style.logoUrl && (
          <div className="mt-auto pt-8 flex justify-center">
            <img
              src={style.logoUrl}
              alt="Company Logo"
              className="h-12 w-auto object-contain opacity-80"
            />
          </div>
        )}
      </div>
    </div>
  );
}

