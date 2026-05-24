import { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";
import MotionExplorationsClient from "@/components/motion/MotionExplorationsClient";

export const metadata: Metadata = {
  title: "Motion Explorations",
  description: "Kinetic typography experiments, visual loops, animated campaign studies, and motion tests.",
};

export default function MotionExplorationsPage() {
  return (
    <MainLayout>
      <MotionExplorationsClient />
    </MainLayout>
  );
}
