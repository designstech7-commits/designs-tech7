import { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";
import AboutClient from "@/components/layout/AboutClient";

export const metadata: Metadata = {
  title: "About Studio",
  description: "Studio philosophy, design methodology, creative approach, and visual manifesto.",
};

export default function AboutPage() {
  return (
    <MainLayout>
      <AboutClient />
    </MainLayout>
  );
}
