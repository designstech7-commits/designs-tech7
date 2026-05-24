import { Metadata } from "next";
import LoginClient from "@/components/auth/LoginClient";

export const metadata: Metadata = {
  title: "Client Login — Designs.Tech7",
  description: "Log in to the Designs.Tech7 client portal.",
};

export default function LoginPage() {
  return <LoginClient />;
}
