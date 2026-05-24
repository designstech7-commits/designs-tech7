import { Metadata } from "next";
import RegisterClient from "@/components/auth/RegisterClient";

export const metadata: Metadata = { title: "Create Account — Designs.Tech7" };

export default function RegisterPage() {
  return <RegisterClient />;
}
